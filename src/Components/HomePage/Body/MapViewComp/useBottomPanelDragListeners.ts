import { useEffect } from "react";
import { attachBottomPanelResizeListeners } from "./bottomPanelResize";
import type { useBottomPanelState } from "./useBottomPanelState";

export function useBottomPanelDragListeners(
  dragRef: ReturnType<typeof useBottomPanelState>["dragRef"],
  setPanelVh: (vh: number) => void
) {
  useEffect(
    () => attachBottomPanelResizeListeners({ dragRef, setPanelVh }),
    [dragRef, setPanelVh]
  );
}
