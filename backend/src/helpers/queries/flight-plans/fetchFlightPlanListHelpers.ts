import type { Request, Response } from "express";
import { pool } from "../../../db";
import {
  buildFlightPlanQuery,
  BuildFlightPlanQueryOptions,
} from "./buildFlightPlanQuery";

export type FetchFlightPlanQueryOptions = BuildFlightPlanQueryOptions & {
  transform?: (rows: unknown[]) => unknown;
};

/** Shared error/logging options for flight-plan list fetch helpers. */
export type FlightPlanListErrorOptions = {
  errorLogLabel?: string;
  errorMessage: string;
  appendErrorToMessage?: boolean;
  includeErrorField?: boolean;
  transform?: (rows: unknown[]) => unknown;
};

type FlightPlanListResolvedErrorOptions = Required<
  Pick<
    FlightPlanListErrorOptions,
    "errorLogLabel" | "errorMessage" | "appendErrorToMessage" | "includeErrorField"
  >
> &
  Pick<FlightPlanListErrorOptions, "transform">;

type FlightPlanListRawInput = {
  req: Request;
  res: Response;
  useRegioFilter?: boolean;
} & FlightPlanListErrorOptions &
  Omit<BuildFlightPlanQueryOptions, "regio_id">;

export type SplitFlightPlanListInput = {
  req: Request;
  res: Response;
  useRegioFilter: boolean;
  queryOptions: Omit<BuildFlightPlanQueryOptions, "regio_id">;
} & FlightPlanListResolvedErrorOptions;

export function splitFlightPlanListInput(
  input: FlightPlanListRawInput
): SplitFlightPlanListInput {
  const {
    req,
    res,
    useRegioFilter = false,
    errorLogLabel = "Error fetching flight plans:",
    errorMessage,
    appendErrorToMessage = true,
    includeErrorField = false,
    transform,
    ...queryOptions
  } = input;
  return {
    req,
    res,
    useRegioFilter,
    errorLogLabel,
    errorMessage,
    appendErrorToMessage,
    includeErrorField,
    transform,
    queryOptions,
  };
}

export async function queryFlightPlanListPayload(
  options: FetchFlightPlanQueryOptions
): Promise<unknown> {
  const { transform, ...queryOptions } = options;
  const { query, params } = buildFlightPlanQuery(queryOptions);
  const result = await pool.query(query, params);
  return transform ? transform(result.rows) : result.rows;
}

type FlightPlanListErrorInput = {
  res: Response;
  err: unknown;
} & FlightPlanListResolvedErrorOptions;

function buildFlightPlanErrorMessage(
  errorMessage: string,
  errText: string,
  appendErrorToMessage: boolean
): string {
  if (!appendErrorToMessage) return errorMessage;
  const sep = errorMessage.endsWith(":") ? " " : ": ";
  return `${errorMessage}${sep}${errText}`;
}

export function sendFlightPlanListError(input: FlightPlanListErrorInput): void {
  const errText = input.err instanceof Error ? input.err.message : String(input.err);
  console.error(input.errorLogLabel, errText);
  input.res.status(500).json({
    result: null,
    message: buildFlightPlanErrorMessage(
      input.errorMessage,
      errText,
      input.appendErrorToMessage
    ),
    ...(input.includeErrorField ? { error: errText } : {}),
  });
}
