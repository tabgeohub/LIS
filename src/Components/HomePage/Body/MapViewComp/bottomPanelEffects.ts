import { useEffect } from "react";

export function observeBottomContainerSize(input: {
  element: HTMLDivElement;
  setSize: (size: { width: number; height: number }) => void;
}) {
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    input.setSize({ width, height });
  });
  observer.observe(input.element);
  return () => observer.disconnect();
}

export function useSyncPanelVh(
  openAllTable: boolean,
  setPanelVh: (vh: number) => void
) {
  useEffect(() => {
    setPanelVh(openAllTable ? 90 : 55);
  }, [openAllTable, setPanelVh]);
}

export function useBottomContainerSize(input: {
  openTable: boolean;
  panelVh: number;
  bottomContainerRef: React.RefObject<HTMLDivElement | null>;
  setBottomDimensions: (size: { width: number; height: number }) => void;
}) {
  useEffect(() => {
    if (!input.openTable) {
      input.setBottomDimensions({ width: 0, height: 0 });
      return;
    }
    const element = input.bottomContainerRef.current;
    if (!element) return;
    return observeBottomContainerSize({
      element,
      setSize: input.setBottomDimensions,
    });
  }, [input.openTable, input.panelVh, input.bottomContainerRef, input.setBottomDimensions]);
}
