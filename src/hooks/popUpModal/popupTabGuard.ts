import type { EnrichedPointType } from "Types";
import { isPopupTabBlocked } from "./popupBlockedTabs";
import { clearPopupSelection } from "./popupSelection";
export function clearPopupIfBlocked(input: {
  selectedTab: string;
  setClickedPointId: (value: number) => void;
  setClickedPoint: (value: EnrichedPointType) => void;
  selectedPointGraphicsLayer?: __esri.GraphicsLayer | null;
  setOpenModal?: (open: boolean) => void;
}): boolean {
  if (!isPopupTabBlocked(input.selectedTab)) return false;

  clearPopupSelection({
    setClickedPointId: input.setClickedPointId,
    setClickedPoint: input.setClickedPoint,
    selectedPointGraphicsLayer: input.selectedPointGraphicsLayer,
  });
  input.setOpenModal?.(false);
  return true;
}
