import axios from "axios";
import dayjs from "dayjs";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import { sortPlansNewestFirst } from "@helpers/timeslider";
import { FinishedFlightPlanType } from "Types/finished_plans";

export async function fetchTimesliderFinishedPlans(input: {
  regioId: string;
  dateFrom: string;
  dateTo: string;
}): Promise<FinishedFlightPlanType[]> {
  const response = await axios.get<FinishedFlightPlanType[]>(
    `${getBackEndUrl()}/api/timeslider/getFinishedPlansTimeslider`,
    {
      params: {
        regio_id: input.regioId,
        from: dayjs(input.dateFrom).format("YYYY-MM-DD"),
        to: dayjs(input.dateTo).format("YYYY-MM-DD"),
      },
    }
  );
  return sortPlansNewestFirst(response.data || []);
}
