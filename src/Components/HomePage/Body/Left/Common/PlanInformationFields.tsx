import dayjs from "dayjs";
import type { FlightPlanType } from "Types";
import InputComp from "./FormComponents/InputComp";

export default function PlanInformationFields({
  plan,
  urgentValue,
}: {
  plan: FlightPlanType;
  urgentValue: string;
}) {
  return (
    <>
      <InputComp disabled value={plan.vluchtnummer} label="Vluchtnummer" />
      <InputComp
        disabled
        value={dayjs(plan.datum).format("DD MMM YYYY")}
        label="Datum: "
      />
      <InputComp disabled value={plan.waarnemer} label="Waarnemer" />
      <InputComp disabled value="" label="E-mailadres" />
      <InputComp
        disabled
        value={plan.aanvullende}
        label="Aanvullende info:"
      />
      <InputComp disabled value={urgentValue} label="Spoedrapport" />
    </>
  );
}
