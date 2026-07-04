import { ReactNode } from "react";
import { BsTextParagraph } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import ListPointFunctions from "./ListPointsFunctions";
import { EnrichedPointType } from "Types";

type ResultTabPointsHeaderProps = {
  count: number;
  onBack: () => void;
  openListPointDiv: boolean;
  setOpenListPointDiv: (open: boolean) => void;
  setFase: (value: string) => void;
  starredPoints: EnrichedPointType[];
  setStarredPoints: (points: EnrichedPointType[]) => void;
};

export default function ResultTabPointsHeader({
  count,
  onBack,
  openListPointDiv,
  setOpenListPointDiv,
  setFase,
  starredPoints,
  setStarredPoints,
}: ResultTabPointsHeaderProps) {
  return (
    <div className="relative flex items-center justify-center my-2">
      <button
        type="button"
        className="bg-transparent text-gray-500 text-lg font-bold absolute left-2 -top-1"
        onClick={onBack}
      >
        <IoIosArrowBack className="mt-2" />
      </button>

      <h4 className="text-md text-gray-400">Resultaten ({count})</h4>

      <button
        type="button"
        className="bg-transparent text-gray-500 text-lg font-bold absolute right-2 -top-1"
        onClick={() => setOpenListPointDiv(!openListPointDiv)}
      >
        <BsTextParagraph className="mt-2" />
      </button>

      {openListPointDiv && (
        <div className="absolute right-2 top-[130%] z-50 max-h-[400px] overflow-y-scroll">
          <ListPointFunctions
            setStarredPoints={setStarredPoints}
            starredPoints={starredPoints}
            setOpenListPointDiv={setOpenListPointDiv}
            setFase={setFase}
          />
        </div>
      )}
    </div>
  );
}
