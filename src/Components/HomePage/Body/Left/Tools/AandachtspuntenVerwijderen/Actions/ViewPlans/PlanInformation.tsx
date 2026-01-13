import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import dayjs from "dayjs";
import { FlightPlanType } from "Types";

export default function PlanInformation({
  selectedPlan,
  setSelectedPlan,
  setStep,
}: {
  selectedPlan: FlightPlanType;
  setSelectedPlan: (value: FlightPlanType | null) => void;
  setStep: (value: number) => void;
}) {
  return (
    <div className="space-y-3 p-3">
      <InputComp
        disabled={true}
        value={selectedPlan.vluchtnummer}
        label="Vluchtnummer"
      />

      <InputComp
        disabled={true}
        value={dayjs(selectedPlan.datum).format("DD MMM YYYY")}
        label="Datum: "
      />

      <InputComp
        disabled={true}
        value={selectedPlan.waarnemer}
        label="Waarnemer"
      />

      <InputComp disabled={true} value={""} label="E-mailadres" />

      <InputComp
        disabled={true}
        value={selectedPlan.aanvullende}
        label="Aanvullende info:"
      />

      <InputComp
        disabled={true}
        value={selectedPlan.spoed ? "Ja" : "Nee"}
        label="Spoedrapport"
      />

      <div className="flex justify-end gap-x-1 text-[12px] !mt-6">
        <button
          onClick={() => {
            setStep(1);
            setSelectedPlan(null);
          }}
          className="gray-button"
        >
          Vorige
        </button>

        <button className="gray-button">Annuleren</button>
      </div>
    </div>
  );
}
