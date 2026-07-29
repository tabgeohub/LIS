import type {
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";

export type ViewPlanFormFields = FlightPlanFormFieldValues & {
  vluchtnummer: string;
  aantalPassagiers: number;
};

export type { FlightPlanFormFieldSetters, FlightPlanFormFieldValues };
