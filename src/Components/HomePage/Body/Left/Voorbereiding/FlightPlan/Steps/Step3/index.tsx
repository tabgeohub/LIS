/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { EnrichedPointType } from "Types";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useFlightPlanState } from "../../helpers/flightPlanStates";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import Filter from "../../Common/Filter";
import Header from "../../Common/Header";
import PointsList from "../../Common/PointsList";
import { usePointsStore } from "hooks/features/usePointsStore";

dayjs.extend(isBetween);

export default function Step3({ basemapString }: { basemapString: string }) {
  const { points, setPoints, dbPoints } = usePointsStore();
  const { selectedPoints2, setSelectedPoints2 } = useFlightPlanState();

  const [openFilter, setOpenFilter] = useState(false);
  const [filteredPoints, setFilteredPoints] =
    useState<EnrichedPointType[]>(points);

  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    setPoints(dbPoints.filter((point) => point.herhalen === 0));

    setFilteredPoints(dbPoints.filter((point) => point.herhalen === 0));
  }, []);

  return (
    <div className="p-1.5 h-full ">
      {!openFilter ? (
        <>
          <Header
            filterText={filterText}
            setFilterText={setFilterText}
            herhalen={false}
          />

          <ScrollButtonsLayout
            className="h-[92%]"
            buttons={
              <Buttons
                setOpenFilter={setOpenFilter}
                basemapString={basemapString}
              />
            }
          >
            <PointsList
              selectedPoints={selectedPoints2}
              setSelectedPoints={setSelectedPoints2}
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
          herhalen={false}
          setFilteredPoints={setFilteredPoints}
          setOpenFilter={setOpenFilter}
        />
      )}
    </div>
  );
}
