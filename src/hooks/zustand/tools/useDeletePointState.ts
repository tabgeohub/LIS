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

export type DeletePointFormFields = Pick<
  DeletePoint,
  | "omschrijving"
  | "regio_id"
  | "xcoordinaat_rd"
  | "ycoordinaat_rd"
  | "latitude"
  | "longitude"
  | "vertrouwelijk"
  | "herhalen"
  | "user_id"
  | "activiteit_id"
  | "organisatie_id"
  | "specifiek_letten_op"
>;

export function pickDeletePointFormFields(
  state: DeletePoint
): DeletePointFormFields {
  return {
    omschrijving: state.omschrijving,
    regio_id: state.regio_id,
    xcoordinaat_rd: state.xcoordinaat_rd,
    ycoordinaat_rd: state.ycoordinaat_rd,
    latitude: state.latitude,
    longitude: state.longitude,
    vertrouwelijk: state.vertrouwelijk,
    herhalen: state.herhalen,
    user_id: state.user_id,
    activiteit_id: state.activiteit_id,
    organisatie_id: state.organisatie_id,
    specifiek_letten_op: state.specifiek_letten_op,
  };
}

const initialState = {
  mainStep: "main" as AandachtspuntenVerwijderenType,
  selectedPoints: [] as EnrichedPointType[],
  selectedPoint: null as EnrichedPointType | null,
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
};

/** Resets point form fields; preserves mainStep and selectedPoints list. */
const clearState = {
  selectedPoint: initialState.selectedPoint,
  omschrijving: initialState.omschrijving,
  regio_id: initialState.regio_id,
  xcoordinaat_rd: initialState.xcoordinaat_rd,
  ycoordinaat_rd: initialState.ycoordinaat_rd,
  latitude: initialState.latitude,
  longitude: initialState.longitude,
  herhalen: initialState.herhalen,
  vertrouwelijk: initialState.vertrouwelijk,
  user_id: initialState.user_id,
  activiteit_id: initialState.activiteit_id,
  organisatie_id: initialState.organisatie_id,
  specifiek_letten_op: initialState.specifiek_letten_op,
};

export const useDeletePointState = create<DeletePoint>((set) => ({
  ...initialState,
  setMainStep: (value) => set({ mainStep: value }),
  setSelectedPoints: (value) => set({ selectedPoints: value }),
  setSelectedPoint: (value) => set({ selectedPoint: value }),
  setOmschrijving: (value) => set({ omschrijving: value }),
  setRegio_id: (value) => set({ regio_id: value }),
  setXCoordinaat_rd: (value) => set({ xcoordinaat_rd: value }),
  setYCoordinaat_rd: (value) => set({ ycoordinaat_rd: value }),
  setLatitude: (value) => set({ latitude: value }),
  setLongitude: (value) => set({ longitude: value }),
  setHerhalen: (value) => set({ herhalen: value }),
  setVertrouwelijk: (value) => set({ vertrouwelijk: value }),
  setUser_id: (value) => set({ user_id: value }),
  setActiviteit_id: (value) => set({ activiteit_id: value }),
  setOrganisatie_id: (value) => set({ organisatie_id: value }),
  setSpecifiek_letten_op: (value) => set({ specifiek_letten_op: value }),
  clear: () => set(clearState),
}));
