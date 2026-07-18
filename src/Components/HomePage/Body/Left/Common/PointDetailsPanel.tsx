import ClickedPointFunctions from "Components/HomePage/Body/Bottom/ClickedPointFunctions";
import PointDetailsFieldsList from "Components/HomePage/Body/Left/Common/PointDetailsFieldsList";
import { useState } from "react";
import { BsTextParagraph } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { EnrichedPointType } from "Types";

export type PointDetailsPanelProps = {
  clickedPoint: EnrichedPointType | undefined;
  onBack: () => void;
  onDetailsToggle?: () => void;
};

/** Shared point-details chrome used by ResultTab and SearchedResultsTab. */
export default function PointDetailsPanel({
  clickedPoint,
  onBack,
  onDetailsToggle,
}: PointDetailsPanelProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <div className="relative flex items-center justify-center my-2">
        <button className="bg-transparent text-gray-500 text-lg font-bold absolute left-2 -top-1">
          <IoIosArrowBack className="mt-2" onClick={onBack} />
        </button>

        <h4 className="text-md text-gray-400">{clickedPoint?.omschrijving}</h4>

        <button
          className="bg-transparent text-gray-500 text-lg font-bold absolute right-2 -top-1"
          onClick={() => {
            setShowPopup(!showPopup);
            onDetailsToggle?.();
          }}
        >
          <BsTextParagraph className="mt-2" />
        </button>

        {showPopup && (
          <div className="absolute bg-white top-[100%] right-0 max-w-[250px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50">
            <ClickedPointFunctions clickedPoint={clickedPoint} />
          </div>
        )}
      </div>

      <div className="px-2 overflow-y-scroll h-[70vh] pb-20">
        <p className="my-6 text-gray-500">Details</p>
        <PointDetailsFieldsList point={clickedPoint} />
      </div>
    </div>
  );
}
