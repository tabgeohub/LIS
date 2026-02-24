/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import Buttons from "./Buttons";
import Filter from "../../Common/Filter";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";

import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";

import { useFlightPlanState } from "../../helpers/flightPlanStates";
import Header from "../../Common/Header";
import PointsList from "../../Common/PointsList";
import GeometriesList from "../../Common/GeometriesList";
import { EnrichedPointType } from "Types";

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

    const herhalenGeometries = dbGeometries.filter((geometry) => {
      const herhalenValue =
        typeof geometry.herhalen === "number"
          ? geometry.herhalen === 1
          : typeof geometry.herhalen === "string"
            ? geometry.herhalen === "1"
            : geometry.herhalen === true;
      return herhalenValue;
    });
    
    setGeometries(herhalenGeometries);
    setFilteredGeometries(herhalenGeometries);

    // Clear selected geometries that don't match the herhalen filter
    const validGeometryIds = herhalenGeometries.map((g) => g.id);
    setSelectedGeometries((prev) => prev.filter((id) => validGeometryIds.includes(id)));
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
