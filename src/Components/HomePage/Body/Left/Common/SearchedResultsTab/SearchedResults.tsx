/* eslint-disable react-hooks/exhaustive-deps */
import { useSearchKeyword } from "@helpers/ZustandStates/searchKeyword";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import { BsTextParagraph } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { FaMapMarkedAlt } from "react-icons/fa";
import GroupFunctions from "./Functions/GroupFunctions";
import ListPointFunctions from "./Functions/ListPointsFunctions";
import { EnrichedPointType, FlightPlanType } from "Types";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useTabState } from "@helpers/ZustandStates/tabState";
import useLogAction from "hooks/useLogAction";

export default function SearchedResults({
  setFase,
  flightPlansData,
  pointsData,
  setTarget,
}: {
  setFase: (value: string) => void;
  flightPlansData: FlightPlanType[];
  pointsData: EnrichedPointType[];
  setTarget: (value: string) => void;
}) {
  const logAction = useLogAction();

  const [openListFlightDiv, setOpenListFlightDiv] = useState(false);
  const [openListPointDiv, setOpenListPointDiv] = useState(false);
  const [openListDiv, setOpenListDiv] = useState(false);

  const { searchKeyword } = useSearchKeyword();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSearchedTab } = useOpenSearchedTab();
  const { setSelectedTab } = useTabState();

  const totalResults =
    (flightPlansData?.length || 0) + (pointsData?.length || 0);

  const closeSearch = () => {
    setSelectedBottomTab("Kaartlagenlijst");
    setOpenSearchedTab(false);
    setSelectedTab("none");
  };

  return (
    <div>
      <div className="relative flex justify-center text-sm py-2 text-gray-500 border-b-[1px] border-gray-100">
        <div>
          ZoekResultaten: {searchKeyword} {`( ${totalResults} )`}
        </div>
        <div className="gap-x-2 absolute right-2 top-1">
          <button
            className="bg-transparent text-gray-500 text-lg font-bold mr-2"
            onClick={() => setOpenListDiv(!openListDiv)}
          >
            <BsTextParagraph className="mt-2" />
          </button>

          <button
            className="bg-transparent text-gray-500 text-lg font-bold"
            onClick={closeSearch}
          >
            <CgClose className="mt-2" />
          </button>
        </div>

        {openListDiv && (
          <ListPointFunctions
            setFase={setFase}
            pointsData={pointsData}
            flightPlansData={flightPlansData}
          />
        )}
      </div>

      {flightPlansData?.length > 0 && (
        <div className="relative flex justify-between px-2 py-[2px] text-sm border-b-[1px] border-gray-100 hover:bg-blue-100">
          <div className="flex gap-x-2">
            <FaMapMarkedAlt className="text-blue-400 text-lg" />
            <div>({flightPlansData.length}) Vluchtplan</div>
          </div>

          <div className="relative flex gap-x-2 my-auto">
            <span className="my-auto cursor-pointer">
              <IoIosArrowForward
                className="text-gray-500 my-auto"
                onClick={() => {
                  setTarget("flightPlans");
                  setFase("flightPlans");

                  logAction({
                    message:
                      "User clicked right chevron icon to open flight plans list",
                    step: "Searched results",
                  });
                }}
              />
            </span>

            <span className="text-gray-500 my-auto text-xl font-bold">|</span>

            <TfiMoreAlt
              className="text-gray-500 my-auto cursor-pointer"
              onClick={() => {
                setOpenListFlightDiv(!openListFlightDiv);
                setOpenListPointDiv(false);
                setTarget("flightPlans");

                logAction({
                  message:
                    "User clicked 3 dots icon to open drop down of flight plans",
                  step: "Searched results",
                });
              }}
            />
          </div>

          {openListFlightDiv && (
            <div className="absolute right-8 top-8 z-50 max-h-[400px] overflow-y-scroll">
              <GroupFunctions
                setFase={setFase}
                target="flightPlans"
                pointsData={pointsData}
                flightPlansData={flightPlansData}
              />
            </div>
          )}
        </div>
      )}

      {pointsData?.length > 0 && (
        <div className="relative flex justify-between px-2 py-[2px] text-sm border-b-[1px] border-gray-100 hover:bg-blue-100">
          <div className="flex gap-x-2">
            <FaMapMarkedAlt className="text-blue-400 text-lg" />
            <div>({pointsData.length}) Aandachtspunten</div>
          </div>
          <div className="relative flex gap-x-2 my-auto">
            <span className="my-auto cursor-pointer">
              <IoIosArrowForward
                className="text-gray-500 my-auto"
                onClick={() => {
                  setTarget("points");
                  setFase("points");

                  logAction({
                    message:
                      "User clicked right chevron icon to open points list",
                    step: "Searched results",
                  });
                }}
              />
            </span>

            <span className="text-gray-500 my-auto text-xl font-bold">|</span>

            <TfiMoreAlt
              className="text-gray-500 my-auto cursor-pointer"
              onClick={() => {
                setOpenListPointDiv(!openListPointDiv);
                setOpenListFlightDiv(false);
                setTarget("points");

                logAction({
                  message:
                    "User clicked 3 dots icon to open drop down of points",
                  step: "Searched results",
                });
              }}
            />
          </div>

          {openListPointDiv && (
            <div className="absolute right-8 top-8 z-50 max-h-[400px] overflow-y-scroll">
              <GroupFunctions
                setFase={setFase}
                target="points"
                pointsData={pointsData}
                flightPlansData={flightPlansData}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
