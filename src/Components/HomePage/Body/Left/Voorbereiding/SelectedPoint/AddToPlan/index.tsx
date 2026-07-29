import { useState } from "react";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { usePointsStore } from "hooks/features/usePointsStore";
import useDrawYellowMarkers from "Components/HomePage/hooks/hover-click-handlers/useDrawYellowMarkers";
import { useAddToPlanSketch } from "./useAddToPlanSketch";
import { AddToPlanHeader } from "./AddToPlanHeader";
import { AddToPlanSteps } from "./AddToPlanSteps";

export default function AddToPlan() {
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const [answer, setAnswer] = useState("radio2");
  const [step, setStep] = useState(1);
  const { polygonPoints } = usePointsStore();

  useDrawYellowMarkers({
    selectedPointIds: polygonPoints?.map((p) => p.id) || [],
    points: polygonPoints || [],
  });
  useAddToPlanSketch(step);

  return (
    <div className="mt-2 p-1">
      <AddToPlanHeader
        onClose={() => {
          setSelectedTab("none");
          setSelectedBottomTab("Kaartlagenlijst");
        }}
      />
      <AddToPlanSteps
        step={step}
        answer={answer}
        setAnswer={setAnswer}
        setStep={setStep}
      />
    </div>
  );
}
