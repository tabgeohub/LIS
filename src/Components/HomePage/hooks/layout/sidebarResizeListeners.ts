import type { MutableRefObject } from "react";
import {
  computeSidebarWidthFromDrag,
  endSidebarResizeDrag,
  type ResizeHandleSide,
  type SidebarDragState,
} from "./sidebarResizeMath";

/** Attach window listeners for sidebar drag; returns cleanup. */
export function attachSidebarResizeListeners(input: {
  handleSide: ResizeHandleSide;
  dragRef: MutableRefObject<SidebarDragState>;
  setSidebarWidthPx: (width: number) => void;
}) {
  const onMove = (e: MouseEvent) => {
    if (!input.dragRef.current.dragging) return;
    input.setSidebarWidthPx(
      computeSidebarWidthFromDrag({
        handleSide: input.handleSide,
        drag: input.dragRef.current,
        clientX: e.clientX,
      })
    );
  };

  const onUp = () => endSidebarResizeDrag(input.dragRef);

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  return () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
}

export function initialSidebarWidthPx(initialWidthRatio: number) {
  return Math.round(
    (typeof window !== "undefined" ? window.innerWidth : 1200) *
      initialWidthRatio
  );
}
