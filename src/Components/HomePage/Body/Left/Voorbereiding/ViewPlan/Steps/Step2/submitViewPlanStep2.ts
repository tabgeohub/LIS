import type { Geometry } from "hooks/features/useGeometriesStore";
import type { EnrichedPointType, FlightPlanType } from "Types";
import type { ViewPlanFormFields } from "./helpers/viewPlanFormFields";
import {
  buildUpdatedPlanFromForm,
  buildViewPlanUpdatePayload,
  replacePlanInList,
} from "./helpers/buildUpdatedPlanFromForm";
import { pickFlightPlanFormValues } from "Components/HomePage/hooks/flightPlan/pickFlightPlanCreateFields";
import type { FlightPlanFormFieldValues } from "hooks/zustand/shared/flightPlanFormFields";

export function canSubmitViewPlanStep2(input: {
  selectedPlan: FlightPlanType | null;
  userId: number | undefined;
}): input is { selectedPlan: FlightPlanType; userId: number } {
  return !!input.selectedPlan && input.userId !== undefined && input.userId !== 0;
}

export function buildViewPlanStep2SubmitContext(input: {
  store: FlightPlanFormFieldValues & {
    selectedPlan: FlightPlanType | null;
    aantalPassagiers?: number;
  };
  vluchtnummer: string;
  pointsTable: EnrichedPointType[];
  geometriesTable: Geometry[];
  userId: number;
}) {
  const form: ViewPlanFormFields = {
    vluchtnummer: input.vluchtnummer,
    ...pickFlightPlanFormValues(input.store),
    aantalPassagiers: input.store.aantalPassagiers ?? 0,
  };
  const selectedPlan = input.store.selectedPlan!;

  return {
    form,
    payload: buildViewPlanUpdatePayload({
      selectedPlan,
      form,
      pointsTable: input.pointsTable,
      geometriesTable: input.geometriesTable,
      userId: input.userId,
    }),
    updatedPlan: buildUpdatedPlanFromForm({
      selectedPlan,
      form,
      pointsTable: input.pointsTable,
      geometriesTable: input.geometriesTable,
    }),
  };
}

export function applyViewPlanStep2SaveSuccess(input: {
  updatedPlan: FlightPlanType;
  filteredPlans: FlightPlanType[];
  initialPlans: FlightPlanType[];
  payload: unknown;
  setFilteredPlans: (plans: FlightPlanType[]) => void;
  setInitialPlans: (plans: FlightPlanType[]) => void;
  setSelectedPlan: (plan: FlightPlanType) => void;
  refetch: () => Promise<void>;
  setStep: (step: number) => void;
  logStep: (message: string, payload: unknown) => void;
}) {
  return async () => {
    input.setFilteredPlans(replacePlanInList(input.filteredPlans, input.updatedPlan));
    input.setInitialPlans(replacePlanInList(input.initialPlans, input.updatedPlan));
    input.setSelectedPlan(input.updatedPlan);
    await input.refetch();
    input.setStep(1);
    input.logStep("User clicked 'Save' button", input.payload);
  };
}
