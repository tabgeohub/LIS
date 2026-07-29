import { EnrichedPointType } from "Types";
import { initialPointState } from "./popUpInitialState";
import type { PopUpState } from "./popUpStateTypes";

export function createPopUpPointSlice(
  set: (partial: Partial<PopUpState>) => void
): Pick<
  PopUpState,
  | "clickedPointId"
  | "setClickedPointId"
  | "clickedPoint"
  | "setClickedPoint"
  | "createNewPoint"
  | "setCreateNewPoint"
  | "openModal"
  | "setOpenModal"
> {
  return {
    clickedPointId: 0,
    setClickedPointId: (clickedPointId) => set({ clickedPointId }),
    clickedPoint: initialPointState,
    setClickedPoint: (clickedPoint) => set({ clickedPoint }),
    createNewPoint: false,
    setCreateNewPoint: (createNewPoint) => set({ createNewPoint }),
    openModal: false,
    setOpenModal: (openModal) => set({ openModal }),
  };
}
