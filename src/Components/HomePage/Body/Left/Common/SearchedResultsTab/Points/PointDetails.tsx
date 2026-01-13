import ClickedPointFunctions from "Components/HomePage/Body/Bottom/ClickedPointFunctions";
import { useState } from "react";
import { BsTextParagraph } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { EnrichedPointType } from "Types";

export default function PointDetails({
  setFase,
  clickedPoint,
}: {
  setFase: (value: string) => void;
  clickedPoint: EnrichedPointType | undefined;
}) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <div className="relative flex items-center justify-center my-2">
        <button className="bg-transparent text-gray-500 text-lg font-bold absolute left-2 -top-1">
          <IoIosArrowBack className="mt-2" onClick={() => setFase("points")} />
        </button>

        <h4 className="text-md text-gray-400">{clickedPoint?.omschrijving}</h4>
        <button
          className="bg-transparent text-gray-500 text-lg font-bold absolute right-2 -top-1"
          onClick={() => setShowPopup(!showPopup)}
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
        <div className="space-y-2">
          <div>
            <p className="text-gray-500 text-[12px]">omschrijving</p>
            <p>{clickedPoint?.omschrijving}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">regio_id</p>
            <p>{clickedPoint?.regio_id}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">xcoordinaat_rd</p>
            <p>{clickedPoint?.xcoordinaat_rd}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">ycoordinaat_rd</p>
            <p>{clickedPoint?.ycoordinaat_rd}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">latitude</p>
            <p>{clickedPoint?.latitude}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">longitude</p>
            <p>{clickedPoint?.longitude}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">herhalen</p>
            <p>{clickedPoint?.herhalen}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">vertrouwelijk</p>
            <p>{clickedPoint?.vertrouwelijk}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">user_id</p>
            <p>{clickedPoint?.user_id}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">activiteit_id</p>
            <p>{clickedPoint?.activiteit_id}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">organisatie_id</p>
            <p>{clickedPoint?.organisatie_id}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">specifiek_letten_op</p>
            <p>{clickedPoint?.specifiek_letten_op}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[12px]">datum</p>
            <p>{clickedPoint?.datum}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
