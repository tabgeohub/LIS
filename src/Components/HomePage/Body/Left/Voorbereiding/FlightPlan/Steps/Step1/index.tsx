import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import Vluchtnummer from "./Vluchtnummer";
import Buttons from "./Buttons";
import { useContent } from "hooks/useContent";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";

export default function Step1() {
  const pilootOptions = useConstSelectOptions("piloten");
  const waarnemerOptions = useConstSelectOptions("waarnemers");
  const typeLuchtvaartuigOptions = useConstSelectOptions("luchtvaartuig");
  const fields = pickFlightPlanFormFields(useFlightPlanState());
  const content = useContent();

  return (
    <div className="py-4 px-2 space-y-3 h-full overflow-y-auto thin-scrollbar">
      <FlightPlanStandardFields
        fields={fields}
        labels={{
          omschrijving: content.voorbereiding.vluchtAanmaken.step1.omschrijving,
          waarnemer: content.voorbereiding.vluchtAanmaken.step1.waarnemer,
          piloot: content.voorbereiding.vluchtAanmaken.step1.piloot,
          datum: content.voorbereiding.vluchtAanmaken.step1.datum,
          geplandeVliegduur:
            content.voorbereiding.vluchtAanmaken.step1.geplandeVliegduur,
          typeLuchtvaartuig:
            content.voorbereiding.vluchtAanmaken.step1.typeLuchtvaartuig,
          aantalPassagiers:
            content.voorbereiding.vluchtAanmaken.step1.aantalPassagiers,
          doelEnHoofdthema:
            content.voorbereiding.vluchtAanmaken.step1.doelEnHoofdthema,
          aanvullendeInfo:
            content.voorbereiding.vluchtAanmaken.step1.aanvullendeInfo,
        }}
        pilootOptions={pilootOptions}
        waarnemerOptions={waarnemerOptions}
        typeLuchtvaartuigOptions={typeLuchtvaartuigOptions}
        header={<Vluchtnummer />}
        footer={<Buttons />}
      />
    </div>
  );
}
