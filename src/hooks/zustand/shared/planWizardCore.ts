export type PlanWizardCoreValues<TPlan, TPoint> = {
  step: number;
  selectedPlan: TPlan | null;
  filteredPlans: TPlan[];
  filteredPoints: TPoint[];
};

export type PlanWizardCoreSetters<TPlan, TPoint> = {
  setStep: (value: number) => void;
  setSelectedPlan: (value: TPlan | null) => void;
  setFilteredPlans: (value: TPlan[]) => void;
  setFilteredPoints: (value: TPoint[]) => void;
};

export function createPlanWizardCoreSetters<TPlan, TPoint>(
  set: (partial: Partial<PlanWizardCoreValues<TPlan, TPoint>>) => void
): PlanWizardCoreSetters<TPlan, TPoint> {
  return {
    setStep: (value) => set({ step: value }),
    setSelectedPlan: (value) => set({ selectedPlan: value }),
    setFilteredPlans: (value) => set({ filteredPlans: value }),
    setFilteredPoints: (value) => set({ filteredPoints: value }),
  };
}
