import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import PeriodFilter from "Components/HomePage/Body/Left/Common/PeriodFilter";
import { useFinishedPlansState } from "Components/Nabewerking/VluchtenZoeken/useFinishedPlansState";

export default function VluchtenZoeken() {
  const { openFilter, step } = useFinishedPlansState();

  return (
    <div className="h-full">
      {!openFilter && (
        <>
          {step === 1 && <Step1 />}

          {step === 2 && <Step2 />}
        </>
      )}

      {openFilter && <PeriodFilter />}
    </div>
  );
}
