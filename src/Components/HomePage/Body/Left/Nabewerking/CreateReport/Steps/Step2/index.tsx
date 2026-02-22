/* eslint-disable react-hooks/exhaustive-deps */
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useEffect } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { TbLine, TbPolygon } from "react-icons/tb";
import {
  FinishedFlightPlanType,
  FinishedPointType,
  FinishedGeometryType,
} from "Types/finished_plans";
import { useReadData } from "utils/useReadData";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

export default function Step2() {
  const logAction = useLogAction();

  const { mapView, geometriesGraphicsLayer } = useMapViewState();
  const {
    selectedPlan,
    selectedPoints,
    setSelectedPoints,
    selectedGeometries,
    setSelectedGeometries,
    setSelectedPlan,
  } = useCreateReportState();

  const { points, setPoints } = usePointsStore();

  const { data: finishedPlan } = useReadData<FinishedFlightPlanType>(
    "/finished_plans/getSingleFinishedFlightPlan/" + selectedPlan?.id
  );

  useEffect(() => {
    const planPointsIds = selectedPlan?.points_data.flatMap(
      (point) => point.id
    );

    const filteredPoints = points.filter((point) =>
      planPointsIds?.includes(point.id)
    );

    setPoints(filteredPoints);
  }, []);

  function handleHoveredPoint(point: FinishedPointType) {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes.label === "hovered-point")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    createPin(point, mapView!, "hovered-point");
  }

  function handleRemoveHoverePoint() {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes.label === "hovered-point")
      .forEach((graphic) => mapView.graphics.remove(graphic));
  }

  function handleHoveredGeometry(geometry: FinishedGeometryType) {
    if (!mapView || !geometry) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    if (!geometry.points || geometry.points.length === 0) return;

    const coordinates = geometry.points.map((point) => [
      point.longitude,
      point.latitude,
    ]);

    let hoverGraphic: Graphic | null = null;

    if (geometry.geometry_type === "polygon") {
      const ring = [...coordinates];
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
      }

      const polygon = new Polygon({
        rings: [ring],
        spatialReference: { wkid: 4326 },
      });

      const hoverSymbol = new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          color: [255, 213, 0, 0.9],
          width: 3,
        },
      });

      hoverGraphic = new Graphic({
        geometry: polygon,
        symbol: hoverSymbol,
        attributes: {
          label: "hovered-geometry",
          geometryId: geometry.id,
        },
      });
    } else if (geometry.geometry_type === "line") {
      const polyline = new Polyline({
        paths: [coordinates],
        spatialReference: { wkid: 4326 },
      });

      const hoverSymbol = new SimpleLineSymbol({
        color: [255, 213, 0, 0.9],
        width: 4,
      });

      hoverGraphic = new Graphic({
        geometry: polyline,
        symbol: hoverSymbol,
        attributes: {
          label: "hovered-geometry",
          geometryId: geometry.id,
        },
      });
    }

    if (hoverGraphic) {
      mapView.graphics.add(hoverGraphic);
    }
  }

  function handleRemoveHoveredGeometry() {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
      .forEach((graphic) => mapView.graphics.remove(graphic));
  }

  function handleSelectGeometry(geometry: FinishedGeometryType) {
    if (selectedGeometries.includes(geometry.id)) {
      setSelectedGeometries(selectedGeometries.filter((g) => g !== geometry.id));
    } else {
      setSelectedGeometries([...selectedGeometries, geometry.id]);
    }
  }

  function handleSelectPoint(point: FinishedPointType) {
    if (!mapView) return;

    if (selectedPoints.includes(point.id)) {
      setSelectedPoints(selectedPoints.filter((p) => p !== point.id));
    } else {
      setSelectedPoints([...selectedPoints, point.id]);
    }
  }

  useDrawYellowMarkers({
    selectedPointIds: selectedPoints,
    points: selectedPlan?.points_data || [],
  });

  useEffect(() => {
    if (!mapView || !selectedPlan) return;

    // Clear only point graphics (not geometry graphics)
    const graphicsArray = mapView.graphics.toArray();
    graphicsArray
      .filter(
        (graphic) =>
          graphic.attributes?.label !== "hovered-geometry" &&
          graphic.attributes?.label !== "hovered-point"
      )
      .forEach((graphic) => mapView.graphics.remove(graphic));

    if (selectedPoints.length > 0) {
      selectedPlan.points_data
        .filter((point) => selectedPoints.includes(point.id))
        .forEach((point) => {
          createPin(point, mapView);
        });
    }

    logAction({
      message: "User selected points",
      step: "First step",
      newData: {
        points: selectedPoints,
      },
    });
  }, [selectedPoints]);

  // Render all plan geometries on map (blue) and selected ones (yellow)
  useEffect(() => {
    if (!mapView || !selectedPlan || !geometriesGraphicsLayer) return;

    geometriesGraphicsLayer.removeAll();

    const graphics: Graphic[] = [];

    // First, render all geometries in blue
    selectedPlan.geometries?.forEach((geometry) => {
      if (!geometry.points || geometry.points.length === 0) return;

      const coordinates = geometry.points.map((point) => [
        point.longitude,
        point.latitude,
      ]);

      if (geometry.geometry_type === "polygon") {
        const ring = [...coordinates];
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          ring.push([first[0], first[1]]);
        }

        const polygon = new Polygon({
          rings: [ring],
          spatialReference: { wkid: 4326 },
        });

        // Blue symbol for all geometries
        const blueSymbol = new SimpleFillSymbol({
          color: [0, 0, 0, 0], // Transparent fill
          outline: {
            color: [0, 0, 255, 1], // Blue outline
            width: 2,
          },
        });

        graphics.push(
          new Graphic({
            geometry: polygon,
            symbol: blueSymbol,
            attributes: {
              geometryId: geometry.id,
              geometryType: "polygon",
              omschrijving: geometry.geometry_omschrijving,
              type: "geometry",
            },
          })
        );
      } else if (geometry.geometry_type === "line") {
        const polyline = new Polyline({
          paths: [coordinates],
          spatialReference: { wkid: 4326 },
        });

        // Blue symbol for all geometries
        const blueSymbol = new SimpleLineSymbol({
          color: [0, 0, 255, 1], // Blue
          width: 3,
        });

        graphics.push(
          new Graphic({
            geometry: polyline,
            symbol: blueSymbol,
            attributes: {
              geometryId: geometry.id,
              geometryType: "line",
              omschrijving: geometry.geometry_omschrijving,
              type: "geometry",
            },
          })
        );
      }
    });

    // Then, overlay selected geometries in yellow on top
    if (selectedGeometries.length > 0) {
      selectedPlan.geometries
        ?.filter((geometry) => selectedGeometries.includes(geometry.id))
        .forEach((geometry) => {
          if (!geometry.points || geometry.points.length === 0) return;

          const coordinates = geometry.points.map((point) => [
            point.longitude,
            point.latitude,
          ]);

          if (geometry.geometry_type === "polygon") {
            const ring = [...coordinates];
            const first = ring[0];
            const last = ring[ring.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
              ring.push([first[0], first[1]]);
            }

            const polygon = new Polygon({
              rings: [ring],
              spatialReference: { wkid: 4326 },
            });

            const yellowSymbol = new SimpleFillSymbol({
              color: [0, 0, 0, 0],
              outline: {
                color: [255, 255, 0, 1],
                width: 3,
              },
            });

            graphics.push(
              new Graphic({
                geometry: polygon,
                symbol: yellowSymbol,
                attributes: {
                  ...geometry,
                  isSelected: true,
                },
              })
            );
          } else if (geometry.geometry_type === "line") {
            const polyline = new Polyline({
              paths: [coordinates],
              spatialReference: { wkid: 4326 },
            });

            const yellowSymbol = new SimpleLineSymbol({
              color: [255, 255, 0, 1],
              width: 4,
            });

            graphics.push(
              new Graphic({
                geometry: polyline,
                symbol: yellowSymbol,
                attributes: {
                  ...geometry,
                  isSelected: true,
                },
              })
            );
          }
        });
    }

    if (graphics.length > 0) {
      geometriesGraphicsLayer.addMany(graphics);
    }

    logAction({
      message: "User selected geometries",
      step: "First step",
      newData: {
        geometries: selectedGeometries,
      },
    });
  }, [
    selectedGeometries,
    mapView,
    selectedPlan,
    geometriesGraphicsLayer,
  ]);

  useEffect(() => {
    if (!finishedPlan) return;

    setSelectedPlan(finishedPlan);
  }, [finishedPlan]);

  if (!selectedPlan) return;

  function handleSelectAll() {
    setSelectedPoints(
      selectedPlan?.points_data.flatMap((point) => point.id) as number[]
    );
    setSelectedGeometries(
      selectedPlan?.geometries?.flatMap((geometry) => geometry.id) || []
    );
  }

  function handleSelectNone() {
    setSelectedPoints([]);
    setSelectedGeometries([]);
  }

  return (
    <div className="space-y-[1px]">
      <div className="text-[13px] ml-4 flex text-blue-500 items-center gap-x-2 mt-2 font-medium">
        <button onClick={handleSelectAll}>Selecteer alle</button>

        <div className="h-[16px] w-[1px] bg-blue-300" />

        <button onClick={handleSelectNone}>Selecteer geen</button>
      </div>

      {/* Points */}
      {selectedPlan.points_data.map((point) => (
        <div
          className={`flex items-center space-x-3 p-2 py-1 hover:bg-gray-100 transition-all duration-300 ${selectedPoints.includes(point.id) && "bg-gray-200"
            }`}
          key={point.id}
          onMouseEnter={() => handleHoveredPoint(point)}
          onMouseLeave={handleRemoveHoverePoint}
        >
          <input
            type="checkbox"
            className="h-[12px] w-[12px] cursor-pointer"
            onClick={() => handleSelectPoint(point)}
            checked={selectedPoints.includes(point.id)}
          />
          <div
            onClick={() => setSelectedPoints([point.id])}
            className="flex items-center space-x-1 w-full cursor-pointer"
          >
            <FaMapMarkedAlt className="size-4 text-blue-500" />
            <p>{point.omschrijving}</p>
          </div>
        </div>
      ))}

      {/* Geometries */}
      {selectedPlan.geometries?.map((geometry) => (
        <div
          className={`flex items-center space-x-3 p-2 py-1 hover:bg-gray-100 transition-all duration-300 ${selectedGeometries.includes(geometry.id) && "bg-gray-200"
            }`}
          key={geometry.id}
          onMouseEnter={() => handleHoveredGeometry(geometry)}
          onMouseLeave={handleRemoveHoveredGeometry}
        >
          <input
            type="checkbox"
            className="h-[12px] w-[12px] cursor-pointer"
            onClick={() => handleSelectGeometry(geometry)}
            checked={selectedGeometries.includes(geometry.id)}
          />
          <div
            onClick={() => setSelectedGeometries([geometry.id])}
            className="flex items-center space-x-1 w-full cursor-pointer"
          >
            {geometry.geometry_type === "polygon" ? (
              <TbPolygon className="size-4 text-yellow-500" />
            ) : (
              <TbLine className="size-4 text-green-500" />
            )}
            <p>
              {geometry.geometry_omschrijving || `Geometrie ${geometry.id}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
