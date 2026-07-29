import { useConstSelectOptions } from "Components/HomePage/hooks/consts/useConstSelectOptions";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import CheckBoxComp from "Components/HomePage/Body/Left/Common/FormComponents/CheckBoxComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import { useContent } from "hooks/useContent";
import { ReactNode } from "react";
import type {
  AandachtspuntDetailsFieldState,
  AandachtspuntDetailsValues,
} from "@helpers/points/aandachtspuntDetailsValues";

export type {
  AandachtspuntDetailsValues,
} from "@helpers/points/aandachtspuntDetailsValues";

export type AandachtspuntDetailsLabels = Partial<
  Record<keyof AandachtspuntDetailsFieldState, string>
>;

interface AandachtspuntDetailsFieldsProps extends AandachtspuntDetailsValues {
  omschrijvingField: ReactNode;
  labels?: AandachtspuntDetailsLabels;
  hideVertrouwelijk?: boolean;
  fieldsAfterOmschrijving?: ReactNode;
  trailingFields?: ReactNode;
  className?: string;
}

type DefaultLabels = Record<keyof AandachtspuntDetailsFieldState, string>;

function resolveFieldLabel(input: {
  labels: AandachtspuntDetailsLabels | undefined;
  key: keyof DefaultLabels;
  defaults: DefaultLabels;
}): string {
  return input.labels?.[input.key] ?? input.defaults[input.key];
}

function VertrouwelijkCheckbox(input: {
  hide: boolean;
  checked: boolean;
  setValue: (value: boolean) => void;
  label: string;
}) {
  if (input.hide) return null;
  return (
    <CheckBoxComp
      checked={input.checked}
      value={input.checked}
      setValue={input.setValue}
      label={input.label}
    />
  );
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
  const activities = useConstSelectOptions("activiteiten");
  const organizations = useConstSelectOptions("organisaties");

  const defaultLabels = content.voorbereiding.aandachtspuntAanmaken.step2;

  return (
    <div className={className}>
      <VertrouwelijkCheckbox
        hide={hideVertrouwelijk}
        checked={vertrouwelijk}
        setValue={setVertrouwelijk}
        label={resolveFieldLabel({
          labels,
          key: "vertrouwelijk",
          defaults: defaultLabels,
        })}
      />

      <CheckBoxComp
        checked={herhalen}
        value={herhalen}
        setValue={setHerhalen}
        label={resolveFieldLabel({
          labels,
          key: "herhalen",
          defaults: defaultLabels,
        })}
      />

      {omschrijvingField}

      {fieldsAfterOmschrijving}

      <SelectComp
        label={resolveFieldLabel({
          labels,
          key: "activiteit",
          defaults: defaultLabels,
        })}
        value={activiteit}
        setValue={setActiviteit}
        options={activities}
      />

      <SelectComp
        label={resolveFieldLabel({
          labels,
          key: "organisatie",
          defaults: defaultLabels,
        })}
        value={organisatie}
        setValue={setOrganisatie}
        options={organizations}
        required
      />

      <div className="grid grid-cols-6 gap-x-2 items-start">
        <TextAreaComp
          value={specifiekLettenOp}
          setValue={setSpecifiekLettenOp}
          label={resolveFieldLabel({
            labels,
            key: "specifiekLettenOp",
            defaults: defaultLabels,
          })}
        />
      </div>

      {trailingFields}
    </div>
  );
}
