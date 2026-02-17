import { useReadData } from "utils/useReadData";
import { useFlightPlanState } from "../../helpers/flightPlanStates";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { vluchtnummerRegex } from "@constants/vluchtnummerRegex";
import { useContent } from "hooks/useContent";

export default function Vluchtnummer() {
  const { vluchtnummer, setVluchtnummer } = useFlightPlanState();

  const content = useContent();

  const { data: nbrVluchtNummer } = useReadData(
    `/flightPlans/vluchtnummer/${vluchtnummer}`
  );

  return (
    <>
      <InputComp
        label={content.voorbereiding.vluchtAanmaken.step1.vluchtnummer}
        value={vluchtnummer}
        setValue={setVluchtnummer}
        required={true}
      />

      <div className="flex flex-col items-end">
        {!vluchtnummerRegex.test(vluchtnummer) && (
          <p className="text-red-500  text-xs">
            {content.voorbereiding.vluchtAanmaken.step1.vluchtWarning1}
          </p>
        )}

        {Number(nbrVluchtNummer) > 0 && vluchtnummer !== "" && (
          <p className="text-red-500  text-xs">
            {content.voorbereiding.vluchtAanmaken.step1.vluchtWarning2}
          </p>
        )}
      </div>
    </>
  );
}
