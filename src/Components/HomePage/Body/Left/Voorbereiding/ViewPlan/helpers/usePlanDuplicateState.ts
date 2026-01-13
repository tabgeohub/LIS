import { FlightPlanType } from "Types";
import { create } from "zustand";

interface PlanDuplicateState {
  duplicatedFlightPlan: FlightPlanType | null;
  setDuplicatedFlightPlan: (duplicatedFlightPlan: FlightPlanType) => void;

  vluchtnummer: string;
  setVluchtnummer: (vluchtnummer: string) => void;

  aanmaker: string;
  setAanmaker: (aanmaker: string) => void;

  aanmaaldatum: string;
  setAanmaaldatum: (aanmaaldatum: string) => void;

  omschrijving: string;
  setOmschrijving: (omschrijving: string) => void;

  waarnemer: string;
  setWaarnemer: (waarnemer: string) => void;

  piloot: string;
  setPiloot: (piloot: string) => void;

  datum: string;
  setDatum: (datum: string) => void;

  geplandeVliegduur: string;
  setGeplandeVliegduur: (geplandeVliegduur: string) => void;

  typeLuchtvaartuig: string;
  setTypeLuchtvaartuig: (typeLuchtvaartuig: string) => void;

  aantalPassagiers: number;
  setAantalPassagiers: (aantalPassagiers: number) => void;

  doelEnHoofdthema: string;
  setDoelEnHoofdthema: (doelEnHoofdthema: string) => void;

  aanvullendeInfo: string;
  setAanvullendeInfo: (aanvullendeInfo: string) => void;

  basemap: string;
  setBasemap: (basemap: string) => void;

  layers: string;
  setLayers: (layers: string) => void;

  status: string;
  setStatus: (status: string) => void;
}

export const usePlanDuplicateState = create<PlanDuplicateState>((set) => ({
  duplicatedFlightPlan: null,
  setDuplicatedFlightPlan: (duplicatedFlightPlan: FlightPlanType) =>
    set(() => ({ duplicatedFlightPlan })),

  vluchtnummer: "",
  setVluchtnummer: (vluchtnummer: string) => set(() => ({ vluchtnummer })),

  aanmaker: "",
  setAanmaker: (aanmaker: string) => set(() => ({ aanmaker })),

  aanmaaldatum: "",
  setAanmaaldatum: (aanmaaldatum: string) => set(() => ({ aanmaaldatum })),

  omschrijving: "",
  setOmschrijving: (omschrijving: string) => set(() => ({ omschrijving })),

  waarnemer: "",
  setWaarnemer: (waarnemer: string) => set(() => ({ waarnemer })),

  piloot: "",
  setPiloot: (piloot: string) => set(() => ({ piloot })),

  datum: "",
  setDatum: (datum: string) => set(() => ({ datum })),

  geplandeVliegduur: "0:00",
  setGeplandeVliegduur: (geplandeVliegduur: string) =>
    set(() => ({ geplandeVliegduur })),

  typeLuchtvaartuig: "",
  setTypeLuchtvaartuig: (typeLuchtvaartuig: string) =>
    set(() => ({ typeLuchtvaartuig })),

  aantalPassagiers: 0,
  setAantalPassagiers: (aantalPassagiers: number) =>
    set(() => ({ aantalPassagiers })),

  doelEnHoofdthema: "",
  setDoelEnHoofdthema: (doelEnHoofdthema: string) =>
    set(() => ({ doelEnHoofdthema })),

  aanvullendeInfo: "",
  setAanvullendeInfo: (aanvullendeInfo: string) =>
    set(() => ({ aanvullendeInfo })),

  basemap: "",
  setBasemap: (basemap: string) => set(() => ({ basemap })),

  layers: "",
  setLayers: (layers: string) => set(() => ({ layers })),

  status: "",
  setStatus: (status: string) => set(() => ({ status })),
}));
