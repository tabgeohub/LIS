import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import Vluchtnummer from "./Vluchtnummer";
import Buttons from "./Buttons";
import { useContent } from "hooks/useContent";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { useFlightPlanFormSelectOptions } from "hooks/flightPlan/useFlightPlanFormSelectOptions";
import { voorbereidingVluchtAanmakenFieldLabels } from "hooks/flightPlan/flightPlanFormLabels";

export default function Step1() {
  const { pilootOptions, waarnemerOptions, typeLuchtvaartuigOptions } =
    useFlightPlanFormSelectOptions();
  const fields = pickFlightPlanFormFields(useFlightPlanState());
  const content = useContent();

  return (
    <div className="py-4 px-2 space-y-3 h-full overflow-y-auto thin-scrollbar">
      <FlightPlanStandardFields
        fields={fields}
        labels={voorbereidingVluchtAanmakenFieldLabels(content)}
        pilootOptions={pilootOptions}
        waarnemerOptions={waarnemerOptions}
        typeLuchtvaartuigOptions={typeLuchtvaartuigOptions}
        header={<Vluchtnummer />}
        footer={<Buttons />}
      />
    </div>
  );
}
