import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useContent } from "hooks/useContent";
import { useGetFlightTimesDistance } from "hooks/useGetFlightTimesDistance";
import { usePopulateFlightPlanFormEffect } from "hooks/flightPlan/usePopulateFlightPlanFormEffect";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { useFlightPlanFormSelectOptions } from "hooks/flightPlan/useFlightPlanFormSelectOptions";
import { nabewerkingVluchtenZoekenFieldLabels } from "hooks/flightPlan/flightPlanFormLabels";

export default function FormElements() {
  const { pilootOptions, typeLuchtvaartuigOptions } =
    useFlightPlanFormSelectOptions();
  const store = useFinishedPlansState();
  const fields = pickFlightPlanFormFields(store);
  const content = useContent();

  usePopulateFlightPlanFormEffect(store.selectedPlan, fields);

  const { beginTime, endTime, durationSeconds } =
    useGetFlightTimesDistance(store.selectedPlan);

  const durationLabel = `${String(durationSeconds! / 60).padStart(2, "0")}:${String(
    durationSeconds! % 60
  ).padStart(2, "0")}`;

  const labels = content.nabewerking.vluchtenZoeken.step2.labels;

  return (
    <>
      <FlightPlanStandardFields
        fields={fields}
        labels={nabewerkingVluchtenZoekenFieldLabels(content)}
        pilootOptions={pilootOptions}
        typeLuchtvaartuigOptions={typeLuchtvaartuigOptions}
        waarnemerDisabled
        datumDisabled
        geplandeVliegduurDisabled
        omschrijvingAsTextArea
      />

      <InputComp
        label={labels.begintijdEnDatum}
        value={String(beginTime)}
        setValue={() => {}}
        disabled
      />

      <InputComp
        label={labels.eindtijdEnDatum}
        value={String(endTime)}
        setValue={() => {}}
        disabled
      />

      <InputComp
        label={labels.werkelijkeVliegduur}
        value={durationLabel}
        setValue={() => {}}
        disabled
      />

      <InputComp
        label={labels.status}
        value={store.selectedPlan?.status!}
        setValue={() => {}}
        disabled
      />
    </>
  );
}
