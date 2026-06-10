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

export interface AandachtspuntDetailsLabels {
  vertrouwelijk?: string;
  herhalen?: string;
  activiteit?: string;
  organisatie?: string;
  specifiekLettenOp?: string;
}

interface AandachtspuntDetailsFieldsProps extends AandachtspuntDetailsValues {
  omschrijvingField: ReactNode;
  labels?: AandachtspuntDetailsLabels;
  hideVertrouwelijk?: boolean;
  fieldsAfterOmschrijving?: ReactNode;
  trailingFields?: ReactNode;
  className?: string;
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
  labels,
  hideVertrouwelijk = false,
  fieldsAfterOmschrijving,
  trailingFields,
  className = "space-y-5 text-[16px]",
}: AandachtspuntDetailsFieldsProps) {
  const content = useContent();
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();

  const defaultLabels = content.voorbereiding.aandachtspuntAanmaken.step2;

  return (
    <div className={className}>
      {!hideVertrouwelijk && (
        <CheckBoxComp
          checked={vertrouwelijk}
          value={vertrouwelijk}
          setValue={setVertrouwelijk}
          label={labels?.vertrouwelijk ?? defaultLabels.vertrouwelijk}
        />
      )}

      <CheckBoxComp
        checked={herhalen}
        value={herhalen}
        setValue={setHerhalen}
        label={labels?.herhalen ?? defaultLabels.herhalen}
      />

      {omschrijvingField}

      {fieldsAfterOmschrijving}

      <SelectComp
        label={labels?.activiteit ?? defaultLabels.activiteit}
        value={activiteit}
        setValue={setActiviteit}
        options={activities}
      />

      <SelectComp
        label={labels?.organisatie ?? defaultLabels.organisatie}
        value={organisatie}
        setValue={setOrganisatie}
        options={organizations}
        required
      />

      <div className="grid grid-cols-6 gap-x-2 items-start">
        <TextAreaComp
          value={specifiekLettenOp}
          setValue={setSpecifiekLettenOp}
          label={labels?.specifiekLettenOp ?? defaultLabels.specifiekLettenOp}
        />
      </div>

      {trailingFields}
    </div>
  );
}
