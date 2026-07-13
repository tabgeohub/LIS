export type PlanSelectionCoreValues<TPlan> = {
  step: number;
  selectedPlan: TPlan | null;
  filteredPlans: TPlan[];
};

export type PlanSelectionCoreSetters<TPlan> = {
  setStep: (value: number) => void;
  setSelectedPlan: (value: TPlan | null) => void;
  setFilteredPlans: (value: TPlan[]) => void;
};

export function createPlanSelectionCoreSetters<TPlan>(
  set: (partial: Partial<PlanSelectionCoreValues<TPlan>>) => void
): PlanSelectionCoreSetters<TPlan> {
  return {
    setStep: (value) => set({ step: value }),
    setSelectedPlan: (value) => set({ selectedPlan: value }),
    setFilteredPlans: (value) => set({ filteredPlans: value }),
  };
}

export type PlanWizardCoreValues<TPlan, TPoint> =
  PlanSelectionCoreValues<TPlan> & {
    filteredPoints: TPoint[];
  };

export type PlanWizardCoreSetters<TPlan, TPoint> =
  PlanSelectionCoreSetters<TPlan> & {
    setFilteredPoints: (value: TPoint[]) => void;
  };

export function createPlanWizardCoreSetters<TPlan, TPoint>(
  set: (partial: Partial<PlanWizardCoreValues<TPlan, TPoint>>) => void
): PlanWizardCoreSetters<TPlan, TPoint> {
  return {
    ...createPlanSelectionCoreSetters(set),
    setFilteredPoints: (value) => set({ filteredPoints: value }),
  };
}

export function emptyPlanSelectionCore<TPlan>(): PlanSelectionCoreValues<TPlan> {
  return {
    step: 1,
    selectedPlan: null,
    filteredPlans: [],
  };
}

export function emptyPlanWizardCore<TPlan, TPoint>(): PlanWizardCoreValues<
  TPlan,
  TPoint
> {
  return {
    ...emptyPlanSelectionCore<TPlan>(),
    filteredPoints: [],
  };
}
