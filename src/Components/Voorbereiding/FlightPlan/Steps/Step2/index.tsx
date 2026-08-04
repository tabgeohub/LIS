/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import Buttons from "./Buttons";
import Filter from "Components/Voorbereiding/FlightPlan/Common/Filter";
import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";

import { usePointsStore } from "hooks/features";
import { useGeometriesStore, Geometry } from "hooks/features";

import { useFlightPlanState } from "Components/Voorbereiding/FlightPlan/useFlightPlanState";
import Header from "Components/Voorbereiding/FlightPlan/Common/Header";
import PointsList from "Components/Voorbereiding/FlightPlan/Common/PointsList";
import GeometriesList from "Components/Voorbereiding/FlightPlan/Common/GeometriesList";
import { EnrichedPointType } from "Types";
import { matchesGeometryRepeat } from "@helpers/geometry/matchesGeometryRepeat";

dayjs.extend(isBetween);

export default function Step2() {
  const { points, dbPoints, setPoints } = usePointsStore();
  const { geometries, dbGeometries, setGeometries } = useGeometriesStore();
  const { selectedPoints, setSelectedPoints, selectedGeometries, setSelectedGeometries } = useFlightPlanState();

  const [filteredPoints, setFilteredPoints] =
    useState<EnrichedPointType[]>(points);
  const [filteredGeometries, setFilteredGeometries] =
    useState<Geometry[]>(geometries);

  const [openFilter, setOpenFilter] = useState(false);

  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    setPoints(dbPoints.filter((point) => point.herhalen === 1));
    setFilteredPoints(dbPoints.filter((point) => point.herhalen === 1));

    const herhalenGeometries = dbGeometries.filter((geometry) =>
      matchesGeometryRepeat(geometry, true)
    );

    setGeometries(herhalenGeometries);
    setFilteredGeometries(herhalenGeometries);

    // Clear selected geometries that don't match the herhalen filter
    const validGeometryIds = herhalenGeometries.map((g) => g.id);
    setSelectedGeometries(selectedGeometries.filter((id) => validGeometryIds.includes(id)));
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
            <GeometriesList
              selectedGeometries={selectedGeometries}
              setSelectedGeometries={setSelectedGeometries}
              geometries={filteredGeometries.filter((geometry) =>
                geometry.omschrijving
                  .toLowerCase()
                  .includes(filterText.toLowerCase())
              )}
            />
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
          setFilteredGeometries={(geometries) => {
            setFilteredGeometries(geometries);
            setGeometries(geometries);
          }}
          herhalen={true}
          setOpenFilter={setOpenFilter}
        />
      )}
    </div>
  );
}
