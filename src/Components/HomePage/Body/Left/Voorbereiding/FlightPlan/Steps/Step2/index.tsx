/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import Buttons from "./Buttons";
import Filter from "../../Common/Filter";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";

import { usePointsStore } from "hooks/zustand/usePointsStore";

import { useFlightPlanState } from "../../helpers/flightPlanStates";
import Header from "../../Common/Header";
import PointsList from "../../Common/PointsList";
import { EnrichedPointType } from "Types";

dayjs.extend(isBetween);

export default function Step2() {
  const { points, dbPoints, setPoints } = usePointsStore();
  const { selectedPoints, setSelectedPoints } = useFlightPlanState();

  const [filteredPoints, setFilteredPoints] =
    useState<EnrichedPointType[]>(points);

  const [openFilter, setOpenFilter] = useState(false);

  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    setPoints(dbPoints.filter((point) => point.herhalen === 1));

    setFilteredPoints(dbPoints.filter((point) => point.herhalen === 1));
  }, []);

  return (
    <div className="p-1.5 h-full">
      {!openFilter ? (
        <>
          <Header
            filterText={filterText}
            setFilterText={setFilterText}
            herhalen={true}
          />

          <ScrollButtonsLayout
            buttons={<Buttons setOpenFilter={setOpenFilter} />}
          >
            <PointsList
              selectedPoints={selectedPoints}
              setSelectedPoints={setSelectedPoints}
              points={filteredPoints.filter((point) =>
                point.omschrijving
                  .toLowerCase()
                  .includes(filterText.toLowerCase())
              )}
            />
          </ScrollButtonsLayout>
        </>
      ) : (
        <Filter
          setFilteredPoints={setFilteredPoints}
          herhalen={true}
          setOpenFilter={setOpenFilter}
        />
      )}
    </div>
  );
}
