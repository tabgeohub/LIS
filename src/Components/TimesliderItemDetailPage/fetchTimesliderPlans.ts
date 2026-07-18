import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { FinishedFlightPlanType } from "Types/finished_plans";
import { sortPlansNewestFirst } from "@helpers/timeslider";

export async function fetchTimesliderPlans(input: {
  regioId: string;
  from: string;
  to: string;
  signal: AbortSignal;
}): Promise<FinishedFlightPlanType[]> {
  const res = await axios.get<FinishedFlightPlanType[]>(
    `${getBackEndUrl()}/api/timeslider/getFinishedPlansTimeslider`,
    {
      params: {
        regio_id: input.regioId,
        from: input.from,
        to: input.to,
      },
      signal: input.signal,
    }
  );
  return sortPlansNewestFirst(res.data || []);
}

export function isFetchCanceled(e: unknown) {
  return axios.isAxiosError(e) && e.code === "ERR_CANCELED";
}
