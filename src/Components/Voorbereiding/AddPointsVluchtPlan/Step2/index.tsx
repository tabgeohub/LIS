import Buttons from "./Buttons";
import AddPointsVluchtPlanStepContent from "Components/Voorbereiding/AddPointsVluchtPlan/Common/AddPointsVluchtPlanStepContent";
import { useAddPointStates } from "hooks/zustand/useAddPointStates";

export default function Step2() {
  const { selectedPoints, setSelectedPoints } = useAddPointStates();

  return (
    <AddPointsVluchtPlanStepContent
      herhalen={true}
      selectedPoints={selectedPoints}
      setSelectedPoints={setSelectedPoints}
      buttons={<Buttons />}
    />
  );
}
