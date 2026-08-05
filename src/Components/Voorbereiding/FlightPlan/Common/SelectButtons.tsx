import { useFlightPlanState } from "Components/Voorbereiding/FlightPlan/useFlightPlanState";
import WizardHerhalenSelectButtons from "Components/Common/WizardHerhalenSelectButtons";
import { useHerhalenSelectionHandlers } from "Components/HomePage/hooks/points/useHerhalenSelectionHandlers";

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
