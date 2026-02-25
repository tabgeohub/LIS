import Buttons from "./Buttons";
import StepContent from "../Common/StepContent";
import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";

export default function Step3() {
  const {
    selectedPoints2,
    setSelectedPoints2,
    openFilter,
    setOpenFilter,
    filteredPoints,
    setFilteredPoints,
    selectedPlan,
  } = useAddPointStates();

  return (
    <StepContent
      herhalen={false}
      selectedPoints={selectedPoints2}
      setSelectedPoints={setSelectedPoints2}
      filteredPoints={filteredPoints}
      setFilteredPoints={setFilteredPoints}
      openFilter={openFilter}
      setOpenFilter={setOpenFilter}
      selectedPlan={selectedPlan}
      buttons={<Buttons />}
    />
  );
}
