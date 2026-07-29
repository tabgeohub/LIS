import type { BuildTimesliderPageShellInput } from "./timesliderPageShellTypes";

/** Plans overlay props for the timeslider detail page shell. */
export function buildTimesliderPlansOverlayProps(
  input: BuildTimesliderPageShellInput,
  plansEmptyHint: string | undefined
) {
  const d = input.data;
  return {
    visible: input.plansSectionVisible,
    blocked: d.invalidQuery || d.needsAuth || Boolean(d.plansError),
    plans: d.filteredPlans,
    selectedPlanId: d.selectedPlan?.id ?? null,
    onSelectPlan: d.setSelectedPlan,
    loading: d.allPlansLoading,
    emptyHint: plansEmptyHint,
    firstImageUrlByPlanId: d.firstImageUrlByPlanId,
    imagesLoading: d.imagesLoading,
  };
}
