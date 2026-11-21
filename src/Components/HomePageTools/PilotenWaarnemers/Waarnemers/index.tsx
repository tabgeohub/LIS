import { useState } from "react";
import { useWaarnemersList } from "api-hooks/waarnemers";
import { WaarnemerType } from "Types";
import type { PilotenWaarnemersStep } from "..";
import List from "./List";
import AddWaarnemer from "./AddWaarnemer";
import EditWaarnemer from "./EditWaarnemer";

export type WaarnemersStep = "list" | "add" | "edit";

export default function WaarnemersManager({
  setStep,
}: {
  setStep: (value: PilotenWaarnemersStep) => void;
}) {
  const [waarnemersStep, setWaarnemersStep] =
    useState<WaarnemersStep>("list");
  const [selected, setSelected] = useState<WaarnemerType | null>(null);
  const { data: waarnemers, refetch } = useWaarnemersList();

  return (
    <div className="h-full">
      {waarnemersStep === "list" && waarnemers && (
        <List
          waarnemers={waarnemers}
          selected={selected}
          setSelected={setSelected}
          setWaarnemersStep={setWaarnemersStep}
          setStep={setStep}
          refetch={refetch}
        />
      )}

      {waarnemersStep === "add" && (
        <AddWaarnemer
          setWaarnemersStep={setWaarnemersStep}
          refetch={refetch}
        />
      )}

      {waarnemersStep === "edit" && selected && (
        <EditWaarnemer
          selected={selected}
          setSelected={setSelected}
          setWaarnemersStep={setWaarnemersStep}
          refetch={refetch}
        />
      )}
    </div>
  );
}
