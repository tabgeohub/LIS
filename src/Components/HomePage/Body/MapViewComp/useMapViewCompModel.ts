import { RefObject } from "react";
import { useOpeSideBarState } from "hooks/zustand/ui";
import { useOpenTable } from "hooks/zustand/ui";
import { useOpenAllTable } from "hooks/zustand/ui";
import { useMapViewState } from "hooks/zustand/ui";
import { usePathPointState } from "hooks/zustand/ui";
import useFeatureLayerLabels from "Components/HomePage/hooks/hover-click-handlers/useFeatureLayerLabels";
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
