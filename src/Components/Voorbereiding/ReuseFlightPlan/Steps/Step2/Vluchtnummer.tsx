import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { vluchtnummerRegex } from "@constants/vluchtnummerRegex";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useVluchtnummerExists } from "api-hooks/flightPlans";

export default function Vluchtnummer() {
  const { vluchtnummer, setVluchtnummer } = useReuseFlightPlan();

  const { data: nbrVluchtNummer } = useVluchtnummerExists(vluchtnummer);

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
            Vluchtnummer moet bestaan uit letters en cijfers
          </p>
        )}

        {Number(nbrVluchtNummer) > 0 && vluchtnummer !== "" && (
          <p className="text-red-500  text-xs">Vluchtnummer al in gebruik</p>
        )}
      </div>
    </>
  );
}
