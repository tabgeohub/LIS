import { useEffect, useMemo } from "react";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { Geometry, useGeometriesStore } from "hooks/features/useGeometriesStore";
import useGeometryHover from "hooks/hover-click-handlers/useGeometryHover";
import {
  getHerhalenFilterFromGeometries,
  sortGeometriesForSelection,
  toggleGeometrySelection,
} from "./geometryHerhalen";
import { GeometryItemCheckBox } from "./GeometryItemCheckBox";
import { useGeometryListInteractions } from "./useGeometryListMapClick";
import { useGeometryListGraphics } from "./useGeometryListGraphics";

export default function GeometriesList({
  selectedGeometries,
  setSelectedGeometries,
  geometries,
}: {
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
  geometries: Geometry[];
}) {
  const logAction = useLogAction();
  const { mapView, redGraphicsLayer, geometriesGraphicsLayer } = useMapViewState();
  const { dbGeometries } = useGeometriesStore();
  const { handleHoveredGeometry, handleRemoveHoveredGeometry } = useGeometryHover();

  const safeSelectedGeometries = useGeometryListInteractions({
    geometries,
    dbGeometries,
    selectedGeometries,
    setSelectedGeometries,
    mapView,
    redGraphicsLayer,
  });

  const herhalenFilter = getHerhalenFilterFromGeometries(geometries);

  useGeometryListGraphics({
    mapView,
    geometriesGraphicsLayer,
    geometries,
    selectedGeometryIds: safeSelectedGeometries,
  });

  useEffect(() => {
    const step = herhalenFilter ? 2 : 3;
    logAction({
      message: "User is selecting geometries",
      step: `Step ${step}`,
      newData: { selectedGeometries: safeSelectedGeometries },
    });
  }, [safeSelectedGeometries, herhalenFilter, logAction]);

  function handleGeometryClick(geometry: Geometry) {
    setSelectedGeometries(
      toggleGeometrySelection(safeSelectedGeometries, geometry.id)
    );
  }

  const sortedGeometries = useMemo(
    () => sortGeometriesForSelection(geometries, safeSelectedGeometries),
    [geometries, safeSelectedGeometries]
  );

  return (
    <>
      {sortedGeometries.map((geometry) => (
        <GeometryItemCheckBox
          key={geometry.id}
          geometry={geometry}
          isSelected={safeSelectedGeometries.includes(geometry.id)}
          onMouseEnter={() => handleHoveredGeometry(geometry)}
          onMouseLeave={handleRemoveHoveredGeometry}
          onCheckboxClick={(e) => {
            e.stopPropagation();
            handleGeometryClick(geometry);
          }}
          onItemClick={() => setSelectedGeometries([geometry.id])}
        />
      ))}
    </>
  );
}
