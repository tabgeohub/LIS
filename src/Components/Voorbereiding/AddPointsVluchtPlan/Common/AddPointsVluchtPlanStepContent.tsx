import StepContent from "Components/Voorbereiding/AddPointsVluchtPlan/Common/StepContent";
import { useAddPointStates } from "hooks/zustand/useAddPointStates";

type AddPointsVluchtPlanStepContentProps = {
  herhalen: boolean;
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  buttons: React.ReactNode;
};

export default function AddPointsVluchtPlanStepContent({
  herhalen,
  selectedPoints,
  setSelectedPoints,
  buttons,
}: AddPointsVluchtPlanStepContentProps) {
  const {
    openFilter,
    setOpenFilter,
    filteredPoints,
    setFilteredPoints,
    selectedPlan,
  } = useAddPointStates();

  return (
    <StepContent
      herhalen={herhalen}
      selectedPoints={selectedPoints}
      setSelectedPoints={setSelectedPoints}
      filteredPoints={filteredPoints}
      setFilteredPoints={setFilteredPoints}
      openFilter={openFilter}
      setOpenFilter={setOpenFilter}
      selectedPlan={selectedPlan}
      buttons={buttons}
    />
  );
}
