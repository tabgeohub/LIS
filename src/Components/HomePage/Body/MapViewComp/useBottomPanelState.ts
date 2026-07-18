import { useRef, useState } from "react";
import type { BottomPanelDragState } from "./bottomPanelResize";

export function useBottomPanelState(openAllTable: boolean) {
  const bottomContainerRef = useRef<HTMLDivElement | null>(null);
  const [bottomDimensions, setBottomDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [panelVh, setPanelVh] = useState(openAllTable ? 90 : 55);
  const dragRef = useRef<BottomPanelDragState>({
    dragging: false,
    startY: 0,
    startVh: 0,
  });
  return {
    bottomContainerRef,
    bottomDimensions,
    setBottomDimensions,
    panelVh,
    setPanelVh,
    dragRef,
  };
}
