import type { Request, Response } from "express";
import { pool } from "../../../db";
import {
  buildFlightPlanQuery,
  BuildFlightPlanQueryOptions,
} from "./buildFlightPlanQuery";
import { sendFlightPlanListError } from "./sendFlightPlanListError";

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

export { sendFlightPlanListError };
