import type {
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
} from "./flightPlanFormTypes";

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

export function applyFlightPlanFormValues(
  setters: FlightPlanFormFieldSetters,
  values: FlightPlanFormFieldValues
) {
  setters.setOmschrijving(values.omschrijving);
  setters.setWaarnemer(values.waarnemer);
  setters.setPiloot(values.piloot);
  setters.setDatum(values.datum);
  setters.setGeplandeVliegduur(values.geplandeVliegduur);
  setters.setTypeLuchtvaartuig(values.typeLuchtvaartuig);
  setters.setAantalPassagiers(values.aantalPassagiers);
  setters.setDoelEnHoofdthema(values.doelEnHoofdthema);
  setters.setAanvullendeInfo(values.aanvullendeInfo);
}

type ZustandSet<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>)
) => void;

export function createFlightPlanFormFieldSettersWithZeroPassagiers<
  T extends FlightPlanFormFieldValues,
>(set: ZustandSet<T>): FlightPlanFormFieldSetters {
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
