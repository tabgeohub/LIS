import { Request, Response } from "express";
import { pool } from "../../../db";
import {
  buildFlightPlanQuery,
  BuildFlightPlanQueryOptions,
} from "./buildFlightPlanQuery";
import { resolveRegioFilter } from "../../resolveRegioFilter";

type FetchFlightPlanListOptions = Omit<
  BuildFlightPlanQueryOptions,
  "regio_id"
> & {
  useRegioFilter?: boolean;
  errorLogLabel?: string;
  errorMessage: string;
  appendErrorToMessage?: boolean;
  includeErrorField?: boolean;
  transform?: (rows: unknown[]) => unknown;
};

export type FetchFlightPlanListInput = {
  req: Request;
  res: Response;
} & FetchFlightPlanListOptions;

export async function fetchFlightPlanList(
  input: FetchFlightPlanListInput
): Promise<void> {
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

  try {
    const regio_id = useRegioFilter ? resolveRegioFilter(req) : undefined;

    const { query, params } = buildFlightPlanQuery({
      ...queryOptions,
      regio_id,
    });

    const result = await pool.query(query, params);
    const payload = transform ? transform(result.rows) : result.rows;

    res.status(200).json(payload);
  } catch (err) {
    const errText = err instanceof Error ? err.message : String(err);
    console.error(errorLogLabel, errText);

    res.status(500).json({
      result: null,
      message: appendErrorToMessage
        ? `${errorMessage}${errorMessage.endsWith(":") ? " " : ": "}${errText}`
        : errorMessage,
      ...(includeErrorField ? { error: errText } : {}),
    });
  }
}
