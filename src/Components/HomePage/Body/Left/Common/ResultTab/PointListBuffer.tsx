import { useState } from "react";
import { PointListBufferForm } from "./PointListBufferForm";
import { usePointListBufferActions } from "./usePointListBufferActions";

export default function PointListBuffer({
  setFase,
}: {
  setFase: (value: string) => void;
}) {
  const [distance, setDistance] = useState(0);
  const [unit, setUnit] = useState<"kilometers" | "meters">("kilometers");
  const [saveToSketch, setSaveToSketch] = useState(false);
  const actions = usePointListBufferActions({ distance, unit, setFase });

  return (
    <PointListBufferForm
      distance={distance}
      setDistance={setDistance}
      unit={unit}
      setUnit={setUnit}
      saveToSketch={saveToSketch}
      setSaveToSketch={setSaveToSketch}
      onClear={actions.onClear}
      onCancel={actions.onCancel}
      onBuffer={actions.onBuffer}
    />
  );
}
