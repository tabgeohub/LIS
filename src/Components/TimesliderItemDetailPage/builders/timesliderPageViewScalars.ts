import type { BuildTimesliderPageViewInput } from "./buildTimesliderPageViewParts";

export function timesliderPageViewScalars(
  input: BuildTimesliderPageViewInput
) {
  return {
    queryError: input.ok ? null : input.queryReason,
    invalidQuery: !input.ok,
    kind: input.ok ? input.kind : null,
    itemId: input.ok ? input.itemId : null,
    from: input.from,
    to: input.to,
    displayTitle: input.displayTitle,
    filteredPlans: input.filteredPlans,
    planIds: input.planIds,
    allPlansLoading: input.plansLoading,
    plansError: input.plansError,
    needsAuth: input.needsAuth,
  };
}
