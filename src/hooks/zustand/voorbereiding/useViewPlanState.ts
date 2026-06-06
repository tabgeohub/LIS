import { FlightPlanType } from "Types";
import { create } from "zustand";

interface ViewPlanState {
  initialPlans: FlightPlanType[];
  setInitialPlans: (initialPlans: FlightPlanType[]) => void;

  step: number;
  setStep: (step: number) => void;

  openFilter: boolean;
  setOpenFilter: (openFilter: boolean) => void;

  dateVan: string;
  setDateVan: (dateVan: string) => void;

  dateTot: string;
  setDateTot: (dateTot: string) => void;

  filterInput: string;
  setFilterInput: (filterInput: string) => void;

  filteredPlans: FlightPlanType[];
  setFilteredPlans: (filteredPlans: FlightPlanType[]) => void;

  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (selectedPlan: FlightPlanType) => void;

  selectedIndex: number;
  setSelectedIndex: (selectedIndex: number) => void;

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

  clickedPoint: number;
  setClickedPoint: (clickedPoint: number) => void;

  clickedGeometry: number | null;
  setClickedGeometry: (clickedGeometry: number | null) => void;
}

export const useViewPlanState = create<ViewPlanState>((set) => ({
  initialPlans: [],
  setInitialPlans: (initialPlans: FlightPlanType[]) =>
    set(() => ({ initialPlans })),

  step: 1,
  setStep: (step: number) => set(() => ({ step })),

  openFilter: false,
  setOpenFilter: (openFilter: boolean) => set(() => ({ openFilter })),

  dateVan: "",
  setDateVan: (dateVan: string) => set(() => ({ dateVan })),

  dateTot: "",
  setDateTot: (dateTot: string) => set(() => ({ dateTot })),

  filterInput: "",
  setFilterInput: (filterInput: string) => set(() => ({ filterInput })),

  filteredPlans: [],
  setFilteredPlans: (filteredPlans: FlightPlanType[]) =>
    set(() => ({ filteredPlans })),

  selectedIndex: 0,
  setSelectedIndex: (selectedIndex: number) => set(() => ({ selectedIndex })),

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

  clickedPoint: 0,
  setClickedPoint: (clickedPoint: number) => set(() => ({ clickedPoint })),

  clickedGeometry: null,
  setClickedGeometry: (clickedGeometry: number | null) =>
    set(() => ({ clickedGeometry })),

  selectedPlan: null,
  setSelectedPlan: (selectedPlan: FlightPlanType) =>
    set(() => ({ selectedPlan })),
}));
