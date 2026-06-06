import { useContent } from "hooks/useContent";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";

export default function SelectButtons({ herhalen }: { herhalen: boolean }) {
  const { 
    setSelectedPoints, 
    setSelectedPoints2,
    setSelectedGeometries,
    setSelectedGeometries2 
  } = useFlightPlanState();
  const { points } = usePointsStore();
  const { geometries } = useGeometriesStore();

  function handleSelectAll() {
    if (herhalen === false) {
      const notHerhalenPoints = points.filter((point) => point.herhalen === 0);
      const notHerhalenGeometries = geometries.filter((geometry) => {
        const herhalenValue =
          typeof geometry.herhalen === "number"
            ? geometry.herhalen === 0
            : typeof geometry.herhalen === "string"
              ? geometry.herhalen === "0"
              : geometry.herhalen === false;
        return herhalenValue;
      });

      setSelectedPoints2(notHerhalenPoints.flatMap((point) => point.id));
      setSelectedGeometries2(notHerhalenGeometries.flatMap((geometry) => geometry.id));
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
      setSelectedGeometries(herhalenGeometries.flatMap((geometry) => geometry.id));
    }
  }

  function handleSelectNone() {
    setSelectedPoints([]);
    setSelectedPoints2([]);
    setSelectedGeometries([]);
    setSelectedGeometries2([]);
  }

  const content = useContent();

  return (
    <div className="text-[13px] flex text-blue-500 items-center gap-x-2 mt-2 font-medium">
      <button onClick={handleSelectAll}>{content.common.selecteerAlle}</button>

      <div className="h-[16px] w-[1px] bg-blue-300" />

      <button onClick={handleSelectNone}>{content.common.selecteerGeen}</button>
    </div>
  );
}
