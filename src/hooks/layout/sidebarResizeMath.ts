export type ResizeHandleSide = "left" | "right";

export const MIN_SIDEBAR_WIDTH_PX = 260;

export function getMaxSidebarWidthPx() {
  return Math.max(360, (window.innerWidth * 0.6) | 0);
}

export function clampSidebarWidth(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function getSidebarResizeDelta(
  handleSide: ResizeHandleSide,
  startX: number,
  clientX: number
) {
  return handleSide === "right" ? clientX - startX : startX - clientX;
}

export type SidebarDragState = {
  dragging: boolean;
  startX: number;
  startWidth: number;
};

export function beginSidebarResizeDrag(input: {
  dragRef: { current: SidebarDragState };
  clientX: number;
  sidebarWidthPx: number;
}) {
  input.dragRef.current.dragging = true;
  input.dragRef.current.startX = input.clientX;
  input.dragRef.current.startWidth = input.sidebarWidthPx;
  document.body.style.userSelect = "none";
  document.body.style.cursor = "ew-resize";
}

export function computeSidebarWidthFromDrag(input: {
  handleSide: ResizeHandleSide;
  drag: SidebarDragState;
  clientX: number;
}) {
  const deltaX = getSidebarResizeDelta(
    input.handleSide,
    input.drag.startX,
    input.clientX
  );
  return clampSidebarWidth(
    input.drag.startWidth + deltaX,
    MIN_SIDEBAR_WIDTH_PX,
    getMaxSidebarWidthPx()
  );
}

export function endSidebarResizeDrag(dragRef: { current: SidebarDragState }) {
  if (!dragRef.current.dragging) return;
  dragRef.current.dragging = false;
  document.body.style.userSelect = "";
  document.body.style.cursor = "";
}
