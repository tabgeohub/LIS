import { Request, Response } from "express";
import { BuildFlightPlanQueryOptions } from "./buildFlightPlanQuery";
import { resolveRegioFilter } from "../shared/resolveRegioFilter";
import {
  FlightPlanListErrorOptions,
  queryFlightPlanListPayload,
  sendFlightPlanListError,
  splitFlightPlanListInput,
} from "./fetchFlightPlanListHelpers";

type FetchFlightPlanListOptions = Omit<
  BuildFlightPlanQueryOptions,
  "regio_id"
> & {
  useRegioFilter?: boolean;
} & FlightPlanListErrorOptions;

export type RegionalFlightPlanListOptions = Omit<
  FetchFlightPlanListOptions,
  "useRegioFilter" | "regioFilter"
>;

export type FetchFlightPlanListInput = {
  req: Request;
  res: Response;
} & FetchFlightPlanListOptions;

export async function fetchFlightPlanList(
  input: FetchFlightPlanListInput
): Promise<void> {
  const opts = splitFlightPlanListInput(input);
  try {
    const regio_id = opts.useRegioFilter
      ? resolveRegioFilter(opts.req)
      : undefined;
    const payload = await queryFlightPlanListPayload({
      ...opts.queryOptions,
      regio_id,
      transform: opts.transform,
    });
    opts.res.status(200).json(payload);
  } catch (err) {
    sendFlightPlanListError({
      res: opts.res,
      err,
      errorLogLabel: opts.errorLogLabel,
      errorMessage: opts.errorMessage,
      appendErrorToMessage: opts.appendErrorToMessage,
      includeErrorField: opts.includeErrorField,
    });
  }
}

export function fetchRegionalFlightPlanList(input: {
  req: Request;
  res: Response;
} & RegionalFlightPlanListOptions): Promise<void> {
  return fetchFlightPlanList({
    ...input,
    regioFilter: { caseInsensitiveAdmin: true },
    useRegioFilter: true,
  });
}
