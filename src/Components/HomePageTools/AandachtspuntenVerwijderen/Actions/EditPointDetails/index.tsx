/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import { useDeletePointState } from "Components/HomePageTools/AandachtspuntenVerwijderen/state/useDeletePointState";
import { EditPointDetailsHeader } from "./EditPointDetailsHeader";
import { syncSelectedPointToDeleteState } from "./syncSelectedPointToDeleteState";

export default function EditPointDetails() {
  const state = useDeletePointState();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (state.selectedPoint) {
      syncSelectedPointToDeleteState(state.selectedPoint, state);
    }
  }, [state.selectedPoint]);

  return (
    <div className="p-1">
      <div className="mt-2 relative">
        {step === 1 && <Step1 setStep={setStep} />}
        {step === 2 && (
          <>
            <EditPointDetailsHeader title="Aandachtspunt" />
            <Step2 setStep={setStep} />
          </>
        )}
      </div>
    </div>
  );
}
