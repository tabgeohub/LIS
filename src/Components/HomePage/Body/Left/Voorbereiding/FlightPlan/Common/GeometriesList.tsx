import { Geometry, useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useEffect, useMemo } from "react";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { TbLine, TbPolygon } from "react-icons/tb";
import Graphic from "@arcgis/core/Graphic";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import useGeometryClick from "hooks/hover-click-handlers/useGeometryClick";
import useGeometryHover from "hooks/hover-click-handlers/useGeometryHover";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";
import {
  formatHerhalenLabel,
  getHerhalenFilterFromGeometries,
  sortGeometriesForSelection,
  toggleGeometrySelection,
} from "./geometryHerhalen";

function GeometryItemCheckBox({
  geometry,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  onCheckboxClick,
  onItemClick,
}: {
  geometry: Geometry;
  isSelected: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onCheckboxClick?: (e: React.MouseEvent) => void;
  onItemClick?: () => void;
}) {
  const geometryTypeLabel = geometry.type === "polygon" ? "Veelhoek" : "Lijn";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      key={geometry.id}
      className={`flex items-start cursor-pointer gap-x-2 py-2 my-1 px-2 transition-all duration-300 ${
        isSelected
          ? "bg-gray-200 shadow-sm rounded"
          : "hover:bg-blue-100 shadow-sm rounded"
      }`}
      onClick={onItemClick}
    >
      <div className="flex items-center gap-x-2">
        <input
          checked={isSelected}
          onClick={onCheckboxClick}
          type="checkbox"
          className="size-3 cursor-pointer"
          readOnly
        />
        {geometry.type === "polygon" ? (
          <TbPolygon className="size-6 text-yellow-500" />
        ) : (
          <TbLine className="size-6 text-green-500" />
        )}
      </div>

      <div className="flex flex-col ml-6 text-[10px]">
        <div className="flex gap-x-1 font-medium">
          <p className="text-gray-800">{geometry.omschrijving}</p>
        </div>

        <div className="flex gap-x-1">
          <p className="text-gray-600">Type: </p>
          <p className="text-gray-600">{geometryTypeLabel}</p>
        </div>

        {geometry.activiteit && (
          <div className="flex gap-x-1">
            <p className="text-gray-600">Activiteit </p>
            <p className="text-gray-600">{geometry.activiteit}</p>
          </div>
        )}

        {geometry.organisatie && (
          <div className="flex gap-x-1">
            <p className="text-gray-600">Organisatie </p>
            <p className="text-gray-600">{geometry.organisatie}</p>
          </div>
        )}

        {geometry.specifiek_letten_op && (
          <div className="flex gap-x-1">
            <p className="text-gray-600">Letten op: </p>
            <p className="text-gray-600">{geometry.specifiek_letten_op}</p>
          </div>
        )}

        <div className="flex gap-x-1">
          <p className="text-gray-600">Herhalen: </p>
          <p className="text-gray-600">{formatHerhalenLabel(geometry.herhalen)}</p>
        </div>
      </div>
    </div>
  );
}

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

  const safeSelectedGeometries = Array.isArray(selectedGeometries)
    ? selectedGeometries
    : [];
  const herhalenFilter = getHerhalenFilterFromGeometries(geometries);

  useGeometryClick({
    selectedGeometryIds: safeSelectedGeometries,
    allGeometries: dbGeometries,
    herhalenFilter,
  });
  const { handleHoveredGeometry, handleRemoveHoveredGeometry } = useGeometryHover();

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

  useEffect(() => {
    if (!mapView || !redGraphicsLayer) return;

    const handle = mapView.on("click", async (event) => {
      event.stopPropagation();
      const hitTestResults = await mapView.hitTest(event);
      const existingFeature = hitTestResults.results.find(
        (result) => (result as __esri.GraphicHit).graphic
      );
      const attributes = (existingFeature as __esri.GraphicHit | undefined)?.graphic
        ?.attributes;

      if (!attributes || attributes.type !== "geometry" || !attributes.geometryId) {
        return;
      }

      const geometry = geometries.find((g) => g.id === attributes.geometryId);
      if (geometry) handleGeometryClick(geometry);
    });

    return () => handle.remove();
  }, [safeSelectedGeometries, geometries, mapView, redGraphicsLayer]);

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
