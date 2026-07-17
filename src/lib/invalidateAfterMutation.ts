import { QueryClient } from "@tanstack/react-query";
import { invalidateRelatedQueries } from "./invalidateRelatedQueries";
import { refreshFeatureStores } from "./refreshFeatureStores";

export { invalidateRelatedQueries } from "./invalidateRelatedQueries";

/** Single entry point after create/update/delete — TanStack cache + map stores. */
export async function invalidateAfterMutation(
  queryClient: QueryClient,
  path: string
): Promise<void> {
  invalidateRelatedQueries(queryClient, path);
  await refreshFeatureStores(path);
}
