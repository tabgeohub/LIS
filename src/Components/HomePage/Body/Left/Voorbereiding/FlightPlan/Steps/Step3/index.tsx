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
import GeometriesList from "../../Common/GeometriesList";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";

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

    const notHerhalenGeometries = dbGeometries.filter((geometry) => {
      const herhalenValue =
        typeof geometry.herhalen === "number"
          ? geometry.herhalen === 0
          : typeof geometry.herhalen === "string"
            ? geometry.herhalen === "0"
            : geometry.herhalen === false;
      return herhalenValue;
    });
    
    setGeometries(notHerhalenGeometries);
    setFilteredGeometries(notHerhalenGeometries);

    // Clear selected geometries that don't match the herhalen filter
    const validGeometryIds = notHerhalenGeometries.map((g) => g.id);
    setSelectedGeometries2((prev) => prev.filter((id) => validGeometryIds.includes(id)));
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
