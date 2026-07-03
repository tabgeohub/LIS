import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { usePopulateFlightPlanFormEffect } from "hooks/flightPlan/usePopulateFlightPlanFormEffect";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import Vluchtnummer from "./Vluchtnummer";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";

export default function FormInputs() {
  const pilootOptions = useConstSelectOptions("piloten");
  const waarnemerOptions = useConstSelectOptions("waarnemers");
  const typeLuchtvaartuigOptions = useConstSelectOptions("luchtvaartuig");
  const store = useReuseFlightPlan();
  const fields = pickFlightPlanFormFields(store);

  usePopulateFlightPlanFormEffect(store.selectedPlan, fields);

  return (
    <FlightPlanStandardFields
      className="py-4 px-2 space-y-3"
      fields={fields}
      labels={{
        omschrijving: "Omschrijving",
        waarnemer: "Waarnemer",
        piloot: "Piloot",
        datum: "Inspectiedatum",
        geplandeVliegduur: "Geplande vliegduur",
        typeLuchtvaartuig: "Type luchtvaartuig",
        aantalPassagiers: "Aantal passagiers",
        doelEnHoofdthema: "Doel en hoofdthema",
        aanvullendeInfo: "Aanvullende info",
      }}
      pilootOptions={pilootOptions}
      waarnemerOptions={waarnemerOptions}
      typeLuchtvaartuigOptions={typeLuchtvaartuigOptions}
      header={<Vluchtnummer />}
    />
  );
}
