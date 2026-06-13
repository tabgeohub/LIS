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

export async function runReturningUpdateById(
  res: Response,
  id: unknown,
  runQuery: () => Promise<QueryResult>,
  config: ReturningUpdateConfig
): Promise<void> {
  if (!requireRouteId(res, id)) {
    return;
  }

  try {
    const result = await runQuery();

    if (result.rows.length === 0) {
      notFound(res, config.notFoundMessage);
      return;
    }

    okResult(res, result.rows[0], config.successMessage);
  } catch (err) {
    const errText = err instanceof Error ? err.message : String(err);
    const separator = config.errorMessage.trimEnd().endsWith(":") ? " " : ": ";
    serverError(
      res,
      config.logLabel,
      `${config.errorMessage}${separator}${errText}`,
      err
    );
  }
}

type StatusUpdateConfig = {
  successMessage: string;
  logLabel: string;
  errorMessage: string;
  notFoundMessage?: string;
};

export async function runStatusUpdate(
  res: Response,
  id: unknown,
  runQuery: () => Promise<QueryResult>,
  config: StatusUpdateConfig
): Promise<void> {
  if (!requireRouteId(res, id)) {
    return;
  }

  try {
    const result = await runQuery();

    if (config.notFoundMessage && result.rows.length === 0) {
      notFound(res, config.notFoundMessage);
      return;
    }

    okResult(res, result.rows[0], config.successMessage);
  } catch (err) {
    const errText = err instanceof Error ? err.message : String(err);
    const separator = config.errorMessage.trimEnd().endsWith(":") ? " " : ": ";
    serverError(
      res,
      config.logLabel,
      `${config.errorMessage}${separator}${errText}`,
      err
    );
  }
}
