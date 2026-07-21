import { Response } from "express";
import { PoolClient } from "pg";
import { serverError } from "./routeResponses";

type RollbackTransactionInput = {
  client: PoolClient;
  res: Response;
  err: unknown;
};

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

/** Bind log labels once for route-specific rollback helpers. */
export function createRollbackTransactionErrorHandler(config: {
  logLabel: string;
  messagePrefix: string;
}): (input: RollbackTransactionInput) => Promise<void> {
  return (input) =>
    rollbackTransactionWithServerError({
      ...input,
      logLabel: config.logLabel,
      messagePrefix: config.messagePrefix,
    });
}
