import InputComp from "Components/Common/FormComponents/InputComp";
import Vluchtnummer from "./Vluchtnummer";

export function DuplicateFlightPlanFormHeader(props: {
  aanmaker: string;
  setAanmaker: (v: string) => void;
  aanmaaldatum: string;
  setAanmaaldatum: (v: string) => void;
}) {
  return (
    <>
      <Vluchtnummer />
      <InputComp
        label="Aanmaker"
        value={props.aanmaker}
        setValue={props.setAanmaker}
        required
      />
      <InputComp
        type="date"
        label="Aanmaaldatum"
        value={props.aanmaaldatum}
        setValue={props.setAanmaaldatum}
        required
      />
    </>
  );
}
