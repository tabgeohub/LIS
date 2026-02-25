import Buttons from "./Buttons";
import StepContent from "../Common/StepContent";
import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";

export default function Step2() {
  const {
    selectedPoints,
    setSelectedPoints,
    openFilter,
    setOpenFilter,
    filteredPoints,
    setFilteredPoints,
    selectedPlan,
  } = useAddPointStates();

  return (
    <StepContent
      herhalen={true}
      selectedPoints={selectedPoints}
      setSelectedPoints={setSelectedPoints}
      filteredPoints={filteredPoints}
      setFilteredPoints={setFilteredPoints}
      openFilter={openFilter}
      setOpenFilter={setOpenFilter}
      selectedPlan={selectedPlan}
      buttons={<Buttons />}
    />
  );
}
