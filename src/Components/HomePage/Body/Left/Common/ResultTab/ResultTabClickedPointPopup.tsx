import { RefObject } from "react";
import { EnrichedPointType } from "Types";
import ClickedPointFunctions from "Components/HomePage/Body/Bottom/ClickedPointFunctions";

export default function ResultTabClickedPointPopup({
  clickedPoint,
  position,
  popupRef,
}: {
  clickedPoint: EnrichedPointType;
  position: { top: number; left: number };
  popupRef: RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={popupRef}
      className="fixed bg-white max-w-[250px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50"
      style={{
        top: position.top - 30,
        left: position.left + 30,
      }}
    >
      <ClickedPointFunctions clickedPoint={clickedPoint} />
    </div>
  );
}
