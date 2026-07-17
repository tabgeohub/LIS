export type BottomPanelDragState = {
  dragging: boolean;
  startY: number;
  startVh: number;
};

export function clampPanelVh(v: number, min = 20, max = 90) {
  return Math.max(min, Math.min(max, v));
}

export function computePanelVhFromDrag(input: {
  drag: BottomPanelDragState;
  clientY: number;
  innerHeight: number;
}) {
  const deltaY = input.clientY - input.drag.startY;
  const deltaVh = (deltaY / input.innerHeight) * 100;
  return clampPanelVh(input.drag.startVh - deltaVh);
}

export function beginBottomPanelDrag(input: {
  dragRef: { current: BottomPanelDragState };
  clientY: number;
  panelVh: number;
}) {
  input.dragRef.current.dragging = true;
  input.dragRef.current.startY = input.clientY;
  input.dragRef.current.startVh = input.panelVh;
  document.body.style.userSelect = "none";
}

export function endBottomPanelDrag(dragRef: { current: BottomPanelDragState }) {
  if (!dragRef.current.dragging) return;
  dragRef.current.dragging = false;
  document.body.style.userSelect = "";
}

/** Attach window listeners for bottom panel resize; returns cleanup. */
export function attachBottomPanelResizeListeners(input: {
  dragRef: { current: BottomPanelDragState };
  setPanelVh: (vh: number) => void;
}) {
  const onMove = (e: MouseEvent) => {
    if (!input.dragRef.current.dragging) return;
    input.setPanelVh(
      computePanelVhFromDrag({
        drag: input.dragRef.current,
        clientY: e.clientY,
        innerHeight: window.innerHeight,
      })
    );
  };

  const onUp = () => endBottomPanelDrag(input.dragRef);

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  return () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
}
