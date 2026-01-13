import { EnrichedPointType } from "Types";
import { create } from "zustand";

export const initialPointState: EnrichedPointType = {
  id: 0,
  omschrijving: "",
  regio_id: "",
  xcoordinaat_rd: 0,
  ycoordinaat_rd: 0,
  latitude: 0,
  longitude: 0,
  herhalen: 0,
  vertrouwelijk: 0,
  user_id: 0,
  activiteit_id: "",
  organisatie_id: "",
  specifiek_letten_op: "",
  datum: "",
  Point_description: "",
  aanmaker: "",
  region: "",
};

export type FeatureLayerAttributes = {
  [key: string]: any;
};

export const usePopUpState = create<{
  clickedPointId: number;
  setClickedPointId: (clickedPointId: number) => void;

  clickedPoint: EnrichedPointType;
  setClickedPoint: (clickedPoint: EnrichedPointType) => void;

  createNewPoint: boolean;
  setCreateNewPoint: (createNewPoint: boolean) => void;

  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;

  // FeatureLayer attributes
  featureLayerAttributes: FeatureLayerAttributes | null;
  setFeatureLayerAttributes: (
    attributes: FeatureLayerAttributes | null
  ) => void;
  featureLayerTitle: string;
  setFeatureLayerTitle: (title: string) => void;
  openFeatureLayerModal: boolean;
  setOpenFeatureLayerModal: (open: boolean) => void;
}>((set) => ({
  clickedPointId: 0,
  setClickedPointId: (clickedPointId: number) => set({ clickedPointId }),

  clickedPoint: initialPointState,
  setClickedPoint: (clickedPoint: EnrichedPointType) => set({ clickedPoint }),

  createNewPoint: false,
  setCreateNewPoint: (createNewPoint: boolean) => set({ createNewPoint }),

  openModal: false,
  setOpenModal: (openModal: boolean) => set({ openModal }),

  // FeatureLayer attributes
  featureLayerAttributes: null,
  setFeatureLayerAttributes: (attributes: FeatureLayerAttributes | null) =>
    set({ featureLayerAttributes: attributes }),
  featureLayerTitle: "",
  setFeatureLayerTitle: (title: string) => set({ featureLayerTitle: title }),
  openFeatureLayerModal: false,
  setOpenFeatureLayerModal: (open: boolean) =>
    set({ openFeatureLayerModal: open }),
}));
