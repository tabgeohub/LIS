import { EnrichedPointType } from "Types";
import { FeatureLayerAttributes } from "./popUpInitialState";

export type PopUpState = {
  clickedPointId: number;
  setClickedPointId: (clickedPointId: number) => void;
  clickedPoint: EnrichedPointType;
  setClickedPoint: (clickedPoint: EnrichedPointType) => void;
  createNewPoint: boolean;
  setCreateNewPoint: (createNewPoint: boolean) => void;
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  featureLayerAttributes: FeatureLayerAttributes | null;
  setFeatureLayerAttributes: (
    attributes: FeatureLayerAttributes | null
  ) => void;
  featureLayerTitle: string;
  setFeatureLayerTitle: (title: string) => void;
  openFeatureLayerModal: boolean;
  setOpenFeatureLayerModal: (open: boolean) => void;
};
