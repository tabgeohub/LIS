import { useVluchtnummerExists } from "hooks/queries/useFlightPlanQueries";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { usePlanDuplicateState } from "../../../helpers/usePlanDuplicateState";
import { vluchtnummerRegex } from "@constants/vluchtnummerRegex";
import { useContent } from "hooks/useContent";

export default function Vluchtnummer() {
  const { vluchtnummer, setVluchtnummer } = usePlanDuplicateState();

  const { data: nbrVluchtNummer } = useVluchtnummerExists(vluchtnummer);

  const content = useContent();

  return (
    <>
      <InputComp
        label="Vluchtnummer"
        value={vluchtnummer}
        setValue={setVluchtnummer}
        required={true}
      />

      <div className="flex flex-col items-end">
        {!vluchtnummerRegex.test(vluchtnummer) && (
          <p className="text-red-500  text-xs">
            {content.voorbereiding.vluchtplanInformatie.duplicateStep.warning}
          </p>
        )}

        {Number(nbrVluchtNummer) > 0 && vluchtnummer !== "" && (
          <p className="text-red-500  text-xs">
            {" "}
            {content.voorbereiding.vluchtplanInformatie.duplicateStep.warning2}
          </p>
        )}
      </div>
    </>
  );
}
