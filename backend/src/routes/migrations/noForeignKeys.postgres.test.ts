import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Pool, type PoolClient } from "pg";
import { buildProposal, ensureImportSchema, importPayload } from "./destination";
import { validateRecordLinks, type FlightMigrationExportV1 } from "../../migrations/exportContract";
import { renamedPoints } from "../../migrations/pointProposal";

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
      const result = await importPayload(client, payload, "RWS NN", { subject: "prod-admin" }, []);
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
      const reused = await importPayload(client, payload, "RWS NN", { subject: "second-admin" }, []);
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
        await assert.rejects(importPayload(failing, fresh, "RWS NN", { subject: "prod-admin" }, []), /synthetic write failure/);
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

      const adHoc = fixture();
      (adHoc.records.points.find((point: any) => point.id === 1) as any).omschrijving = "Ad hoc waarneming 1";
      for (const geometry of adHoc.records.geometries as any[]) {
        geometry.omschrijving += "-ad-hoc-fixture";
        for (const vertex of geometry.vertices) vertex.omschrijving += "-ad-hoc-fixture";
      }
      const originalAdHoc = JSON.stringify(adHoc);
      const snapshot = async () => {
        const rows: unknown[] = [];
        for (const table of tables) rows.push((await client.query(`SELECT COALESCE(jsonb_agg(to_jsonb(t) ORDER BY to_jsonb(t)::text), '[]'::jsonb) AS rows FROM lis.${table} t`)).rows[0].rows);
        return rows;
      };
      await client.query("BEGIN");
      await client.query("INSERT INTO lis.points (omschrijving,regio_id,user_id,latitude,longitude,xcoordinaat_rd,ycoordinaat_rd) VALUES ('Ad hoc waarneming 1','RWS NN','original-owner',1,2,3,4), ('Ad hoc waarneming 1','other region','other-owner',1,2,3,4)");
      const baseline = await snapshot();
      const adHocPreview = await buildProposal(client, adHoc, "RWS NN");
      assert.equal(adHocPreview.ready, true);
      const confirmation = renamedPoints(adHocPreview.mappings.points);
      assert.equal(confirmation.length, 1);
      assert.match(confirmation[0].destinationName, /^Ad hoc waarneming 1-\d{6}$/);
      assert.deepEqual(await buildProposal(client, adHoc, "RWS NN"), adHocPreview);
      assert.deepEqual(await snapshot(), baseline, "preview makes no writes");

      // Every stage of a renamed-point import rolls back without touching the
      // old points or any unrelated business rows.
      for (let failure = 1; failure <= 10; failure++) {
        await client.query("SAVEPOINT renamed_attempt");
        let writes = 0;
        const failing = { query: async (sql: string, values?: any[]) => {
          if (sql.startsWith("INSERT INTO") && ++writes === failure) throw new Error("synthetic renamed write failure");
          return client.query(sql, values);
        } } as unknown as PoolClient;
        await assert.rejects(importPayload(failing, adHoc, "RWS NN", { subject: "prod-admin" }, confirmation), /synthetic renamed write failure/);
        await client.query("ROLLBACK TO SAVEPOINT renamed_attempt");
        assert.deepEqual(await snapshot(), baseline);
      }
      for (const tampered of [undefined, [], [{ ...confirmation[0], destinationName: "choose-any-name" }]]) {
        let writes = 0;
        const monitor = { query: async (sql: string, values?: any[]) => { if (sql.startsWith("INSERT INTO")) writes++; return client.query(sql, values); } } as unknown as PoolClient;
        await assert.rejects(importPayload(monitor, adHoc, "RWS NN", { subject: "prod-admin" }, tampered), /PREVIEW_CHANGED/);
        assert.equal(writes, 0);
        assert.deepEqual(await snapshot(), baseline);
      }
      await client.query("SAVEPOINT name_limit");
      await client.query(`ALTER TABLE lis.points ALTER COLUMN omschrijving TYPE varchar(${confirmation[0].destinationName.length - 1})`);
      const tooLong = await buildProposal(client, adHoc, "RWS NN");
      assert.equal(tooLong.ready, false);
      assert(tooLong.conflicts.some(conflict => conflict.includes("name length")));
      await client.query("ROLLBACK TO SAVEPOINT name_limit");

      const renamedResult = await importPayload(client, adHoc, "RWS NN", { subject: "prod-admin" }, confirmation);
      const renamedPoint = (await client.query("SELECT * FROM lis.points WHERE omschrijving=$1", [confirmation[0].destinationName])).rows[0];
      assert.equal(renamedPoint.user_id, "prod-admin");
      assert.equal(renamedPoint.regio_id, "RWS NN");
      assert.deepEqual([renamedPoint.latitude, renamedPoint.longitude, renamedPoint.xcoordinaat_rd, renamedPoint.ycoordinaat_rd], [1, 2, 3, 4]);
      const newFlight = (await client.query("SELECT * FROM lis.flightplans WHERE id=$1", [renamedResult.destinationFlightId])).rows[0];
      assert.equal(newFlight.points[1], renamedPoint.id);
      const newCompletion = (await client.query("SELECT * FROM lis.finished_plans WHERE plan_id=$1 AND point_order=2", [renamedResult.destinationFlightId])).rows[0];
      assert.equal(newCompletion.point_id, renamedPoint.id);
      const newPhoto = (await client.query("SELECT * FROM lis.attachments WHERE id=$1", [newCompletion.attachments_id[0]])).rows[0];
      assert.equal(newPhoto.point_id, renamedPoint.id);
      assert.equal(newPhoto.attachmentid, 5511);
      assert.equal(newPhoto.url, (adHoc.records.attachments[0] as any).url);
      assert.equal(JSON.stringify(adHoc), originalAdHoc, "signed package remains immutable");
      assert.deepEqual((await client.query("SELECT user_id FROM lis.points WHERE omschrijving='Ad hoc waarneming 1' ORDER BY id")).rows.map(row => row.user_id), ["original-owner", "other-owner"]);
      await client.query("ROLLBACK");

      // Two admins preview the same suffix. The second import must wait for
      // the first transaction and then reject the stale name before writes.
      await client.query("INSERT INTO lis.points (omschrijving) VALUES ('Ad hoc waarneming 1')");
      const sharedPreview = await buildProposal(client, adHoc, "RWS NN");
      const sharedConfirmation = renamedPoints(sharedPreview.mappings.points);
      const second = await db.connect();
      try {
        await client.query("BEGIN");
        await second.query("BEGIN");
        await importPayload(client, adHoc, "RWS NN", { subject: "first-admin" }, sharedConfirmation);
        const waiting = assert.rejects(importPayload(second, adHoc, "RWS NN", { subject: "second-admin" }, sharedConfirmation), /PREVIEW_CHANGED/);
        await client.query("COMMIT");
        await waiting;
        await second.query("ROLLBACK");
        assert.equal((await client.query("SELECT count(*) FROM lis.flightplans")).rows[0].count, "2");
        const refreshed = await buildProposal(client, adHoc, "RWS NN");
        assert.equal(refreshed.ready, true);
        assert.notEqual(renamedPoints(refreshed.mappings.points)[0].destinationName, sharedConfirmation[0].destinationName);
      } finally { second.release(); }
      console.log("Disposable PostgreSQL: Ad hoc rename, confirmed names, VARCHAR limits, completion/photo mapping, ten-stage rollback, and simultaneous admins passed");
    } finally { client.release(); }
  } finally {
    await db?.end();
    await admin.query(`DROP DATABASE IF EXISTS "${database}"`);
    await admin.end();
  }
}
void run().catch(error => { console.error(error); process.exitCode = 1; });
