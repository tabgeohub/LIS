import { Response } from "express";
import { PoolClient } from "pg";
import { serverError } from "./routeResponses";

/** Shared ROLLBACK + serverError for route transaction helpers. */
export async function rollbackTransactionWithServerError(input: {
  client: PoolClient;
  res: Response;
  err: unknown;
  logLabel: string;
  messagePrefix: string;
}): Promise<void> {
  await input.client.query("ROLLBACK");
  serverError({
    res: input.res,
    logLabel: input.logLabel,
    message: `${input.messagePrefix}${
      input.err instanceof Error ? input.err.message : String(input.err)
    }`,
    err: input.err,
  });
}
