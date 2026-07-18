import type { Response } from "express";
import type { PoolClient } from "pg";
import { runGeometryUpdateTransaction } from "../../helpers/queries/geometries/updateGeometryTransaction";

export async function commitGeometryUpdate(input: {
  client: PoolClient;
  res: Response;
  geometryId: number;
  metadata: Record<string, unknown>;
  points: unknown[] | undefined;
}): Promise<void> {
  const { client, res, geometryId, metadata, points } = input;
  await client.query("BEGIN");

  const outcome = await runGeometryUpdateTransaction({
    client,
    geometryId,
    metadata,
    points,
  });

  if (!outcome.ok) {
    await client.query("ROLLBACK");
    res.status(outcome.status).json({ result: null, message: outcome.message });
    return;
  }

  await client.query("COMMIT");
  res.status(200).json({
    result: outcome.result,
    message: "Geometrie succesvol bijgewerkt",
  });
}

export async function rollbackGeometryUpdateError(input: {
  client: PoolClient;
  res: Response;
  err: unknown;
}): Promise<void> {
  await input.client.query("ROLLBACK");
  console.error(
    "Error updating geometry:",
    input.err instanceof Error ? input.err.message : String(input.err)
  );
  input.res.status(500).json({
    result: null,
    message: `Error: ${
      input.err instanceof Error ? input.err.message : String(input.err)
    }`,
  });
}
