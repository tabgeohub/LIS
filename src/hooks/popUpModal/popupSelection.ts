import { initialPointState } from "hooks/zustand/ui/popUpState";
import type { EnrichedPointType, TabType } from "Types";
import { createYellowCircle } from "hooks/popUpModal/createYellowCircle";
import { isPopupTabBlocked } from "./popupBlockedTabs";

export function clearPopupSelection(input: {
  setClickedPointId: (value: number) => void;
  setClickedPoint: (value: EnrichedPointType) => void;
  selectedPointGraphicsLayer?: __esri.GraphicsLayer | null;
}) {
  input.setClickedPointId(0);
  input.setClickedPoint(initialPointState as EnrichedPointType);
  input.selectedPointGraphicsLayer?.removeAll();
}

export function openPopupForClickedPoint(input: {
  clickedPointId: number;
  points: EnrichedPointType[];
  selectedTab: TabType;
  selectedPointGraphicsLayer: __esri.GraphicsLayer;
  setClickedPoint: (value: EnrichedPointType) => void;
  setOpenModal: (open: boolean) => void;
  setSelectedBottomTab: (tab: string) => void;
  setSelectedTab: (tab: TabType) => void;
  setOpenSideBar: (open: boolean) => void;
  logAction: (payload: { message: string; newData: unknown }) => void;
}) {
  if (isPopupTabBlocked(input.selectedTab)) {
    return { blocked: true as const };
  }

  const foundPoint = input.points.find((point) => point.id === input.clickedPointId);
  if (!foundPoint) {
    input.setOpenModal(false);
    return { blocked: false as const };
  }

  input.selectedPointGraphicsLayer.removeAll();
  input.setClickedPoint(foundPoint);
  input.setOpenModal(true);
  createYellowCircle(input.selectedPointGraphicsLayer, foundPoint);

  if (input.selectedTab === "none" && !isPopupTabBlocked(input.selectedTab)) {
    input.setSelectedBottomTab("viewSelectedPointDetails");
    input.setSelectedTab("none");
    input.setOpenSideBar(true);
  }

  input.logAction({
    message: "User clicked on a point",
    newData: { point: foundPoint },
  });

  return { blocked: false as const };
}
