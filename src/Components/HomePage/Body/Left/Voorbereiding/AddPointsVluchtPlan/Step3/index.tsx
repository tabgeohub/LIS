import Buttons from "./Buttons";
import AddPointsVluchtPlanStepContent from "../Common/AddPointsVluchtPlanStepContent";
import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";

export default function Step3() {
  const { selectedPoints2, setSelectedPoints2 } = useAddPointStates();

  return (
    <AddPointsVluchtPlanStepContent
      herhalen={false}
      selectedPoints={selectedPoints2}
      setSelectedPoints={setSelectedPoints2}
      buttons={<Buttons />}
    />
  );
}
