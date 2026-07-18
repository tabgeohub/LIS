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

type PathInvalidation = {
  matches: (path: string) => boolean;
  invalidate: (queryClient: QueryClient, path: string) => void;
};

const PATH_INVALIDATIONS: PathInvalidation[] = [
  {
    matches: (path) => path.includes("/flightPlans"),
    invalidate: (queryClient, path) =>
      invalidateFlightPlanQueries(queryClient, path),
  },
  {
    matches: (path) =>
      path.includes("/templateFlight") || path.includes("/template_plans"),
    invalidate: (queryClient) =>
      queryClient.invalidateQueries({ queryKey: templateFlightKeys.all }),
  },
  {
    matches: (path) => path.includes("/points"),
    invalidate: (queryClient) =>
      queryClient.invalidateQueries({ queryKey: pointKeys.all }),
  },
  {
    matches: (path) => path.includes("/finished_plans"),
    invalidate: (queryClient) =>
      queryClient.invalidateQueries({ queryKey: finishedPlanKeys.all }),
  },
  {
    matches: (path) => path.includes("/geometries"),
    invalidate: (queryClient) =>
      queryClient.invalidateQueries({ queryKey: geometryKeys.all }),
  },
  {
    matches: (path) => path.includes("/emails"),
    invalidate: (queryClient) =>
      queryClient.invalidateQueries({ queryKey: emailKeys.all }),
  },
  {
    matches: (path) => path.includes("/consts"),
    invalidate: (queryClient) =>
      queryClient.invalidateQueries({ queryKey: constKeys.all }),
  },
];

export function invalidateRelatedQueries(
  queryClient: QueryClient,
  path: string
): void {
  for (const rule of PATH_INVALIDATIONS) {
    if (rule.matches(path)) {
      rule.invalidate(queryClient, path);
    }
  }
}
