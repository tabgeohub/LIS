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
      shouldReportNotFound({
        result,
        requireReturnedRow,
        config,
      })
    ) {
      notFound(res, config.notFoundMessage!);
      return;
    }

    okResult({
      res,
      result: result.rows[0],
      message: config.successMessage,
    });
  } catch (err) {
    respondWithUpdateError({ res, config, err });
  }
}

function shouldReportNotFound(input: {
  result: QueryResult;
  requireReturnedRow: boolean;
  config: UpdateExecutionConfig;
}): boolean {
  return Boolean(
    input.requireReturnedRow &&
      input.result.rows.length === 0 &&
      input.config.notFoundMessage
  );
}

function respondWithUpdateError(input: {
  res: Response;
  config: UpdateExecutionConfig;
  err: unknown;
}): void {
  const { res, config, err } = input;
  const errText = err instanceof Error ? err.message : String(err);
  const separator = config.errorMessage.trimEnd().endsWith(":") ? " " : ": ";
  serverError({
    res,
    logLabel: config.logLabel,
    message: `${config.errorMessage}${separator}${errText}`,
    err,
  });
}

async function runIdGatedReturningUpdate(input: {
  res: Response;
  id: unknown;
  runQuery: () => Promise<QueryResult>;
  config: UpdateExecutionConfig;
  requireReturnedRow: boolean;
}): Promise<void> {
  if (!requireRouteId(input.res, input.id)) {
    return;
  }

  await executeReturningUpdate({
    res: input.res,
    runQuery: input.runQuery,
    config: input.config,
    requireReturnedRow: input.requireReturnedRow,
  });
}

export async function runReturningUpdateById(
  input: RunReturningUpdateByIdInput
): Promise<void> {
  await runIdGatedReturningUpdate({
    res: input.res,
    id: input.id,
    runQuery: input.runQuery,
    config: input.config,
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
  await runIdGatedReturningUpdate({
    res: input.res,
    id: input.id,
    runQuery: input.runQuery,
    config: input.config,
    requireReturnedRow: Boolean(input.config.notFoundMessage),
  });
}
