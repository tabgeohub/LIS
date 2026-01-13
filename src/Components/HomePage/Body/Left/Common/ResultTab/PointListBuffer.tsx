import { useState } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Circle from "@arcgis/core/geometry/Circle";
import Point from "@arcgis/core/geometry/Point";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import useLogAction from "hooks/useLogAction";

export default function PointListBuffer({
  setFase,
}: {
  setFase: (value: string) => void;
}) {
  const logAction = useLogAction();

  const { mapView, graphicsLayer } = useMapViewState();
  const { pointsTable } = useOpenTable();

  const [distance, setDistance] = useState<number>(0);
  const [unit, setUnit] = useState<"kilometers" | "meters">("kilometers");
  const [saveToSketch, setSaveToSketch] = useState(false);

  const handleBuffer = async () => {
    if (!graphicsLayer) return;

    graphicsLayer.removeAll();

    pointsTable.forEach((point) => {
      const center = new Point({
        latitude: point.latitude,
        longitude: point.longitude,
        spatialReference: mapView?.spatialReference,
      });

      const circle = new Circle({
        center,
        radius: distance,
        radiusUnit: unit,
        numberOfPoints: 64,
        spatialReference: mapView?.spatialReference,
      });

      const symbol = new SimpleFillSymbol({
        color: [0, 0, 255, 0.2],
        outline: {
          color: [0, 0, 255],
          width: 2,
        },
      });

      const graphic = new Graphic({
        geometry: circle,
        symbol,
        attributes: { id: point.id },
      });

      graphicsLayer.add(graphic);

      setFase("listPoints");
    });

    logAction({
      message: `User clicked 'Doorgaan' to buffer points`,
      step: "ResultTab - PointListBuffer",
    });
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
