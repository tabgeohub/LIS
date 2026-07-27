import useMapSectionHeight from "./useMapSectionHeight";
import { useBottomContainerSize, useSyncPanelVh } from "./bottomPanelEffects";
import { beginBottomPanelDrag } from "./bottomPanelResize";
import { useBottomPanelState } from "./useBottomPanelState";
import { useBottomPanelDragListeners } from "./useBottomPanelDragListeners";

export function useMapViewBottomPanel(input: {
  openTable: boolean;
  openAllTable: boolean;
}) {
  const s = useBottomPanelState(input.openAllTable);
  useSyncPanelVh(input.openAllTable, s.setPanelVh);
  useBottomPanelDragListeners({
    dragRef: s.dragRef,
    setPanelVh: s.setPanelVh,
  });
  useBottomContainerSize({
    openTable: input.openTable,
    panelVh: s.panelVh,
    bottomContainerRef: s.bottomContainerRef,
    setBottomDimensions: s.setBottomDimensions,
  });
  const height = useMapSectionHeight({
    openTable: input.openTable,
    panelVh: s.panelVh,
  });
  return {
    ...s,
    ...height,
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) =>
      beginBottomPanelDrag({
        dragRef: s.dragRef,
        clientY: e.clientY,
        panelVh: s.panelVh,
      }),
  };
}
