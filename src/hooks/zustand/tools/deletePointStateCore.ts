import { EnrichedPointType } from "Types";
import { EMPTY_POINT_COORDINATES } from "@helpers/points/emptyPointCoreFields";
import type {
  AandachtspuntenVerwijderenType,
  DeletePoint,
} from "./deletePointStateTypes";

export const deletePointInitialState = {
  mainStep: "main" as AandachtspuntenVerwijderenType,
  selectedPoints: [] as EnrichedPointType[],
  selectedPoint: null as EnrichedPointType | null,
  omschrijving: "",
  regio_id: "",
  ...EMPTY_POINT_COORDINATES,
  herhalen: false,
  vertrouwelijk: 0,
  user_id: 0,
  activiteit_id: "",
  organisatie_id: "",
  specifiek_letten_op: "",
};

/** Resets point form fields; preserves mainStep and selectedPoints list. */
export const deletePointClearState = {
  selectedPoint: deletePointInitialState.selectedPoint,
  omschrijving: deletePointInitialState.omschrijving,
  regio_id: deletePointInitialState.regio_id,
  xcoordinaat_rd: deletePointInitialState.xcoordinaat_rd,
  ycoordinaat_rd: deletePointInitialState.ycoordinaat_rd,
  latitude: deletePointInitialState.latitude,
  longitude: deletePointInitialState.longitude,
  herhalen: deletePointInitialState.herhalen,
  vertrouwelijk: deletePointInitialState.vertrouwelijk,
  user_id: deletePointInitialState.user_id,
  activiteit_id: deletePointInitialState.activiteit_id,
  organisatie_id: deletePointInitialState.organisatie_id,
  specifiek_letten_op: deletePointInitialState.specifiek_letten_op,
};

type DeletePointSet = (
  partial: Partial<DeletePoint> | ((state: DeletePoint) => Partial<DeletePoint>)
) => void;

/** Zustand setters + clear for delete-point tool state. */
export function createDeletePointSetters(set: DeletePointSet) {
  return {
    setMainStep: (value: AandachtspuntenVerwijderenType) =>
      set({ mainStep: value }),
    setSelectedPoints: (value: EnrichedPointType[]) =>
      set({ selectedPoints: value }),
    setSelectedPoint: (value: EnrichedPointType | null) =>
      set({ selectedPoint: value }),
    setOmschrijving: (value: string) => set({ omschrijving: value }),
    setRegio_id: (value: string) => set({ regio_id: value }),
    setXCoordinaat_rd: (value: number) => set({ xcoordinaat_rd: value }),
    setYCoordinaat_rd: (value: number) => set({ ycoordinaat_rd: value }),
    setLatitude: (value: number) => set({ latitude: value }),
    setLongitude: (value: number) => set({ longitude: value }),
    setHerhalen: (value: boolean) => set({ herhalen: value }),
    setVertrouwelijk: (value: number) => set({ vertrouwelijk: value }),
    setUser_id: (value: number) => set({ user_id: value }),
    setActiviteit_id: (value: string) => set({ activiteit_id: value }),
    setOrganisatie_id: (value: string) => set({ organisatie_id: value }),
    setSpecifiek_letten_op: (value: string) =>
      set({ specifiek_letten_op: value }),
    clear: () => set(deletePointClearState),
  };
}

export function createDeletePointState(set: DeletePointSet): DeletePoint {
  return {
    ...deletePointInitialState,
    ...createDeletePointSetters(set),
  };
}
