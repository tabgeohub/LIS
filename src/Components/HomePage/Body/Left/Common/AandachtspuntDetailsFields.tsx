import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import CheckBoxComp from "Components/HomePage/Body/Left/Common/FormComponents/CheckBoxComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import { useContent } from "hooks/useContent";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { ReactNode } from "react";

export interface AandachtspuntDetailsValues {
  vertrouwelijk: boolean;
  setVertrouwelijk: (value: boolean) => void;
  herhalen: boolean;
  setHerhalen: (value: boolean) => void;
  activiteit: string;
  setActiviteit: (value: string) => void;
  organisatie: string;
  setOrganisatie: (value: string) => void;
  specifiekLettenOp: string;
  setSpecifiekLettenOp: (value: string) => void;
}

interface AandachtspuntDetailsFieldsProps extends AandachtspuntDetailsValues {
  omschrijvingField: ReactNode;
}

export default function AandachtspuntDetailsFields({
  vertrouwelijk,
  setVertrouwelijk,
  herhalen,
  setHerhalen,
  activiteit,
  setActiviteit,
  organisatie,
  setOrganisatie,
  specifiekLettenOp,
  setSpecifiekLettenOp,
  omschrijvingField,
}: AandachtspuntDetailsFieldsProps) {
  const content = useContent();
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();

  return (
    <div className="space-y-5 text-[16px]">
      <CheckBoxComp
        checked={vertrouwelijk}
        value={vertrouwelijk}
        setValue={setVertrouwelijk}
        label={content.voorbereiding.aandachtspuntAanmaken.step2.vertrouwelijk}
      />

      <CheckBoxComp
        checked={herhalen}
        value={herhalen}
        setValue={setHerhalen}
        label={content.voorbereiding.aandachtspuntAanmaken.step2.herhalen}
      />

      {omschrijvingField}

      <SelectComp
        label={content.voorbereiding.aandachtspuntAanmaken.step2.activiteit}
        value={activiteit}
        setValue={setActiviteit}
        options={activities}
      />

      <SelectComp
        label={content.voorbereiding.aandachtspuntAanmaken.step2.organisatie}
        value={organisatie}
        setValue={setOrganisatie}
        options={organizations}
        required
      />

      <div className="grid grid-cols-6 gap-x-2 items-start">
        <TextAreaComp
          value={specifiekLettenOp}
          setValue={setSpecifiekLettenOp}
          label={
            content.voorbereiding.aandachtspuntAanmaken.step2.specifiekLettenOp
          }
        />
      </div>
    </div>
  );
}
