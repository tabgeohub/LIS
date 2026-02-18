import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";
import { usePointsStore } from "hooks/features/usePointsStore";

export default function SelectButtons({ herhalen }: { herhalen: boolean }) {
  const { points } = usePointsStore();

  const { setSelectedPoints, setSelectedPoints2 } = useAddPointStates();

  function handleSelectAll() {
    if (herhalen === false) {
      const herhalenPoints = points.filter((point) => point.herhalen === 0);

      setSelectedPoints2(herhalenPoints.flatMap((point) => point.id));
    } else {
      const herhalenPoints = points.filter((point) => point.herhalen === 1);

      setSelectedPoints(herhalenPoints.flatMap((point) => point.id));
    }
  }

  function handleSelectNone() {
    setSelectedPoints([]);
    setSelectedPoints2([]);
  }

  return (
    <div className="text-[13px] flex text-blue-500 items-center gap-x-2 mt-2 font-medium">
      <button onClick={handleSelectAll}>Selecteer alle</button>

      <div className="h-[16px] w-[1px] bg-blue-300" />

      <button onClick={handleSelectNone}>Selecteer geen</button>
    </div>
  );
}
