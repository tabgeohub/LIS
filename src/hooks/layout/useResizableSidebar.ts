import { useEffect, useRef, useState } from "react";

export type ResizeHandleSide = "left" | "right";

const MIN_WIDTH_PX = 260;

function getMaxWidthPx() {
  return Math.max(360, (window.innerWidth * 0.6) | 0);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function getResizeDelta(
  handleSide: ResizeHandleSide,
  startX: number,
  clientX: number
) {
  return handleSide === "right" ? clientX - startX : startX - clientX;
}

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

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startWidth: 0,
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      const deltaX = getResizeDelta(
        handleSide,
        dragRef.current.startX,
        e.clientX
      );
      setSidebarWidthPx(
        clamp(
          dragRef.current.startWidth + deltaX,
          MIN_WIDTH_PX,
          getMaxWidthPx()
        )
      );
    };

    const onUp = () => {
      if (!dragRef.current.dragging) return;
      dragRef.current.dragging = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [handleSide]);

  function onResizeMouseDown(clientX: number) {
    dragRef.current.dragging = true;
    dragRef.current.startX = clientX;
    dragRef.current.startWidth = sidebarWidthPx;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
  }

  return { sidebarWidthPx, onResizeMouseDown };
}
