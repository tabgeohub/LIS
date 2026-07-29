import { useFlightPlanState } from "Components/HomePage/hooks/zustand/voorbereiding/useFlightPlanState";
import WizardHerhalenSelectButtons from "Components/HomePage/Body/Left/Common/WizardHerhalenSelectButtons";
import { useHerhalenSelectionHandlers } from "hooks/points/useHerhalenSelectionHandlers";

export default function SelectButtons({ herhalen }: { herhalen: boolean }) {
  const {
    setSelectedPoints,
    setSelectedPoints2,
    setSelectedGeometries,
    setSelectedGeometries2,
  } = useFlightPlanState();

  const { handleSelectAll, handleSelectNone } = useHerhalenSelectionHandlers({
    herhalen,
    setters: {
      setSelectedPoints,
      setSelectedPoints2,
      setSelectedGeometries,
      setSelectedGeometries2,
    },
  });

  return (
    <WizardHerhalenSelectButtons
      onSelectAll={handleSelectAll}
      onSelectNone={handleSelectNone}
    />
  );
}
