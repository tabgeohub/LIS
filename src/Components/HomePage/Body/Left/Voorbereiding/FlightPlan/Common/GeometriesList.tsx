import { useEffect, useMemo } from "react";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { Geometry, useGeometriesStore } from "hooks/features/useGeometriesStore";
import Graphic from "@arcgis/core/Graphic";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import useGeometryHover from "hooks/hover-click-handlers/useGeometryHover";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";
import {
  getHerhalenFilterFromGeometries,
  sortGeometriesForSelection,
  toggleGeometrySelection,
} from "./geometryHerhalen";
import { GeometryItemCheckBox } from "./GeometryItemCheckBox";
import { useGeometryListInteractions } from "./useGeometryListMapClick";

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

  useEffect(() => {
    if (!validateMapView(mapView, geometriesGraphicsLayer)) return;

    if (!geometries.length) {
      geometriesGraphicsLayer?.removeAll();
      return;
    }

    const graphics = geometries
      .filter((geometry) => !safeSelectedGeometries.includes(geometry.id))
      .map((geometry) => createGeometryGraphic(geometry))
      .filter((graphic): graphic is Graphic => graphic !== null);

    replaceGraphics(geometriesGraphicsLayer!, graphics);
  }, [geometries, safeSelectedGeometries, mapView, geometriesGraphicsLayer]);

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
