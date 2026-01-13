/* eslint-disable react-hooks/exhaustive-deps */
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { usePlanDuplicateState } from "../../../helpers/usePlanDuplicateState";

import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import { useEffect } from "react";
import Vluchtnummer from "./Vluchtnummer";
import useGetPiloot from "hooks/consts/useGetPiloot";
import useGetWaarnemers from "hooks/consts/useGetWaarnemers";
import useGetLuchtvaartuig from "hooks/consts/useGetLuchtvaartuig";

export default function Form() {
  const pilootOptions = useGetPiloot();
  const waarnemerOptions = useGetWaarnemers();
  const typeLuchtvaartuigOptions = useGetLuchtvaartuig();

  const {
    duplicatedFlightPlan,
    setAanmaker,
    setAanmaaldatum,
    setOmschrijving,
    setWaarnemer,
    setPiloot,
    setDatum,
    setGeplandeVliegduur,
    setTypeLuchtvaartuig,
    setAantalPassagiers,
    setDoelEnHoofdthema,
    setAanvullendeInfo,
    setBasemap,
    setLayers,
    aanmaker,
    omschrijving,
    waarnemer,
    piloot,
    datum,
    geplandeVliegduur,
    typeLuchtvaartuig,
    aantalPassagiers,
    doelEnHoofdthema,
    aanvullendeInfo,
  } = usePlanDuplicateState();

  useEffect(() => {
    if (!duplicatedFlightPlan) return;

    setAanmaker(String(duplicatedFlightPlan.user_id));
    setAanmaaldatum(duplicatedFlightPlan.datum);
    setOmschrijving(duplicatedFlightPlan.omschrijving);
    setWaarnemer(duplicatedFlightPlan.waarnemer);
    setPiloot(duplicatedFlightPlan.piloot);
    setGeplandeVliegduur(duplicatedFlightPlan.geplandeVliegduur);
    setTypeLuchtvaartuig(duplicatedFlightPlan.typeLuchtvaartuig);
    setAantalPassagiers(duplicatedFlightPlan.passagiers);
    setDoelEnHoofdthema(duplicatedFlightPlan.hoofdthema);
    setAanvullendeInfo(duplicatedFlightPlan.aanvullende);
    setBasemap(duplicatedFlightPlan.basemap);
    setLayers(duplicatedFlightPlan.layers);
  }, [duplicatedFlightPlan]);

  if (!duplicatedFlightPlan) return null;

  return (
    <>
      <Vluchtnummer />

      <InputComp
        label="Aanmaker"
        value={aanmaker}
        setValue={setAanmaker}
        required={true}
      />

      <InputComp
        type="date"
        label="Aanmaaldatum"
        value={datum}
        setValue={setDatum}
        required={true}
      />

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

      <InputComp
        label="Inspectiedatum"
        value={datum}
        setValue={setDatum}
        required={true}
        type="date"
      />

      <InputComp
        label="Geplande vliegduur"
        value={geplandeVliegduur}
        setValue={setGeplandeVliegduur}
      />

      <SelectComp
        label="Type luchtvaartuig"
        value={typeLuchtvaartuig}
        setValue={setTypeLuchtvaartuig}
        options={typeLuchtvaartuigOptions}
      />

      <InputCompNum
        label="Aantal passagiers"
        type="number"
        value={aantalPassagiers}
        setValue={setAantalPassagiers}
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
    </>
  );
}
