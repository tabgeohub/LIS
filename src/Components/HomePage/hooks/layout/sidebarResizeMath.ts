export type ResizeHandleSide = "left" | "right";

export const MIN_SIDEBAR_WIDTH_PX = 260;

export function getMaxSidebarWidthPx() {
  return Math.max(360, (window.innerWidth * 0.6) | 0);
}

export function clampSidebarWidth(input: {
  v: number;
  min: number;
  max: number;
}) {
  return Math.max(input.min, Math.min(input.max, input.v));
}

export function getSidebarResizeDelta(input: {
  handleSide: ResizeHandleSide;
  startX: number;
  clientX: number;
}) {
  return input.handleSide === "right"
    ? input.clientX - input.startX
    : input.startX - input.clientX;
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
  const deltaX = getSidebarResizeDelta({
    handleSide: input.handleSide,
    startX: input.drag.startX,
    clientX: input.clientX,
  });
  return clampSidebarWidth({
    v: input.drag.startWidth + deltaX,
    min: MIN_SIDEBAR_WIDTH_PX,
    max: getMaxSidebarWidthPx(),
  });
}

export function endSidebarResizeDrag(dragRef: { current: SidebarDragState }) {
  if (!dragRef.current.dragging) return;
  dragRef.current.dragging = false;
  document.body.style.userSelect = "";
  document.body.style.cursor = "";
}
