import type { PoolClient, Pool } from "pg";
import { buildLogInsertQuery, buildLogInsertValues, type LogInsertInput } from "../../helpers/queries/logs/logFields";

export function normalizedLog(log: LogInsertInput): LogInsertInput {
  return { ...log, oldData: log.oldData ?? null, newData: log.newData ?? null, currentLocation: log.currentLocation ?? null };
}
/** Both legacy and iOS writers must call this within their transaction. */
export async function insertLogBatch(client: Pick<PoolClient, "query">, logs: LogInsertInput[]): Promise<number> {
  await client.query("SELECT pg_advisory_xact_lock(hashtext('lis.logging.flight_id'))");
  const id = Number((await client.query("SELECT COALESCE(MAX(flight_id), 0) + 1 AS flight_id FROM lis.logging")).rows[0].flight_id);
  for (const log of logs) await client.query(buildLogInsertQuery(), buildLogInsertValues(id, normalizedLog(log)));
  return id;
}
export async function writeLogBatch(db: Pick<Pool, "connect">, logs: LogInsertInput[]): Promise<number> {
  const client = await db.connect();
  try { await client.query("BEGIN"); const id = await insertLogBatch(client, logs); await client.query("COMMIT"); return id; }
  catch (error) { try { await client.query("ROLLBACK"); } catch {} throw error; }
  finally { client.release(); }
}
