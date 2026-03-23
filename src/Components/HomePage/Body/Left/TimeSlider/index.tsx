import Step1 from "../Nabewerking/VluchtenZoeken/Steps/Step1";
import Step2 from "../Nabewerking/VluchtenZoeken/Steps/Step2";
import PeriodFilter from "../Common/PeriodFilter";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";

export default function TimeSlider() {
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
