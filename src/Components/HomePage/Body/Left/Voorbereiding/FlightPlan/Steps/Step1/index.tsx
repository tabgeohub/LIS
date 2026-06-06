import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import Vluchtnummer from "./Vluchtnummer";
import Buttons from "./Buttons";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import useGetPiloot from "hooks/consts/useGetPiloot";
import useGetWaarnemers from "hooks/consts/useGetWaarnemers";
import useGetLuchtvaartuig from "hooks/consts/useGetLuchtvaartuig";
import { useContent } from "hooks/useContent";

export default function Step1() {
  const pilootOptions = useGetPiloot();
  const waarnemerOptions = useGetWaarnemers();
  const typeLuchtvaartuigOptions = useGetLuchtvaartuig();

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
    setTypeLuchtvaartuig,
    aantalPassagiers,
    setAantalPassagiers,
    doelEnHoofdthema,
    setDoelEnHoofdthema,
    aanvullendeInfo,
    setAanvullendeInfo,
  } = useFlightPlanState();

  const content = useContent();

  return (
    <div className="py-4 px-2 space-y-3 h-full  overflow-y-auto thin-scrollbar">
      <Vluchtnummer />

      <InputComp
        label={content.voorbereiding.vluchtAanmaken.step1.omschrijving}
        value={omschrijving}
        setValue={setOmschrijving}
      />

      <SelectComp
        label={content.voorbereiding.vluchtAanmaken.step1.waarnemer}
        value={waarnemer}
        setValue={setWaarnemer}
        required={true}
        options={waarnemerOptions}
      />

      <SelectComp
        label={content.voorbereiding.vluchtAanmaken.step1.piloot}
        value={piloot}
        setValue={setPiloot}
        options={pilootOptions}
      />

      <InputComp
        label={content.voorbereiding.vluchtAanmaken.step1.datum}
        value={datum}
        setValue={setDatum}
        required={true}
        type="date"
      />

      <InputComp
        label={content.voorbereiding.vluchtAanmaken.step1.geplandeVliegduur}
        value={geplandeVliegduur}
        setValue={setGeplandeVliegduur}
      />

      <SelectComp
        label={content.voorbereiding.vluchtAanmaken.step1.typeLuchtvaartuig}
        value={typeLuchtvaartuig}
        setValue={setTypeLuchtvaartuig}
        options={typeLuchtvaartuigOptions}
      />

      <InputCompNum
        label={content.voorbereiding.vluchtAanmaken.step1.aantalPassagiers}
        value={aantalPassagiers!}
        setValue={setAantalPassagiers}
        type="number"
      />

      <InputComp
        label={content.voorbereiding.vluchtAanmaken.step1.doelEnHoofdthema}
        value={doelEnHoofdthema}
        setValue={setDoelEnHoofdthema}
      />

      <InputComp
        label={content.voorbereiding.vluchtAanmaken.step1.aanvullendeInfo}
        value={aanvullendeInfo}
        setValue={setAanvullendeInfo}
      />

      <Buttons />
    </div>
  );
}
