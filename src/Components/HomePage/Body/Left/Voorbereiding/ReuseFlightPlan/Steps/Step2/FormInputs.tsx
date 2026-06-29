/* eslint-disable react-hooks/exhaustive-deps */
import { populateFormFromPlan } from "hooks/flightPlan/populateFormFromPlan";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import Vluchtnummer from "./Vluchtnummer";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import { useEffect } from "react";
import useGetPiloot from "hooks/consts/useGetPiloot";
import useGetWaarnemers from "hooks/consts/useGetWaarnemers";
import useGetLuchtvaartuig from "hooks/consts/useGetLuchtvaartuig";

export default function FormInputs() {
  const pilootOptions = useGetPiloot();
  const waarnemerOptions = useGetWaarnemers();
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
  } = useReuseFlightPlan();

  useEffect(() => {
    if (!selectedPlan) return;
    populateFormFromPlan(selectedPlan, {
      setOmschrijving,
      setWaarnemer,
      setPiloot,
      setDatum,
      setGeplandeVliegduur,
      setTypeLuchtvaartuig,
      setAantalPassagiers,
      setDoelEnHoofdthema,
      setAanvullendeInfo,
    });
  }, [selectedPlan]);

  return (
    <div className="py-4 px-2 space-y-3">
      <InputComp
        label="Inspectiedatum"
        value={datum}
        setValue={setDatum}
        required={true}
        type="date"
      />

      <Vluchtnummer />

      <InputComp
        label="Omschrijving"
        value={omschrijving}
        setValue={setOmschrijving}
      />

      <SelectComp
        label="Waarnemer"
        value={waarnemer}
        setValue={setWaarnemer}
        required={true}
        options={waarnemerOptions}
      />

      <SelectComp
        label="Piloot"
        value={piloot}
        setValue={setPiloot}
        options={pilootOptions}
      />

      <SelectComp
        label="Type luchtvaartuig"
        value={typeLuchtvaartuig}
        setValue={setTypeLuchtvaartuig}
        options={typeLuchtvaartuigOptions}
      />

      <InputCompNum
        label="Aantal passagiers"
        value={aantalPassagiers!}
        setValue={setAantalPassagiers}
        type="number"
      />

      <InputComp
        label="Doel en hoofdthema"
        value={doelEnHoofdthema}
        setValue={setDoelEnHoofdthema}
      />

      <InputComp
        label="Aanvullende info"
        value={aanvullendeInfo}
        setValue={setAanvullendeInfo}
      />

      <InputComp
        label="Geplande vliegduur"
        value={geplandeVliegduur}
        setValue={setGeplandeVliegduur}
      />
    </div>
  );
}
