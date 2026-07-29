/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { EnrichedPointType } from "Types";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useFlightPlanState } from "Components/HomePage/hooks/zustand/voorbereiding/useFlightPlanState";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import Filter from "Components/Voorbereiding/FlightPlan/Common/Filter";
import Header from "Components/Voorbereiding/FlightPlan/Common/Header";
import PointsList from "Components/Voorbereiding/FlightPlan/Common/PointsList";
import GeometriesList from "Components/Voorbereiding/FlightPlan/Common/GeometriesList";
import { usePointsStore } from "hooks/features";
import { useGeometriesStore, Geometry } from "hooks/features";
import { matchesGeometryRepeat } from "@helpers/geometry/matchesGeometryRepeat";

dayjs.extend(isBetween);

export default function Step3({ basemapString }: { basemapString: string }) {
  const { points, setPoints, dbPoints } = usePointsStore();
  const { geometries, dbGeometries, setGeometries } = useGeometriesStore();
  const { selectedPoints2, setSelectedPoints2, selectedGeometries2, setSelectedGeometries2 } = useFlightPlanState();

  const [openFilter, setOpenFilter] = useState(false);
  const [filteredPoints, setFilteredPoints] =
    useState<EnrichedPointType[]>(points);
  const [filteredGeometries, setFilteredGeometries] =
    useState<Geometry[]>(geometries);

  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    setPoints(dbPoints.filter((point) => point.herhalen === 0));
    setFilteredPoints(dbPoints.filter((point) => point.herhalen === 0));

    const notHerhalenGeometries = dbGeometries.filter((geometry) =>
      matchesGeometryRepeat(geometry, false)
    );
    
    setGeometries(notHerhalenGeometries);
    setFilteredGeometries(notHerhalenGeometries);

    // Clear selected geometries that don't match the herhalen filter
    const validGeometryIds = notHerhalenGeometries.map((g) => g.id);
    setSelectedGeometries2(selectedGeometries2.filter((id) => validGeometryIds.includes(id)));
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
            <GeometriesList
              selectedGeometries={selectedGeometries2}
              setSelectedGeometries={setSelectedGeometries2}
              geometries={filteredGeometries.filter((geometry) =>
                geometry.omschrijving
                  .toLowerCase()
                  .includes(filterText.toLowerCase())
              )}
            />

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
          setFilteredGeometries={(geometries) => {
            setFilteredGeometries(geometries);
            setGeometries(geometries);
          }}
          setOpenFilter={setOpenFilter}
        />
      )}
    </div>
  );
}
