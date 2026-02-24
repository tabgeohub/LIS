import { RefObject } from "react";
import { EnrichedPointType } from "Types";
import ClickedPointFunctions from "../../../ClickedPointFunctions";

interface ClickedPointPopupProps {
  clickedPoint: EnrichedPointType | undefined;
  clickedPointPosition: { top: number; left: number } | null;
  popupRef: RefObject<HTMLDivElement>;
}

export default function ClickedPointPopup({
  clickedPoint,
  clickedPointPosition,
  popupRef,
}: ClickedPointPopupProps) {
  if (!clickedPoint || !clickedPointPosition) return null;

  return (
    <div
      ref={popupRef}
      className="fixed bg-white w-64 max-w-64 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50"
      style={{
        bottom: window.innerHeight - clickedPointPosition.top + 30,
        left: clickedPointPosition.left + 30,
      }}
    >
      <ClickedPointFunctions clickedPoint={clickedPoint} />
    </div>
  );
}

