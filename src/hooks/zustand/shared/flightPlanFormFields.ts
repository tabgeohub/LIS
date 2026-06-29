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
