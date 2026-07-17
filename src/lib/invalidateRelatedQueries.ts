import { QueryClient } from "@tanstack/react-query";
import {
  constKeys,
  emailKeys,
  finishedPlanKeys,
  geometryKeys,
  pointKeys,
  templateFlightKeys,
} from "./queryKeys";
import { invalidateFlightPlanQueries } from "./invalidateFlightPlanQueries";

export function invalidateRelatedQueries(
  queryClient: QueryClient,
  path: string
): void {
  if (path.includes("/flightPlans")) {
    invalidateFlightPlanQueries(queryClient, path);
  }

  if (path.includes("/templateFlight") || path.includes("/template_plans")) {
    queryClient.invalidateQueries({ queryKey: templateFlightKeys.all });
  }

  if (path.includes("/points")) {
    queryClient.invalidateQueries({ queryKey: pointKeys.all });
  }

  if (path.includes("/finished_plans")) {
    queryClient.invalidateQueries({ queryKey: finishedPlanKeys.all });
  }

  if (path.includes("/geometries")) {
    queryClient.invalidateQueries({ queryKey: geometryKeys.all });
  }

  if (path.includes("/emails")) {
    queryClient.invalidateQueries({ queryKey: emailKeys.all });
  }

  if (path.includes("/consts")) {
    queryClient.invalidateQueries({ queryKey: constKeys.all });
  }
}
