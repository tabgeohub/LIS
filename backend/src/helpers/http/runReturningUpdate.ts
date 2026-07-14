import { Response } from "express";
import { QueryResult } from "pg";
import { missingFields, notFound, okResult, serverError } from "./routeResponses";
import { requireId } from "./validateBody";

type ReturningUpdateConfig = {
  notFoundMessage: string;
  successMessage: string;
  logLabel: string;
  errorMessage: string;
};

export function requireRouteId(res: Response, id: unknown): id is number | string {
  if (!requireId(id)) {
    missingFields(res);
    return false;
  }
  return true;
}

export type RunReturningUpdateByIdInput = {
  res: Response;
  id: unknown;
  runQuery: () => Promise<QueryResult>;
  config: ReturningUpdateConfig;
};

type UpdateExecutionConfig = {
  successMessage: string;
  logLabel: string;
  errorMessage: string;
  notFoundMessage?: string;
};

async function executeReturningUpdate(input: {
  res: Response;
  runQuery: () => Promise<QueryResult>;
  config: UpdateExecutionConfig;
  requireReturnedRow: boolean;
}): Promise<void> {
  const { res, runQuery, config, requireReturnedRow } = input;

  try {
    const result = await runQuery();

    if (
      requireReturnedRow &&
      result.rows.length === 0 &&
      config.notFoundMessage
    ) {
      notFound(res, config.notFoundMessage);
      return;
    }

    okResult({
      res,
      result: result.rows[0],
      message: config.successMessage,
    });
  } catch (err) {
    const errText = err instanceof Error ? err.message : String(err);
    const separator = config.errorMessage.trimEnd().endsWith(":") ? " " : ": ";
    serverError({
      res,
      logLabel: config.logLabel,
      message: `${config.errorMessage}${separator}${errText}`,
      err,
    });
  }
}

export async function runReturningUpdateById(
  input: RunReturningUpdateByIdInput
): Promise<void> {
  const { res, id, runQuery, config } = input;

  if (!requireRouteId(res, id)) {
    return;
  }

  await executeReturningUpdate({
    res,
    runQuery,
    config,
    requireReturnedRow: true,
  });
}

type StatusUpdateConfig = {
  successMessage: string;
  logLabel: string;
  errorMessage: string;
  notFoundMessage?: string;
};

export type RunStatusUpdateInput = {
  res: Response;
  id: unknown;
  runQuery: () => Promise<QueryResult>;
  config: StatusUpdateConfig;
};

export async function runStatusUpdate(input: RunStatusUpdateInput): Promise<void> {
  const { res, id, runQuery, config } = input;

  if (!requireRouteId(res, id)) {
    return;
  }

  await executeReturningUpdate({
    res,
    runQuery,
    config,
    requireReturnedRow: Boolean(config.notFoundMessage),
  });
}
