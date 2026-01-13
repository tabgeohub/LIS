import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";

import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import useGetPiloot from "hooks/consts/useGetPiloot";
import useGetWaarnemers from "hooks/consts/useGetWaarnemers";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useViewPlanState } from "../../helpers/useViewPlanState";

export default function Form({
  vluchtnummer,
  setVluchtnummer,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
}) {
  const pilootOptions = useGetPiloot();
  const waarnemerOptions = useGetWaarnemers();

  const {
    omschrijving,
    setOmschrijving,
    waarnemer,
    setWaarnemer,
    piloot,
    setPiloot,
    datum,
    setDatum,
    geplandeVliegduur,
    setGeplandeVliegduur,
    typeLuchtvaartuig,
    aantalPassagiers,
    setAantalPassagiers,
    doelEnHoofdthema,
    setDoelEnHoofdthema,
    aanvullendeInfo,
    setAanvullendeInfo,
  } = useViewPlanState();

  const { user } = useAuth();

  return (
    <>
      <InputComp
        label="Vluchtnummer"
        value={vluchtnummer}
        setValue={setVluchtnummer}
        required={true}
        disabled={true}
      />

      <InputComp
        label="Aanmaker"
        value={user.user_name}
        setValue={() => {}}
        required={true}
        disabled={true}
      />

      <InputComp
        label="Aanmaaldatum"
        value={datum}
        setValue={setVluchtnummer}
        required={true}
        disabled={true}
      />

      <InputComp
        label="Omschrijving"
        value={omschrijving}
        setValue={setOmschrijving}
      />

      <SelectComp
        label="Waarnemer"
        value={waarnemer}
        setValue={setWaarnemer}
        required={true}
        options={waarnemerOptions}
      />

      <SelectComp
        label="Piloot"
        value={piloot}
        setValue={setPiloot}
        options={pilootOptions}
      />

      <InputComp
        label="Inspectiedatum"
        value={datum}
        setValue={setDatum}
        required={true}
        type="date"
      />

      <InputComp
        label="Geplande vliegduur"
        value={geplandeVliegduur}
        setValue={setGeplandeVliegduur}
        disabled
      />

      <InputComp
        label="Type luchtvaartuig"
        value={typeLuchtvaartuig}
        setValue={() => {}}
        disabled
      />

      <InputCompNum
        label="Aantal passagiers"
        type="number"
        value={aantalPassagiers}
        setValue={setAantalPassagiers}
      />

      <InputComp
        label="Doel en hoofdthema"
        value={doelEnHoofdthema}
        setValue={setDoelEnHoofdthema}
      />

      <InputComp
        label="Aanvullende info"
        value={aanvullendeInfo}
        setValue={setAanvullendeInfo}
      />
    </>
  );
}
