import { BsTextParagraph } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useState } from "react";
import { EnrichedPointType } from "Types";
import DropDown from "./DropDown";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";

export default function Header({
  pointsData,
  setFase,
  setStarredPoints,
  starredPoints,
}: {
  pointsData: EnrichedPointType[];
  setFase: (value: string) => void;
  setStarredPoints: (value: EnrichedPointType[]) => void;
  starredPoints: EnrichedPointType[];
}) {
  const back = () => {
    if (!graphicsLayer || !graphicsLayerHover || !yellowGraphicsLayer) return;
    yellowGraphicsLayer.removeAll();
    graphicsLayer.removeAll();
    graphicsLayerHover.removeAll();
    setFase("all");
  };

  const [openListPointDiv, setOpenListPointDiv] = useState(false);
  const { graphicsLayerHover, graphicsLayer, yellowGraphicsLayer } =
    useMapViewState();

  return (
    <div className="relative flex justify-center text-sm py-2 text-gray-500 border-b-[1px] border-gray-100">
      <div>Aandachtspunten: ({pointsData.length})</div>
      <div className="gap-x-2 absolute right-2 top-1">
        <button className="bg-transparent text-gray-500 text-lg font-bold mr-2">
          <BsTextParagraph
            className="mt-2"
            onClick={() => setOpenListPointDiv(!openListPointDiv)}
          />
        </button>
      </div>
      <div className="gap-x-2 absolute left-2 top-1">
        <button className="bg-transparent text-gray-500 text-lg font-bold">
          <IoIosArrowBack className="mt-2" onClick={back} />
        </button>
      </div>
      {openListPointDiv && (
        <DropDown
          starredPoints={starredPoints}
          setStarredPoints={setStarredPoints}
          setOpenListPointDiv={setOpenListPointDiv}
          pointsData={pointsData}
          setFase={setFase}
        />
      )}
    </div>
  );
}
