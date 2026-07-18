import { RefObject } from "react";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePathPointState } from "@helpers/ZustandStates/pathPointState";
import useFeatureLayerLabels from "hooks/hover-click-handlers/useFeatureLayerLabels";
import { useMapViewBottomPanel } from "./useMapViewBottomPanel";

export type MapViewCompProps = {
  mapDiv: RefObject<HTMLDivElement>;
  vluchtnummer: string;
};

export function useMapViewCompModel(props: MapViewCompProps) {
  const { openSideBar, setOpenSideBar } = useOpeSideBarState();
  const { openTable } = useOpenTable();
  const { topMessage, setTopMessage } = useMapViewState();
  const { openAllTable } = useOpenAllTable();
  const { selectedPathPoint, setSelectedPathPoint } = usePathPointState();
  useFeatureLayerLabels();
  const panel = useMapViewBottomPanel({ openTable, openAllTable });
  return {
    ...props,
    openSideBar,
    setOpenSideBar,
    openTable,
    topMessage,
    setTopMessage,
    selectedPathPoint,
    setSelectedPathPoint,
    panel,
  };
}
