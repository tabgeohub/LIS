import { useFlightPlanFormSelectOptions } from "hooks/flightPlan/useFlightPlanFormSelectOptions";
/* eslint-disable react-hooks/exhaustive-deps */
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { usePlanDuplicateState } from "../../../helpers/usePlanDuplicateState";
import { useEffect } from "react";
import Vluchtnummer from "./Vluchtnummer";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { defaultFlightPlanFieldLabels } from "hooks/zustand/shared/flightPlanFormFields";

export default function Form() {
  const { pilootOptions, waarnemerOptions, typeLuchtvaartuigOptions } =
    useFlightPlanFormSelectOptions();
  const store = usePlanDuplicateState();
  const fields = pickFlightPlanFormFields(store);

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
    aanmaaldatum,
  } = store;

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
    <FlightPlanStandardFields
      fields={fields}
      labels={defaultFlightPlanFieldLabels}
      pilootOptions={pilootOptions}
      waarnemerOptions={waarnemerOptions}
      typeLuchtvaartuigOptions={typeLuchtvaartuigOptions}
      header={
        <>
          <Vluchtnummer />
          <InputComp
            label="Aanmaker"
            value={aanmaker}
            setValue={setAanmaker}
            required
          />
          <InputComp
            type="date"
            label="Aanmaaldatum"
            value={aanmaaldatum}
            setValue={setAanmaaldatum}
            required
          />
        </>
      }
    />
  );
}
