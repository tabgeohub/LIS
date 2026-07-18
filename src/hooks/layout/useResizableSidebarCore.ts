import { useEffect, useRef, useState } from "react";
import {
  beginSidebarResizeDrag,
  type ResizeHandleSide,
  type SidebarDragState,
} from "./sidebarResizeMath";
import {
  attachSidebarResizeListeners,
  initialSidebarWidthPx,
} from "./sidebarResizeListeners";

export type { ResizeHandleSide } from "./sidebarResizeMath";

export function useResizableSidebar(
  initialWidthRatio: number,
  handleSide: ResizeHandleSide
) {
  const [sidebarWidthPx, setSidebarWidthPx] = useState(() =>
    initialSidebarWidthPx(initialWidthRatio)
  );

  const dragRef = useRef<SidebarDragState>({
    dragging: false,
    startX: 0,
    startWidth: 0,
  });

  useEffect(
    () =>
      attachSidebarResizeListeners({
        handleSide,
        dragRef,
        setSidebarWidthPx,
      }),
    [handleSide]
  );

  function onResizeMouseDown(clientX: number) {
    beginSidebarResizeDrag({
      dragRef,
      clientX,
      sidebarWidthPx,
    });
  }

  return { sidebarWidthPx, onResizeMouseDown };
}
