import { useState } from "react";
import { usePilotenList } from "api-hooks/piloten";
import { PilootType } from "Types";
import type { PilotenWaarnemersStep } from "..";
import List from "./List";
import AddPiloot from "./AddPiloot";
import EditPiloot from "./EditPiloot";

export type PilotenStep = "list" | "add" | "edit";

export default function PilotenManager({
  setStep,
}: {
  setStep: (value: PilotenWaarnemersStep) => void;
}) {
  const [pilotenStep, setPilotenStep] = useState<PilotenStep>("list");
  const [selected, setSelected] = useState<PilootType | null>(null);
  const { data: piloten, refetch } = usePilotenList();

  return (
    <div className="h-full">
      {pilotenStep === "list" && piloten && (
        <List
          piloten={piloten}
          selected={selected}
          setSelected={setSelected}
          setPilotenStep={setPilotenStep}
          setStep={setStep}
          refetch={refetch}
        />
      )}

      {pilotenStep === "add" && (
        <AddPiloot setPilotenStep={setPilotenStep} refetch={refetch} />
      )}

      {pilotenStep === "edit" && selected && (
        <EditPiloot
          selected={selected}
          setSelected={setSelected}
          setPilotenStep={setPilotenStep}
          refetch={refetch}
        />
      )}
    </div>
  );
}
