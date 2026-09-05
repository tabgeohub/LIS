import InputComp from "Components/Common/FormComponents/InputComp";
import { useAuth } from "hooks/zustand/ui";
import { useViewPlanState } from "Components/Voorbereiding/ViewPlan/useViewPlanState";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/Common/FlightPlanForm/FlightPlanStandardFields";
import { useFlightPlanStandardSelectProps } from "Components/Common/FlightPlanForm/useFlightPlanStandardSelectProps";

export default function Form({
  vluchtnummer,
  setVluchtnummer,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
}) {
  const selectProps = useFlightPlanStandardSelectProps({
    typeLuchtvaartuigOptions: [],
  });
  const viewPlanState = useViewPlanState();
  const fields = pickFlightPlanFormFields(viewPlanState);
  const { user } = useAuth();
  const { datum } = viewPlanState;

  return (
    <FlightPlanStandardFields
      fields={fields}
      {...selectProps}
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
