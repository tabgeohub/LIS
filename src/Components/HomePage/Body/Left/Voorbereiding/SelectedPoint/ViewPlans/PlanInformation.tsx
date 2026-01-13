import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import dayjs from "dayjs";
import { FlightPlanType } from "Types";
import ScrollButtonsLayout from "../../../Common/ScrollButtonsLayout";
import Images from "./Images";

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
    <ScrollButtonsLayout
      buttons={
        <>
          <button
            onClick={() => {
              setStep(1);
              setSelectedPlan(null);
            }}
            className="gray-button"
          >
            Vorige
          </button>
        </>
      }
    >
      <div className="space-y-3 p-3 pt-10">
        <InputComp
          disabled={true}
          setValue={() => {}}
          value={selectedPlan.vluchtnummer}
          label="Vluchtnummer"
        />

        <InputComp
          disabled={true}
          setValue={() => {}}
          value={dayjs(selectedPlan.datum).format("DD MMM YYYY")}
          label="Datum: "
        />

        <InputComp
          disabled={true}
          setValue={() => {}}
          value={selectedPlan.waarnemer}
          label="Waarnemer"
        />

        <InputComp
          disabled={true}
          setValue={() => {}}
          value={""}
          label="E-mailadres"
        />

        <InputComp
          disabled={true}
          setValue={() => {}}
          value={selectedPlan.aanvullende}
          label="Aanvullende info:"
        />

        <InputComp
          disabled={true}
          setValue={() => {}}
          value={String(selectedPlan.spoed)}
          label="Spoedrapport"
        />

        <Images selectedPlan={selectedPlan} />
      </div>
    </ScrollButtonsLayout>
  );
}
