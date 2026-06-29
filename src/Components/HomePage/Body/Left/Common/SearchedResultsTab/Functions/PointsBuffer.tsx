import { useState } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { EnrichedPointType, FlightPlanType } from "Types";
import {
  bufferFlightPlansOnLayer,
  bufferPointsOnLayer,
} from "@helpers/ArcGISHelpers/bufferGraphics";

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

    const includePoints = target !== "flightPlans";
    const includePlans = target !== "points";

    if (includePoints) {
      bufferPointsOnLayer(
        pointsData,
        distance,
        unit,
        graphicsLayer,
        mapView
      );
    }

    if (includePlans) {
      bufferFlightPlansOnLayer(
        flightPlansData,
        distance,
        unit,
        graphicsLayer
      );
    }

    setFase("all");
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
