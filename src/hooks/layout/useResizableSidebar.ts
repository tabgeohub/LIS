import { useEffect, useRef, useState } from "react";
import {
  beginSidebarResizeDrag,
  computeSidebarWidthFromDrag,
  endSidebarResizeDrag,
  type ResizeHandleSide,
  type SidebarDragState,
} from "./sidebarResizeMath";

export type { ResizeHandleSide } from "./sidebarResizeMath";

export function useResizableSidebar(
  initialWidthRatio: number,
  handleSide: ResizeHandleSide
) {
  const [sidebarWidthPx, setSidebarWidthPx] = useState(() =>
    Math.round(
      (typeof window !== "undefined" ? window.innerWidth : 1200) *
        initialWidthRatio
    )
  );

  const dragRef = useRef<SidebarDragState>({
    dragging: false,
    startX: 0,
    startWidth: 0,
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      setSidebarWidthPx(
        computeSidebarWidthFromDrag({
          handleSide,
          drag: dragRef.current,
          clientX: e.clientX,
        })
      );
    };

    const onUp = () => endSidebarResizeDrag(dragRef);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [handleSide]);

  function onResizeMouseDown(clientX: number) {
    beginSidebarResizeDrag({
      dragRef,
      clientX,
      sidebarWidthPx,
    });
  }

  return { sidebarWidthPx, onResizeMouseDown };
}
