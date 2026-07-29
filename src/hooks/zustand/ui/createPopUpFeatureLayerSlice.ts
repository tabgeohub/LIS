import type { PopUpState } from "./popUpStateTypes";

export function createPopUpFeatureLayerSlice(
  set: (partial: Partial<PopUpState>) => void
): Pick<
  PopUpState,
  | "featureLayerAttributes"
  | "setFeatureLayerAttributes"
  | "featureLayerTitle"
  | "setFeatureLayerTitle"
  | "openFeatureLayerModal"
  | "setOpenFeatureLayerModal"
> {
  return {
    featureLayerAttributes: null,
    setFeatureLayerAttributes: (featureLayerAttributes) =>
      set({ featureLayerAttributes }),
    featureLayerTitle: "",
    setFeatureLayerTitle: (featureLayerTitle) => set({ featureLayerTitle }),
    openFeatureLayerModal: false,
    setOpenFeatureLayerModal: (openFeatureLayerModal) =>
      set({ openFeatureLayerModal }),
  };
}
