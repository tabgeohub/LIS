import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useContent } from "hooks/useContent";
import { useGetFlightTimesDistance } from "hooks/useGetFlightTimesDistance";
import { usePopulateFlightPlanFormEffect } from "hooks/flightPlan/usePopulateFlightPlanFormEffect";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";

export default function FormElements() {
  const pilootOptions = useConstSelectOptions("piloten");
  const typeLuchtvaartuigOptions = useConstSelectOptions("luchtvaartuig");
  const store = useFinishedPlansState();
  const fields = pickFlightPlanFormFields(store);
  const content = useContent();

  usePopulateFlightPlanFormEffect(store.selectedPlan, fields);

  const { beginTime, endTime, durationSeconds } =
    useGetFlightTimesDistance(store.selectedPlan);

  const durationLabel = `${String(durationSeconds! / 60).padStart(2, "0")}:${String(
    durationSeconds! % 60
  ).padStart(2, "0")}`;

  return (
    <>
      <FlightPlanStandardFields
        fields={fields}
        labels={{
          omschrijving:
            content.nabewerking.vluchtenZoeken.step2.labels.omschrijving,
          waarnemer: content.nabewerking.vluchtenZoeken.step2.labels.waarnemer,
          piloot: content.nabewerking.vluchtenZoeken.step2.labels.piloot,
          datum: content.nabewerking.vluchtenZoeken.step2.labels.inspectiedatum,
          geplandeVliegduur:
            content.nabewerking.vluchtenZoeken.step2.labels.geplandeVliegduur,
          typeLuchtvaartuig:
            content.nabewerking.vluchtenZoeken.step2.labels.luchtvaartuig,
          aantalPassagiers:
            content.nabewerking.vluchtenZoeken.step2.labels.aantalPassagiers,
          doelEnHoofdthema:
            content.nabewerking.vluchtenZoeken.step2.labels.doelEnHoofdthema,
          aanvullendeInfo:
            content.nabewerking.vluchtenZoeken.step2.labels.aanvullendeInfo,
        }}
        pilootOptions={pilootOptions}
        typeLuchtvaartuigOptions={typeLuchtvaartuigOptions}
        waarnemerDisabled
        datumDisabled
        geplandeVliegduurDisabled
        omschrijvingAsTextArea
      />

      <InputComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.begintijdEnDatum}
        value={String(beginTime)}
        setValue={() => {}}
        disabled
      />

      <InputComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.eindtijdEnDatum}
        value={String(endTime)}
        setValue={() => {}}
        disabled
      />

      <InputComp
        label={
          content.nabewerking.vluchtenZoeken.step2.labels.werkelijkeVliegduur
        }
        value={durationLabel}
        setValue={() => {}}
        disabled
      />

      <InputComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.status}
        value={store.selectedPlan?.status!}
        setValue={() => {}}
        disabled
      />
    </>
  );
}
