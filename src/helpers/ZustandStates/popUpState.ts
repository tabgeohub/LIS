import { create } from "zustand";
import { createPopUpFeatureLayerSlice } from "./createPopUpFeatureLayerSlice";
import { createPopUpPointSlice } from "./createPopUpPointSlice";
import type { PopUpState } from "./popUpStateTypes";

export {
  initialPointState,
  type FeatureLayerAttributes,
} from "./popUpInitialState";

export const usePopUpState = create<PopUpState>((set) => ({
  ...createPopUpPointSlice(set),
  ...createPopUpFeatureLayerSlice(set),
}));
