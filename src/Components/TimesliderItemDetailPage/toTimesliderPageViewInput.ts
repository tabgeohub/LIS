import type { useTimesliderImagePageCore } from "./useTimesliderImagePageCore";

type Core = ReturnType<typeof useTimesliderImagePageCore>;

export function toTimesliderPageViewInput(core: Core) {
  return {
    ok: core.query.ok,
    kind: core.query.kind,
    itemId: core.query.itemId,
    from: core.query.from,
    to: core.query.to,
    displayTitle: core.displayTitle,
    filteredPlans: core.filteredPlans,
    allPlans: core.plansFetch.plans,
    selectedPlan: core.selectedPlan,
    planIds: core.planIds,
    pointResult: core.pointResult,
    geometryResult: core.geometryResult,
    plansLoading: core.plansFetch.loading,
    plansError: core.plansFetch.error,
    needsAuth: core.query.needsAuth,
    queryReason: core.query.queryReason,
  };
}
