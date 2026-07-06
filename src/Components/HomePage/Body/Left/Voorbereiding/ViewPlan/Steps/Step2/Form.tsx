import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { defaultFlightPlanFieldLabels } from "hooks/zustand/shared/flightPlanFormFields";
import { useFlightPlanFormSelectOptions } from "hooks/flightPlan/useFlightPlanFormSelectOptions";

export default function Form({
  vluchtnummer,
  setVluchtnummer,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
}) {
  const { pilootOptions, waarnemerOptions } = useFlightPlanFormSelectOptions();
  const viewPlanState = useViewPlanState();
  const fields = pickFlightPlanFormFields(viewPlanState);
  const { user } = useAuth();
  const { datum } = viewPlanState;

  return (
    <FlightPlanStandardFields
      fields={fields}
      labels={defaultFlightPlanFieldLabels}
      pilootOptions={pilootOptions}
      waarnemerOptions={waarnemerOptions}
      typeLuchtvaartuigOptions={[]}
      geplandeVliegduurDisabled
      typeLuchtvaartuigDisabled
      header={
        <>
          <InputComp
            label="Vluchtnummer"
            value={vluchtnummer}
            setValue={setVluchtnummer}
            required
            disabled
          />
          <InputComp
            label="Aanmaker"
            value={user.user_name}
            setValue={() => {}}
            required
            disabled
          />
          <InputComp
            label="Aanmaaldatum"
            value={datum}
            setValue={() => {}}
            required
            disabled
          />
        </>
      }
    />
  );
}
