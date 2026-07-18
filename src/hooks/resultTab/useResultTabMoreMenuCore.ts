import { useCallback, useRef, useState } from "react";
import { EnrichedPointType } from "Types";
import { useResultTabPopupDismiss } from "hooks/resultTab/useResultTabPopupDismiss";

export function useResultTabMoreMenu(input: {
  activePoint: EnrichedPointType | undefined;
  setActivePoint: (point: EnrichedPointType | undefined) => void;
}) {
  const { activePoint, setActivePoint } = input;
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  }>();
  const popupRef = useRef<HTMLDivElement | null>(null);

  const dismissPopup = useCallback(() => {
    setActivePoint(undefined);
    setPosition(undefined);
  }, [setActivePoint]);

  useResultTabPopupDismiss({ popupRef, onDismiss: dismissPopup });

  const openMoreMenu = (point: EnrichedPointType, e: React.MouseEvent) => {
    setActivePoint(point);
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom,
      left: rect.left,
    });
  };

  return {
    activePoint,
    position,
    popupRef,
    openMoreMenu,
    dismissPopup,
  };
}
