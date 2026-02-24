import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";

export default function SelectButtons({
  herhalen,
  selectedGeometries,
  setSelectedGeometries,
  filteredGeometries,
}: {
  herhalen: boolean;
  selectedGeometries?: number[];
  setSelectedGeometries?: (value: number[]) => void;
  filteredGeometries?: any[];
}) {
  const { points } = usePointsStore();
  const { geometries } = useGeometriesStore();

  const { setSelectedPoints, setSelectedPoints2 } = useAddPointStates();

  function handleSelectAll() {
    if (herhalen === false) {
      const notHerhalenPoints = points.filter((point) => point.herhalen === 0);
      // filteredGeometries is already filtered by herhalen in Step3, so use it directly
      const geometriesToSelect = filteredGeometries || geometries.filter((geometry) => {
        const herhalenValue =
          typeof geometry.herhalen === "number"
            ? geometry.herhalen === 0
            : typeof geometry.herhalen === "string"
              ? geometry.herhalen === "0"
              : geometry.herhalen === false;
        return herhalenValue;
      });

      setSelectedPoints2(notHerhalenPoints.flatMap((point) => point.id));
      if (setSelectedGeometries) {
        setSelectedGeometries(geometriesToSelect.flatMap((geometry) => geometry.id));
      }
    } else {
      const herhalenPoints = points.filter((point) => point.herhalen === 1);
      // filteredGeometries is already filtered by herhalen in Step2, so use it directly
      const geometriesToSelect = filteredGeometries || geometries.filter((geometry) => {
        const herhalenValue =
          typeof geometry.herhalen === "number"
            ? geometry.herhalen === 1
            : typeof geometry.herhalen === "string"
              ? geometry.herhalen === "1"
              : geometry.herhalen === true;
        return herhalenValue;
      });

      setSelectedPoints(herhalenPoints.flatMap((point) => point.id));
      if (setSelectedGeometries) {
        setSelectedGeometries(geometriesToSelect.flatMap((geometry) => geometry.id));
      }
    }
  }

  function handleSelectNone() {
    setSelectedPoints([]);
    setSelectedPoints2([]);
    if (setSelectedGeometries) {
      setSelectedGeometries([]);
    }
  }

  return (
    <div className="text-[13px] flex text-blue-500 items-center gap-x-2 mt-2 font-medium">
      <button onClick={handleSelectAll}>Selecteer alle</button>

      <div className="h-[16px] w-[1px] bg-blue-300" />

      <button onClick={handleSelectNone}>Selecteer geen</button>
    </div>
  );
}
