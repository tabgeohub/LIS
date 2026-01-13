/* eslint-disable react-hooks/exhaustive-deps */
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import useGetLuchtvaartuig from "hooks/consts/useGetLuchtvaartuig";
import useGetPiloot from "hooks/consts/useGetPiloot";
import { useContent } from "hooks/useContent";
import { useGetFlightTimesDistance } from "hooks/useGetFlightTimesDistance";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useEffect } from "react";

export default function FormElements() {
  const pilootOptions = useGetPiloot();
  const typeLuchtvaartuigOptions = useGetLuchtvaartuig();

  const {
    selectedPlan,
    omschrijving,
    setOmschrijving,
    waarnemer,
    setWaarnemer,
    piloot,
    setPiloot,
    datum,
    setDatum,
    geplandeVliegduur,
    setGeplandeVliegduur,
    typeLuchtvaartuig,
    setTypeLuchtvaartuig,
    aantalPassagiers,
    setAantalPassagiers,
    doelEnHoofdthema,
    setDoelEnHoofdthema,
    aanvullendeInfo,
    setAanvullendeInfo,
  } = useFinishedPlansState();

  useEffect(() => {
    if (!selectedPlan) return;

    setOmschrijving(selectedPlan?.omschrijving);
    setWaarnemer(selectedPlan?.waarnemer);
    setPiloot(selectedPlan?.piloot);
    setDatum(selectedPlan?.datum);
    setGeplandeVliegduur(selectedPlan?.vliegduur);
    setTypeLuchtvaartuig(selectedPlan?.luchtvaartuig);
    setAantalPassagiers(selectedPlan?.passagiers);
    setDoelEnHoofdthema(selectedPlan?.hoofdthema);
    setAanvullendeInfo(selectedPlan?.aanvullende);
  }, [selectedPlan]);

  const { beginTime, endTime, durationSeconds } =
    useGetFlightTimesDistance(selectedPlan);

  const content = useContent();

  return (
    <>
      <div className="grid grid-cols-6 gap-x-2 items-start">
        <TextAreaComp
          value={omschrijving}
          setValue={setOmschrijving}
          label={content.nabewerking.vluchtenZoeken.step2.labels.omschrijving}
        />
      </div>

      <SelectComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.piloot}
        value={piloot}
        setValue={setPiloot}
        options={pilootOptions}
      />

      <InputComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.waarnemer}
        value={waarnemer}
        setValue={setWaarnemer}
        required={true}
        disabled
      />

      <InputComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.inspectiedatum}
        value={datum}
        setValue={setDatum}
        required={true}
        type="date"
        disabled
      />

      <SelectComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.luchtvaartuig}
        value={typeLuchtvaartuig}
        setValue={setTypeLuchtvaartuig}
        options={typeLuchtvaartuigOptions}
      />

      <InputCompNum
        label={content.nabewerking.vluchtenZoeken.step2.labels.aantalPassagiers}
        value={Number(aantalPassagiers)}
        setValue={setAantalPassagiers}
        type="number"
      />

      <InputComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.doelEnHoofdthema}
        value={doelEnHoofdthema}
        setValue={setDoelEnHoofdthema}
      />

      <InputComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.aanvullendeInfo}
        value={aanvullendeInfo}
        setValue={setAanvullendeInfo}
      />

      <InputComp
        label={
          content.nabewerking.vluchtenZoeken.step2.labels.geplandeVliegduur
        }
        value={geplandeVliegduur}
        setValue={setGeplandeVliegduur}
        disabled
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
        value={`${String(durationSeconds! / 60).padStart(2, "0")}:${String(
          durationSeconds! % 60
        ).padStart(2, "0")}`}
        setValue={() => {}}
        disabled
      />

      <InputComp
        label={content.nabewerking.vluchtenZoeken.step2.labels.status}
        value={selectedPlan?.status!}
        setValue={() => {}}
        disabled
      />
    </>
  );
}
