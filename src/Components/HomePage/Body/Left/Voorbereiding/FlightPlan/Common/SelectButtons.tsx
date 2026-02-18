import { useContent } from "hooks/useContent";
import { useFlightPlanState } from "../helpers/flightPlanStates";
import { usePointsStore } from "hooks/features/usePointsStore";

export default function SelectButtons({ herhalen }: { herhalen: boolean }) {
  const { setSelectedPoints, setSelectedPoints2 } = useFlightPlanState();
  const { points } = usePointsStore();

  function handleSelectAll() {
    if (herhalen === false) {
      const notHerhalenPoints = points.filter((point) => point.herhalen === 0);

      setSelectedPoints2(notHerhalenPoints.flatMap((point) => point.id));
    } else {
      const herhalenPoints = points.filter((point) => point.herhalen === 1);

      setSelectedPoints(herhalenPoints.flatMap((point) => point.id));
    }
  }

  function handleSelectNone() {
    setSelectedPoints([]);
    setSelectedPoints2([]);
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
