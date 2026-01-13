import { EnrichedPointType } from "Types";
import { create } from "zustand";

type AandachtspuntenVerwijderenType =
  | "main"
  | "pointDetails"
  | "editSelectedPoint"
  | "deletePoint"
  | "viewPlans"
  | "addToPlan"
  | "filter";

interface DeletePoint {
  mainStep: AandachtspuntenVerwijderenType;
  setMainStep: (value: AandachtspuntenVerwijderenType) => void;

  selectedPoints: EnrichedPointType[];
  setSelectedPoints: (value: EnrichedPointType[]) => void;

  selectedPoint: EnrichedPointType | null;
  setSelectedPoint: (value: EnrichedPointType | null) => void;

  omschrijving: string;
  setOmschrijving: (value: string) => void;

  regio_id: string;
  setRegio_id: (value: string) => void;

  xcoordinaat_rd: number;
  setXCoordinaat_rd: (value: number) => void;

  ycoordinaat_rd: number;
  setYCoordinaat_rd: (value: number) => void;

  latitude: number;
  setLatitude: (value: number) => void;

  longitude: number;
  setLongitude: (value: number) => void;

  herhalen: boolean;
  setHerhalen: (value: boolean) => void;

  vertrouwelijk: number;
  setVertrouwelijk: (value: number) => void;

  user_id: number;
  setUser_id: (value: number) => void;

  activiteit_id: string;
  setActiviteit_id: (value: string) => void;

  organisatie_id: string;
  setOrganisatie_id: (value: string) => void;

  specifiek_letten_op: string;
  setSpecifiek_letten_op: (value: string) => void;

  clear: () => void;
}

export const useDeletePointState = create<DeletePoint>((set) => ({
  mainStep: "main",
  setMainStep: (value) => set({ mainStep: value }),

  selectedPoints: [],
  setSelectedPoints: (value) => set({ selectedPoints: value }),

  selectedPoint: null,
  setSelectedPoint: (value) => set({ selectedPoint: value }),

  omschrijving: "",
  setOmschrijving: (value) => set({ omschrijving: value }),

  regio_id: "",
  setRegio_id: (value) => set({ regio_id: value }),

  xcoordinaat_rd: 0,
  setXCoordinaat_rd: (value) => set({ xcoordinaat_rd: value }),

  ycoordinaat_rd: 0,
  setYCoordinaat_rd: (value) => set({ ycoordinaat_rd: value }),

  latitude: 0,
  setLatitude: (value) => set({ latitude: value }),

  longitude: 0,
  setLongitude: (value) => set({ longitude: value }),

  herhalen: false,
  setHerhalen: (value) => set({ herhalen: value }),

  vertrouwelijk: 0,
  setVertrouwelijk: (value) => set({ vertrouwelijk: value }),

  user_id: 0,
  setUser_id: (value) => set({ user_id: value }),

  activiteit_id: "",
  setActiviteit_id: (value) => set({ activiteit_id: value }),

  organisatie_id: "",
  setOrganisatie_id: (value) => set({ organisatie_id: value }),

  specifiek_letten_op: "",
  setSpecifiek_letten_op: (value) => set({ specifiek_letten_op: value }),

  clear: () =>
    set({
      selectedPoints: [],
      selectedPoint: null,
      omschrijving: "",
      regio_id: "",
      xcoordinaat_rd: 0,
      ycoordinaat_rd: 0,
      latitude: 0,
      longitude: 0,
      herhalen: false,
      vertrouwelijk: 0,
      user_id: 0,
      activiteit_id: "",
      organisatie_id: "",
      specifiek_letten_op: "",
    }),
}));
