import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Pool, type PoolClient } from "pg";
import { buildProposal, ensureImportSchema, importPayload } from "./destination";
import { validateRecordLinks, type FlightMigrationExportV1 } from "../../migrations/exportContract";

// Explicit private socket only: never read database settings from .env.
const socket = process.argv[2];
if (!socket?.startsWith("/private/tmp/lis-import-no-fk.") || socket.includes("..")) throw new Error("Provide the disposable test-cluster socket directory");
const database = `lis_fixture_${randomUUID().replace(/-/g, "")}`;
const options = { host: socket, port: 55483, user: process.env.USER, database: "postgres" };

function fixture(): FlightMigrationExportV1 {
  const p = (id: number, geometry_id: number | null) => ({ id, geometry_id, regio_id: "TST", user_id: "source-admin", omschrijving: `P${id}`, latitude: id, longitude: id + 1, xcoordinaat_rd: id + 2, ycoordinaat_rd: id + 3 });
  const a = p(1, null), b = p(2, 11), c = p(3, 11);
  return {
    version: 1, source: { instance: "fixture", environment: "TST", issuer: "fixture", flightId: "9" }, exportId: "fixture", exportedBy: { subject: "fixture", issuer: "fixture" }, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 3600000).toISOString(),
    records: {
      flight: { id: 9, regio_id: "TST", user_id: "source-admin", status: "finished", points: [3, 1, 2], vluchtnummer: "SYNTHETIC-9", datum: "2026-11-03" },
      points: [c, a, b], geometries: [{ id: 11, regio_id: "TST", omschrijving: "G", type: "line", vertices: [b, c] }],
      completions: [3, 1, 2].map((point_id, index) => ({ plan_id: 9, point_id, point_order: index + 1, attachments_id: point_id === 1 ? [21] : [], finished_at: point_id === 1 ? "14:32:10.123456" : null })),
      attachments: [{ id: 21, point_id: 1, attachmentid: 5511, url: "https://services-eu1.arcgis.com/fixture/FeatureServer/0/5511/attachments/35984", taken_at: "2026-11-03T14:32:10Z", location: "1,2" }],
      path: { planid: 9, path: [[1, 2], [3, 4]], flighttime: "123.5" }, logs: [{ pointid: 0, planid: 9 }],
    }, counts: { points: 3, geometries: 1, completions: 3, attachments: 1, logs: 1 },
  };
}

async function run() {
  const admin = new Pool(options);
  let db: Pool | undefined;
  try {
    await admin.query(`CREATE DATABASE "${database}"`);
    db = new Pool({ ...options, database });
    await db.query(`CREATE SCHEMA lis;
      CREATE TABLE lis.geometries (id serial PRIMARY KEY, regio_id text, omschrijving text, type text);
      CREATE TABLE lis.points (id serial PRIMARY KEY, geometry_id integer, regio_id text, user_id text, omschrijving text, latitude double precision, longitude double precision, xcoordinaat_rd double precision, ycoordinaat_rd double precision);
      CREATE TABLE lis.flightplans (id serial PRIMARY KEY, regio_id text, user_id text, status text, points integer[], vluchtnummer text, datum date);
      CREATE TABLE lis.finished_plans (plan_id integer, point_id integer, point_order integer, attachments_id integer[], finished_at time);
      CREATE TABLE lis.attachments (id serial PRIMARY KEY, point_id integer, attachmentid integer, url text, taken_at timestamptz, location text);
      CREATE TABLE lis.finished_plans_path (planid integer, path jsonb, flighttime numeric);
      ALTER SEQUENCE lis.geometries_id_seq RESTART WITH 1000;
      ALTER SEQUENCE lis.points_id_seq RESTART WITH 2000;
      ALTER SEQUENCE lis.flightplans_id_seq RESTART WITH 3000;
      ALTER SEQUENCE lis.attachments_id_seq RESTART WITH 4000;`);
    const client = await db.connect();
    try {
      await ensureImportSchema(client);
      const payload = fixture();
      const before = JSON.stringify(payload);
      assert.equal((await buildProposal(client, payload, "RWS NN") as any).ready, true);
      assert.equal((await client.query("SELECT count(*) FROM lis.flightplans")).rows[0].count, "0", "preview is read-only");
      await client.query("BEGIN");
      const result = await importPayload(client, payload, "RWS NN", { subject: "prod-admin" });
      await client.query("COMMIT");
      assert.equal(JSON.stringify(payload), before);
      const mapping = (type: string, source: string) => Number(result.mappings.find(row => row.type === type && row.source === source)!.destination);
      const flight = (await client.query("SELECT * FROM lis.flightplans")).rows[0];
      assert.deepEqual(flight.points, [mapping("point", "3"), mapping("point", "1"), mapping("point", "2")]);
      assert.equal(flight.regio_id, "RWS NN");
      assert.deepEqual((await client.query("SELECT omschrijving FROM lis.points WHERE geometry_id=$1 ORDER BY id", [mapping("geometry", "11")])).rows.map(row => row.omschrijving), ["P2", "P3"]);
      const completions = (await client.query("SELECT * FROM lis.finished_plans ORDER BY point_order")).rows;
      assert.deepEqual(completions.map(row => row.point_id), flight.points);
      assert(completions.every(row => row.plan_id === Number(result.destinationFlightId)));
      assert.equal(completions[1].finished_at, "14:32:10.123456");
      assert.equal(completions[0].finished_at, null);
      const attachment = (await client.query("SELECT * FROM lis.attachments")).rows[0];
      assert.equal(attachment.id, mapping("attachment", "21"));
      assert.equal(attachment.attachmentid, 5511);
      assert.deepEqual(completions[1].attachments_id, [attachment.id]);
      const path = (await client.query("SELECT * FROM lis.finished_plans_path")).rows[0];
      assert.equal(path.planid, Number(result.destinationFlightId));
      assert.deepEqual(path.path, [[1, 2], [3, 4]]);
      assert.equal(Number(path.flighttime), 123.5);
      assert.equal((await client.query("SELECT to_regclass('lis.logging') AS table_name")).rows[0].table_name, null, "logging is not required or created");
      const pointsBefore = (await client.query("SELECT * FROM lis.points ORDER BY id")).rows;
      const reuse = await buildProposal(client, payload, "RWS NN") as any;
      assert(reuse.mappings.points.every((row: any) => row.action === "reuse"));
      assert(reuse.mappings.geometries.every((row: any) => row.action === "reuse"));
      await client.query("BEGIN");
      const reused = await importPayload(client, payload, "RWS NN", { subject: "second-admin" });
      assert(reused.mappings.filter(row => row.type === "point" || row.type === "geometry").every(row => !row.created));
      assert.deepEqual((await client.query("SELECT * FROM lis.points ORDER BY id")).rows, pointsBefore);
      await client.query("ROLLBACK");

      // A failure at each of the ten INSERTs must roll back all earlier rows.
      for (let failure = 1; failure <= 10; failure++) {
        const fresh = fixture();
        for (const point of fresh.records.points as any[]) point.omschrijving += "-new";
        for (const geometry of fresh.records.geometries as any[]) {
          geometry.omschrijving += "-new";
          for (const vertex of geometry.vertices) vertex.omschrijving += "-new";
        }
        let writes = 0;
        const failing = { query: async (sql: string, values?: any[]) => {
          if (sql.startsWith("INSERT INTO") && ++writes === failure) throw new Error("synthetic write failure");
          return client.query(sql, values);
        } } as unknown as PoolClient;
        await client.query("BEGIN");
        await assert.rejects(importPayload(failing, fresh, "RWS NN", { subject: "prod-admin" }), /synthetic write failure/);
        await client.query("ROLLBACK");
        assert.equal((await client.query("SELECT count(*) FROM lis.flightplans")).rows[0].count, "1");
        assert.equal((await client.query("SELECT count(*) FROM lis.geometries")).rows[0].count, "1");
        assert.equal((await client.query("SELECT count(*) FROM lis.finished_plans")).rows[0].count, "3");
        assert.equal((await client.query("SELECT count(*) FROM lis.attachments")).rows[0].count, "1");
        assert.equal((await client.query("SELECT count(*) FROM lis.finished_plans_path")).rows[0].count, "1");
        assert.deepEqual((await client.query("SELECT * FROM lis.points ORDER BY id")).rows, pointsBefore);
      }
      for (const breakLink of [
        (bad: FlightMigrationExportV1) => { (bad.records.points[0] as any).geometry_id = 999; },
        (bad: FlightMigrationExportV1) => { (bad.records.completions[0] as any).plan_id = 999; },
        (bad: FlightMigrationExportV1) => { (bad.records.completions[0] as any).attachments_id = [21]; },
        (bad: FlightMigrationExportV1) => { (bad.records.attachments[0] as any).point_id = 999; },
        (bad: FlightMigrationExportV1) => { (bad.records.path as any).planid = 999; },
      ]) {
        const bad = fixture(); breakLink(bad);
        assert.throws(() => validateRecordLinks(bad), /INVALID_EXPORT_STRUCTURE/);
        await assert.rejects(buildProposal(client, bad, "RWS NN"), /INVALID_EXPORT_STRUCTURE/);
      }
      const tables = (await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='lis' ORDER BY table_name")).rows.map(row => row.table_name);
      assert.deepEqual(tables, ["attachments", "finished_plans", "finished_plans_path", "flightplans", "geometries", "points"]);
      console.log("Disposable PostgreSQL: no-FK preview/import, vertex/visit order, time precision/nulls, relationships, reuse, rollback at all ten write stages passed");
    } finally { client.release(); }
  } finally {
    await db?.end();
    await admin.query(`DROP DATABASE IF EXISTS "${database}"`);
    await admin.end();
  }
}
void run().catch(error => { console.error(error); process.exitCode = 1; });
