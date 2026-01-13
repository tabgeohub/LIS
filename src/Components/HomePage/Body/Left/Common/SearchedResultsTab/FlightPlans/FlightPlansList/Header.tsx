import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useState } from "react";
import { BsTextParagraph } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { FlightPlanType } from "Types";
import DropDown from "./DropDown";

export default function Header({
  flightPlansData,
  setFase,
  starredPlans,
  setStarredPlans,
}: {
  flightPlansData: FlightPlanType[];
  setFase: (value: string) => void;
  starredPlans: FlightPlanType[];
  setStarredPlans: (value: FlightPlanType[]) => void;
}) {
  const { graphicsLayerHover, graphicsLayer } = useMapViewState();

  const [openDropDown, setOpenDropDown] = useState(false);

  return (
    <div className="relative flex justify-center text-sm py-2 text-gray-500 border-b-[1px] border-gray-100">
      <div>Vluchtplans: ({flightPlansData.length})</div>

      <div className="gap-x-2 absolute right-2 top-1">
        <button
          onClick={() => setOpenDropDown(!openDropDown)}
          className="bg-transparent text-gray-500 text-lg font-bold mr-2"
        >
          <BsTextParagraph className="mt-2" />
        </button>
      </div>

      <div className="gap-x-2 absolute left-2 top-1">
        <button className="bg-transparent text-gray-500 text-lg font-bold">
          <IoIosArrowBack
            className="mt-2"
            onClick={() => {
              setFase("all");
              graphicsLayer?.removeAll();
              graphicsLayerHover?.removeAll();
            }}
          />
        </button>
      </div>

      {openDropDown && (
        <DropDown
          starredPlans={starredPlans}
          setStarredPlans={setStarredPlans}
          flightPlansData={flightPlansData}
          setFase={setFase}
        />
      )}
    </div>
  );
}
