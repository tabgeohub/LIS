import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { userInfo } from "node:os";
import { Pool } from "pg";
import { migrationConfig } from "./config";
import { captureFlightSnapshot } from "./sourceSnapshot";
import { buildProposal, importPayload } from "./destination";

async function main() {
  // Fixed disposable names prevent this fixture from targeting a configured LIS database.
  const source = new Pool({ host: "localhost", port: 55477, database: "lis_source_fixture", user: userInfo().username });
  const destination = new Pool({ host: "localhost", port: 55477, database: "lis_destination_fixture", user: userInfo().username });
  try {
    await source.query("TRUNCATE lis.migration_entity_mappings, lis.migration_transfers, lis.migration_previews, lis.logging, lis.finished_plans_path, lis.finished_plans, lis.attachments, lis.flightplans, lis.points, lis.geometries RESTART IDENTITY CASCADE");
    await destination.query("TRUNCATE lis.migration_entity_mappings, lis.migration_transfers, lis.migration_previews, lis.logging, lis.finished_plans_path, lis.finished_plans, lis.attachments, lis.flightplans, lis.points, lis.geometries RESTART IDENTITY CASCADE");
    const geometry = (await source.query<{ id: number }>("INSERT INTO lis.geometries (omschrijving,regio_id,type,created_at) VALUES ('Line 1','RWS A','line','2025-01-01') RETURNING id")).rows[0];
    const point = (await source.query<{ id: number }>("INSERT INTO lis.points (omschrijving,regio_id,user_id,geometry_id,latitude,longitude,xcoordinaat_rd,ycoordinaat_rd,created_at,status) VALUES ('Vertex 1','RWS A','source-user',$1,1,2,3,4,'2025-01-01','not visited') RETURNING id", [geometry.id])).rows[0];
    const secondPoint = (await source.query<{ id: number }>("INSERT INTO lis.points (omschrijving,regio_id,user_id,geometry_id,latitude,longitude,xcoordinaat_rd,ycoordinaat_rd,created_at,status) VALUES ('Vertex 2','RWS A','source-user',$1,5,6,7,8,'2025-01-01','not visited') RETURNING id", [geometry.id])).rows[0];
    const flight = (await source.query<{ id: number }>("INSERT INTO lis.flightplans (vluchtnummer,regio_id,user_id,datum,created_at,status,points,waarnemer) VALUES ('F-1','RWS A','source-user','2025-01-03','2025-01-02','finished',$1,'Observer') RETURNING id", [[point.id, secondPoint.id]])).rows[0];
    const attachment = (await source.query<{ id: number }>("INSERT INTO lis.attachments (point_id,attachmentid,url,taken_at,location) VALUES ($1,88,'https://arcgis.example/photos/88','2025-01-03 09:00+00','POINT(1 2)') RETURNING id", [point.id])).rows[0];
    await source.query("INSERT INTO lis.finished_plans (plan_id,point_id,point_order,attachments_id,pointcomment,status,spoed,emailadres,finished_at) VALUES ($1,$2,1,$3,'observed','finished',false,'','2025-01-03 10:00+00'),($1,$4,2,'{}','second','finished',false,'','2025-01-03 10:02+00')", [flight.id, point.id, [attachment.id], secondPoint.id]);
    await source.query("INSERT INTO lis.finished_plans_path (planid,path,flighttime) VALUES ($1,'[]','01:00:00')", [flight.id]);
    await source.query("INSERT INTO lis.logging (flight_id,planid,pointid,userid,message,date) VALUES (8,$1,$2,'source-user','event','2025-01-03 10:01+00'),(9,$1,$3,'source-user','second event','2025-01-03 10:03+00')", [flight.id, point.id, secondPoint.id]);
    const privateKey = generateKeyPairSync("ed25519").privateKey.export({ type: "pkcs8", format: "pem" }).toString();
    const config = migrationConfig({ sourceInstance: "11111111-1111-4111-8111-111111111111", exportKeyId: "fixture", exportPrivateKey: privateKey });
    const signed = await captureFlightSnapshot(source, String(flight.id), { subject: "source-admin", issuer: "https://keycloak.example/realms/tst" }, config);
    assert.equal(signed.payload.records.completions.length, 2);
    assert.equal(signed.payload.records.attachments.length, 1);
    assert.equal(signed.payload.records.logs.length, 2);
    const client = await destination.connect();
    try {
      const proposal = await buildProposal(client, signed.payload, "RWS B") as any;
      assert.equal(proposal.ready, true);
      await client.query("BEGIN");
      const result = await importPayload(client, signed.payload, "RWS B", { subject: "prod-admin" });
      await client.query("COMMIT");
      const imported = (await destination.query("SELECT * FROM lis.flightplans WHERE id=$1", [result.destinationFlightId])).rows[0];
      assert.equal(imported.regio_id, "RWS B");
      assert.equal(imported.user_id, "prod-admin");
      const sourceCreatedAt = (await source.query("SELECT created_at FROM lis.flightplans WHERE id=$1", [flight.id])).rows[0].created_at;
      assert.equal(imported.created_at.toISOString(), sourceCreatedAt.toISOString());
      assert.equal((await destination.query("SELECT pointcomment FROM lis.finished_plans WHERE plan_id=$1", [result.destinationFlightId])).rows[0].pointcomment, "observed");
      assert.equal((await destination.query("SELECT userid FROM lis.logging WHERE planid=$1", [result.destinationFlightId])).rows[0].userid, "source-user");
      assert.equal((await destination.query("SELECT attachmentid,url FROM lis.attachments ORDER BY id")).rows[0].attachmentid, 88);
      assert.equal((await destination.query("SELECT attachmentid,url FROM lis.attachments ORDER BY id")).rows[0].url, "https://arcgis.example/photos/88");
      assert.equal((await destination.query("SELECT count(DISTINCT flight_id)::int AS count FROM lis.logging WHERE planid=$1", [result.destinationFlightId])).rows[0].count, 2);
      assert.equal(result.mappings.filter(mapping => mapping.type === "log_group").length, 2);
      const vertices = await destination.query("SELECT p.omschrijving FROM lis.points p JOIN lis.geometries g ON p.geometry_id=g.id WHERE g.omschrijving='Line 1' ORDER BY p.id");
      assert.deepEqual(vertices.rows.map(row => row.omschrijving), ["Vertex 1", "Vertex 2"]);
      assert.equal((await destination.query("SELECT path FROM lis.finished_plans_path WHERE planid=$1", [result.destinationFlightId])).rows.length, 1);
      assert.equal(result.mappings.some(mapping => mapping.type === "log_group"), true);
      // The destination uniqueness constraint is the final guard against a
      // second successful transfer, even from a different admin or preview.
      await destination.query("INSERT INTO lis.migration_transfers (operation_id,source_instance,source_flight_id,export_id,export_digest,destination_flight_id,destination_region,source_actor_subject,source_actor_issuer,destination_actor_subject,destination_actor_issuer,completed_at) VALUES ('11111111-1111-4111-8111-111111111112','11111111-1111-4111-8111-111111111111',$1,'11111111-1111-4111-8111-111111111113','digest',$2,'RWS B','source-admin','tst','prod-admin','prod',NOW())", [String(flight.id), result.destinationFlightId]);
      await assert.rejects(destination.query("INSERT INTO lis.migration_transfers (operation_id,source_instance,source_flight_id,export_id,export_digest,destination_flight_id,destination_region,source_actor_subject,source_actor_issuer,destination_actor_subject,destination_actor_issuer,completed_at) VALUES ('11111111-1111-4111-8111-111111111114','11111111-1111-4111-8111-111111111111',$1,'11111111-1111-4111-8111-111111111115','other',$2,'RWS A','other','tst','other','prod',NOW())", [String(flight.id), result.destinationFlightId]), /duplicate key value/);
      const before = (await destination.query("SELECT count(*)::int AS count FROM lis.flightplans")).rows[0].count;
      await client.query("BEGIN");
      await importPayload(client, signed.payload, "RWS B", { subject: "prod-admin" });
      await client.query("ROLLBACK");
      assert.equal((await destination.query("SELECT count(*)::int AS count FROM lis.flightplans")).rows[0].count, before);
      const invalid = structuredClone(signed.payload);
      (invalid.records.attachments[0] as any).point_id = 999999;
      await client.query("BEGIN");
      await assert.rejects(importPayload(client, invalid, "RWS B", { subject: "prod-admin" }), /MISSING_POINT_MAPPING/);
      await client.query("ROLLBACK");
      assert.equal((await destination.query("SELECT count(*)::int AS count FROM lis.flightplans")).rows[0].count, before);
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  } finally { await source.end(); await destination.end(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
