import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";

export default function SelectButtons({ herhalen }: { herhalen: boolean }) {
  const { points } = usePointsStore();
  const { geometries } = useGeometriesStore();

  const { setSelectedPoints, setSelectedPoints2 } = useAddPointStates();

  function handleSelectAll() {
    if (herhalen === false) {
      const herhalenPoints = points.filter((point) => point.herhalen === 0);
      const herhalenGeometries = geometries.filter((geometry) => {
        const herhalenValue =
          typeof geometry.herhalen === "number"
            ? geometry.herhalen === 0
            : typeof geometry.herhalen === "string"
              ? geometry.herhalen === "0"
              : geometry.herhalen === false;
        return herhalenValue;
      });

      setSelectedPoints2(herhalenPoints.flatMap((point) => point.id));
      // Note: Geometry selection will be added when geometries are integrated into AddPointsVluchtPlan
      // For now, geometries are filtered but not selected since useAddPointStates doesn't have geometry state yet
    } else {
      const herhalenPoints = points.filter((point) => point.herhalen === 1);
      const herhalenGeometries = geometries.filter((geometry) => {
        const herhalenValue =
          typeof geometry.herhalen === "number"
            ? geometry.herhalen === 1
            : typeof geometry.herhalen === "string"
              ? geometry.herhalen === "1"
              : geometry.herhalen === true;
        return herhalenValue;
      });

      setSelectedPoints(herhalenPoints.flatMap((point) => point.id));
      // Note: Geometry selection will be added when geometries are integrated into AddPointsVluchtPlan
      // For now, geometries are filtered but not selected since useAddPointStates doesn't have geometry state yet
    }
  }

  function handleSelectNone() {
    setSelectedPoints([]);
    setSelectedPoints2([]);
    // Note: Geometry deselection will be added when geometries are integrated into AddPointsVluchtPlan
  }

  return (
    <div className="text-[13px] flex text-blue-500 items-center gap-x-2 mt-2 font-medium">
      <button onClick={handleSelectAll}>Selecteer alle</button>

      <div className="h-[16px] w-[1px] bg-blue-300" />

      <button onClick={handleSelectNone}>Selecteer geen</button>
    </div>
  );
}
