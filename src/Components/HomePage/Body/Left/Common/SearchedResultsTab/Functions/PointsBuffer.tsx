import { useState } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Circle from "@arcgis/core/geometry/Circle";
import Point from "@arcgis/core/geometry/Point";
import * as bufferOperator from "@arcgis/core/geometry/operators/bufferOperator.js";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import { EnrichedPointType, FlightPlanType } from "Types";

export default function PointsBuffer({
  setFase,
  target,
  pointsData,
  flightPlansData,
}: {
  setFase: (value: string) => void;
  target: string;
  pointsData: EnrichedPointType[];
  flightPlansData: FlightPlanType[];
}) {
  const { mapView, graphicsLayer } = useMapViewState();

  const [distance, setDistance] = useState<number>(0);
  const [unit, setUnit] = useState<"kilometers" | "meters">("kilometers");
  const [saveToSketch, setSaveToSketch] = useState(false);

  const handleBuffer = async () => {
    if (!graphicsLayer || !mapView) return;

    graphicsLayer.removeAll();

    if (target === "points") {
      pointsData.forEach((point) => {
        const center = new Point({
          latitude: point.latitude,
          longitude: point.longitude,
          spatialReference: mapView.spatialReference,
        });

        const circle = new Circle({
          center,
          radius: distance,
          radiusUnit: unit,
          numberOfPoints: 64,
          spatialReference: mapView.spatialReference,
        });

        const symbol = new SimpleFillSymbol({
          color: [255, 0, 0, 0.1],
          outline: { color: [255, 0, 0], width: 2 },
        });

        const graphic = new Graphic({
          geometry: circle,
          symbol,
          attributes: { id: point.id },
        });
        graphicsLayer.add(graphic);
      });

      setFase("all");
    } else if (target === "flightPlans") {
      flightPlansData.forEach((plan) => {
        const points = plan.points;
        if (!Array.isArray(points) || points.length < 3) return;

        const polygonRings = points.map((pt) => [pt.longitude, pt.latitude]);

        const first = polygonRings[0];
        const last = polygonRings[polygonRings.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          polygonRings.push(first);
        }

        const polyg = new Polygon({
          rings: [polygonRings],
        });

        const projectedPolygon = projection.project(
          polyg,
          SpatialReference.WebMercator
        ) as Polygon;

        const buffered = bufferOperator.execute(projectedPolygon, distance, {
          unit,
        });
        if (!buffered) return;

        const symbol = new SimpleFillSymbol({
          color: [0, 0, 255, 0.1],
          outline: { color: [0, 0, 255], width: 2 },
        });

        if (Array.isArray(buffered)) {
          buffered.forEach((geom) => {
            const graphic = new Graphic({
              geometry: geom,
              symbol,
              attributes: { id: plan.id },
            });
            graphicsLayer.add(graphic);
          });
        } else {
          const graphic = new Graphic({
            geometry: buffered,
            symbol,
            attributes: { id: plan.id },
          });
          graphicsLayer.add(graphic);
        }
      });
      setFase("all");
    } else {
      pointsData.forEach((point) => {
        const center = new Point({
          latitude: point.latitude,
          longitude: point.longitude,
          spatialReference: mapView.spatialReference,
        });

        const circle = new Circle({
          center,
          radius: distance,
          radiusUnit: unit,
          numberOfPoints: 64,
          spatialReference: mapView.spatialReference,
        });

        const symbol = new SimpleFillSymbol({
          color: [255, 0, 0, 0.1],
          outline: { color: [255, 0, 0], width: 2 },
        });

        const graphic = new Graphic({
          geometry: circle,
          symbol,
          attributes: { id: point.id },
        });
        graphicsLayer.add(graphic);
      });

      flightPlansData.forEach((plan) => {
        const points = plan.points;
        if (!Array.isArray(points) || points.length < 3) return;

        const polygonRings = points.map((pt) => [pt.longitude, pt.latitude]);

        const first = polygonRings[0];
        const last = polygonRings[polygonRings.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          polygonRings.push(first);
        }

        const polyg = new Polygon({
          rings: [polygonRings],
        });

        const projectedPolygon = projection.project(
          polyg,
          SpatialReference.WebMercator
        ) as Polygon;

        const buffered = bufferOperator.execute(projectedPolygon, distance, {
          unit,
        });
        if (!buffered) return;

        const symbol = new SimpleFillSymbol({
          color: [0, 0, 255, 0.1],
          outline: { color: [0, 0, 255], width: 2 },
        });

        if (Array.isArray(buffered)) {
          buffered.forEach((geom) => {
            const graphic = new Graphic({
              geometry: geom,
              symbol,
              attributes: { id: plan.id },
            });
            graphicsLayer.add(graphic);
          });
        } else {
          const graphic = new Graphic({
            geometry: buffered,
            symbol,
            attributes: { id: plan.id },
          });
          graphicsLayer.add(graphic);
        }
      });

      setFase("all");
    }
  };

  const handleClear = () => {
    graphicsLayer?.removeAll();
  };

  return (
    <div className="p-4 bg-white shadow rounded w-full  space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Afstand
        </label>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Eenheden
        </label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as "kilometers" | "meters")}
          className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
        >
          <option value="kilometers">Kilometers (km)</option>
          <option value="feet">Voet (ft)</option>
          <option value="yards">Yards (yd)</option>
          <option value="meters">Meters (m)</option>
          <option value="miles">Mijlen (mi)</option>
          <option value="nautical-miles">Zeemijlen (NM)</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={saveToSketch}
          onChange={(e) => setSaveToSketch(e.target.checked)}
        />
        <label className="text-sm text-gray-700">Opslaan in schetslaag</label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={handleClear}
          className="px-4 py-1 border border-gray-300 rounded text-blue-600 hover:bg-gray-100"
        >
          Verwijderen
        </button>
        <button
          onClick={() => {
            setFase("list");
          }}
          className="px-4 py-1 border border-gray-300 rounded text-blue-600 hover:bg-gray-100"
        >
          Annuleren
        </button>
        <button
          onClick={handleBuffer}
          className="px-4 py-1 border border-gray-300 rounded text-blue-600 hover:bg-gray-100"
        >
          Doorgaan
        </button>
      </div>
    </div>
  );
}
