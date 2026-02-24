import { EnrichedPointType, FlightPlanType } from "Types";
import { create } from "zustand";

interface ReUseFlightPlanState {
  step: number;
  setStep: (value: number) => void;

  currentPoints: number[];
  setCurrentPoints: (value: number[]) => void;

  currentGeometries: number[];
  setCurrentGeometries: (value: number[]) => void;

  newPoints: number[];
  setNewPoints: (value: number[]) => void;

  newGeometries: number[];
  setNewGeometries: (value: number[]) => void;

  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;

  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;

  filteredPlans: FlightPlanType[];
  setFilteredPlans: (value: FlightPlanType[]) => void;

  filteredPoints: EnrichedPointType[];
  setFilteredPoints: (value: EnrichedPointType[]) => void;

  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;

  omschrijving: string;
  setOmschrijving: (value: string) => void;

  waarnemer: string;
  setWaarnemer: (value: string) => void;

  piloot: string;
  setPiloot: (value: string) => void;

  datum: string;
  setDatum: (value: string) => void;

  geplandeVliegduur: string;
  setGeplandeVliegduur: (value: string) => void;

  typeLuchtvaartuig: string;
  setTypeLuchtvaartuig: (value: string) => void;

  aantalPassagiers: number | null | undefined;
  setAantalPassagiers: (value: number | null | undefined) => void;

  doelEnHoofdthema: string;
  setDoelEnHoofdthema: (value: string) => void;

  aanvullendeInfo: string;
  setAanvullendeInfo: (value: string) => void;

  filterTerm: string;
  setFilterTerm: (value: string) => void;

  clear: () => void;
}

export const useReuseFlightPlan = create<ReUseFlightPlanState>((set) => ({
  step: 1,
  setStep: (value) => set({ step: value }),

  currentPoints: [],
  setCurrentPoints: (value) => set({ currentPoints: value }),

  currentGeometries: [],
  setCurrentGeometries: (value) => set({ currentGeometries: value }),

  newPoints: [],
  setNewPoints: (value) => set({ newPoints: value }),

  newGeometries: [],
  setNewGeometries: (value) => set({ newGeometries: value }),

  selectedPlan: null,
  setSelectedPlan: (value) => set({ selectedPlan: value }),

  openFilter: false,
  setOpenFilter: (value) => set({ openFilter: value }),

  filteredPlans: [],
  setFilteredPlans: (value) => set({ filteredPlans: value }),

  filteredPoints: [],
  setFilteredPoints: (value) => set({ filteredPoints: value }),

  vluchtnummer: "",
  setVluchtnummer: (value) => set({ vluchtnummer: value }),

  filterTerm: "",
  setFilterTerm: (value) => set({ filterTerm: value }),

  omschrijving: "",
  setOmschrijving: (value) => set({ omschrijving: value }),

  waarnemer: "",
  setWaarnemer: (value) => set({ waarnemer: value }),

  piloot: "",
  setPiloot: (value) => set({ piloot: value }),

  datum: "",
  setDatum: (value) => set({ datum: value }),

  geplandeVliegduur: "",
  setGeplandeVliegduur: (value) => set({ geplandeVliegduur: value }),

  typeLuchtvaartuig: "",
  setTypeLuchtvaartuig: (value) => set({ typeLuchtvaartuig: value }),

  aantalPassagiers: null,
  setAantalPassagiers: (value) => set({ aantalPassagiers: value }),

  doelEnHoofdthema: "",
  setDoelEnHoofdthema: (value) => set({ doelEnHoofdthema: value }),

  aanvullendeInfo: "",
  setAanvullendeInfo: (value) => set({ aanvullendeInfo: value }),

  clear: () =>
    set({
      step: 1,
      setStep: (value) => set({ step: value }),

      currentPoints: [],
      setCurrentPoints: (value) => set({ currentPoints: value }),

      currentGeometries: [],
      setCurrentGeometries: (value) => set({ currentGeometries: value }),

      newPoints: [],
      setNewPoints: (value) => set({ newPoints: value }),

      newGeometries: [],
      setNewGeometries: (value) => set({ newGeometries: value }),

      selectedPlan: null,
      setSelectedPlan: (value) => set({ selectedPlan: value }),

      openFilter: false,
      setOpenFilter: (value) => set({ openFilter: value }),

      filteredPlans: [],
      setFilteredPlans: (value) => set({ filteredPlans: value }),

      filteredPoints: [],
      setFilteredPoints: (value) => set({ filteredPoints: value }),

      vluchtnummer: "",
      setVluchtnummer: (value) => set({ vluchtnummer: value }),

      filterTerm: "",
      setFilterTerm: (value) => set({ filterTerm: value }),

      omschrijving: "",
      setOmschrijving: (value) => set({ omschrijving: value }),

      waarnemer: "",
      setWaarnemer: (value) => set({ waarnemer: value }),

      piloot: "",
      setPiloot: (value) => set({ piloot: value }),

      datum: "",
      setDatum: (value) => set({ datum: value }),

      geplandeVliegduur: "",
      setGeplandeVliegduur: (value) => set({ geplandeVliegduur: value }),

      typeLuchtvaartuig: "",
      setTypeLuchtvaartuig: (value) => set({ typeLuchtvaartuig: value }),

      aantalPassagiers: null,
      setAantalPassagiers: (value) => set({ aantalPassagiers: value }),

      doelEnHoofdthema: "",
      setDoelEnHoofdthema: (value) => set({ doelEnHoofdthema: value }),

      aanvullendeInfo: "",
      setAanvullendeInfo: (value) => set({ aanvullendeInfo: value }),
    }),
}));
