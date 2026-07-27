import { useEffect } from "react";
import { attachBottomPanelResizeListeners } from "./bottomPanelResize";
import type { useBottomPanelState } from "./useBottomPanelState";

export function useBottomPanelDragListeners(input: {
  dragRef: ReturnType<typeof useBottomPanelState>["dragRef"];
  setPanelVh: (vh: number) => void;
}) {
  useEffect(
    () =>
      attachBottomPanelResizeListeners({
        dragRef: input.dragRef,
        setPanelVh: input.setPanelVh,
      }),
    [input.dragRef, input.setPanelVh]
  );
}
