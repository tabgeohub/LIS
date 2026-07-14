export type FlightPlanFormFieldValues = {
  omschrijving: string;
  waarnemer: string;
  piloot: string;
  datum: string;
  geplandeVliegduur: string;
  typeLuchtvaartuig: string;
  aantalPassagiers: number | null | undefined;
  doelEnHoofdthema: string;
  aanvullendeInfo: string;
};

export const emptyFlightPlanFormFields: FlightPlanFormFieldValues = {
  omschrijving: "",
  waarnemer: "",
  piloot: "",
  datum: "",
  geplandeVliegduur: "",
  typeLuchtvaartuig: "",
  aantalPassagiers: null,
  doelEnHoofdthema: "",
  aanvullendeInfo: "",
};

const flightPlanFormFieldKeys = Object.keys(
  emptyFlightPlanFormFields
) as (keyof FlightPlanFormFieldValues)[];

export function pickFlightPlanFormValues(
  source: FlightPlanFormFieldValues
): FlightPlanFormFieldValues {
  return Object.fromEntries(
    flightPlanFormFieldKeys.map((field) => [field, source[field]])
  ) as FlightPlanFormFieldValues;
}

export type FlightPlanFormFieldSetters = {
  setOmschrijving: (value: string) => void;
  setWaarnemer: (value: string) => void;
  setPiloot: (value: string) => void;
  setDatum: (value: string) => void;
  setGeplandeVliegduur: (value: string) => void;
  setTypeLuchtvaartuig: (value: string) => void;
  setAantalPassagiers: (value: number | null | undefined) => void;
  setDoelEnHoofdthema: (value: string) => void;
  setAanvullendeInfo: (value: string) => void;
};

export function createFlightPlanFormFieldSetters(
  set: (partial: Partial<FlightPlanFormFieldValues>) => void
): FlightPlanFormFieldSetters {
  return {
    setOmschrijving: (value) => set({ omschrijving: value }),
    setWaarnemer: (value) => set({ waarnemer: value }),
    setPiloot: (value) => set({ piloot: value }),
    setDatum: (value) => set({ datum: value }),
    setGeplandeVliegduur: (value) => set({ geplandeVliegduur: value }),
    setTypeLuchtvaartuig: (value) => set({ typeLuchtvaartuig: value }),
    setAantalPassagiers: (value) => set({ aantalPassagiers: value }),
    setDoelEnHoofdthema: (value) => set({ doelEnHoofdthema: value }),
    setAanvullendeInfo: (value) => set({ aanvullendeInfo: value }),
  };
}

export type PlanListFilterValues = {
  openFilter: boolean;
  filterTerm: string;
};

export const emptyPlanListFilter: PlanListFilterValues = {
  openFilter: false,
  filterTerm: "",
};

export type PlanListFilterSetters = {
  setOpenFilter: (value: boolean) => void;
  setFilterTerm: (value: string) => void;
};

export function createPlanListFilterSetters(
  set: (partial: Partial<PlanListFilterValues>) => void
): PlanListFilterSetters {
  return {
    setOpenFilter: (value) => set({ openFilter: value }),
    setFilterTerm: (value) => set({ filterTerm: value }),
  };
}

/** Defaults used by view-plan and duplicate-plan zustand slices. */
export const viewPlanFlightPlanFormDefaults: FlightPlanFormFieldValues = {
  ...emptyFlightPlanFormFields,
  geplandeVliegduur: "0:00",
  aantalPassagiers: 0,
};

export const defaultFlightPlanFieldLabels = {
  omschrijving: "Omschrijving",
  waarnemer: "Waarnemer",
  piloot: "Piloot",
  datum: "Inspectiedatum",
  geplandeVliegduur: "Geplande vliegduur",
  typeLuchtvaartuig: "Type luchtvaartuig",
  aantalPassagiers: "Aantal passagiers",
  doelEnHoofdthema: "Doel en hoofdthema",
  aanvullendeInfo: "Aanvullende info",
} as const;

type ZustandSet<T> = (
  partial:
    | Partial<T>
    | ((state: T) => Partial<T>)
) => void;

export function createFlightPlanFormFieldSettersWithZeroPassagiers<T extends FlightPlanFormFieldValues>(
  set: ZustandSet<T>
): FlightPlanFormFieldSetters {
  return createFlightPlanFormFieldSetters((partial) =>
    set((state) => ({
      ...state,
      ...partial,
      aantalPassagiers:
        partial.aantalPassagiers !== undefined
          ? (partial.aantalPassagiers ?? 0)
          : state.aantalPassagiers,
    }))
  );
}
