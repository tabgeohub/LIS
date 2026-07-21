import { ReactNode } from "react";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import {
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";
import type { FlightPlanFieldLabels } from "hooks/flightPlan/flightPlanStandardSelectProps";

type SelectOption = { label: string; value: string };

export type FlightPlanStandardFieldsProps = {
  fields: FlightPlanFormFieldValues & FlightPlanFormFieldSetters;
  labels: FlightPlanFieldLabels;
  pilootOptions: SelectOption[];
  typeLuchtvaartuigOptions: SelectOption[];
  waarnemerOptions?: SelectOption[];
  waarnemerDisabled?: boolean;
  datumDisabled?: boolean;
  geplandeVliegduurDisabled?: boolean;
  typeLuchtvaartuigDisabled?: boolean;
  omschrijvingAsTextArea?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function FlightPlanStandardFieldsView({
  fields,
  labels,
  pilootOptions,
  typeLuchtvaartuigOptions,
  waarnemerOptions,
  waarnemerDisabled = false,
  datumDisabled = false,
  geplandeVliegduurDisabled = false,
  typeLuchtvaartuigDisabled = false,
  omschrijvingAsTextArea = false,
  header,
  footer,
  className = "space-y-3",
}: FlightPlanStandardFieldsProps) {
  const waarnemerField =
    waarnemerOptions != null ? (
      <SelectComp
        label={labels.waarnemer}
        value={fields.waarnemer}
        setValue={fields.setWaarnemer}
        required
        options={waarnemerOptions}
        disabled={waarnemerDisabled}
      />
    ) : (
      <InputComp
        label={labels.waarnemer}
        value={fields.waarnemer}
        setValue={fields.setWaarnemer}
        required
        disabled={waarnemerDisabled}
      />
    );

  return (
    <div className={className}>
      {header}

      {omschrijvingAsTextArea ? (
        <div className="grid grid-cols-6 gap-x-2 items-start">
          <TextAreaComp
            value={fields.omschrijving}
            setValue={fields.setOmschrijving}
            label={labels.omschrijving}
          />
        </div>
      ) : (
        <InputComp
          label={labels.omschrijving}
          value={fields.omschrijving}
          setValue={fields.setOmschrijving}
        />
      )}

      <SelectComp
        label={labels.piloot}
        value={fields.piloot}
        setValue={fields.setPiloot}
        options={pilootOptions}
      />

      {waarnemerField}

      <InputComp
        label={labels.datum}
        value={fields.datum}
        setValue={fields.setDatum}
        required
        type="date"
        disabled={datumDisabled}
      />

      {typeLuchtvaartuigDisabled ? (
        <InputComp
          label={labels.typeLuchtvaartuig}
          value={fields.typeLuchtvaartuig}
          setValue={() => {}}
          disabled
        />
      ) : (
        <SelectComp
          label={labels.typeLuchtvaartuig}
          value={fields.typeLuchtvaartuig}
          setValue={fields.setTypeLuchtvaartuig}
          options={typeLuchtvaartuigOptions}
        />
      )}

      <InputCompNum
        label={labels.aantalPassagiers}
        value={Number(fields.aantalPassagiers ?? 0)}
        setValue={fields.setAantalPassagiers}
        type="number"
      />

      <InputComp
        label={labels.doelEnHoofdthema}
        value={fields.doelEnHoofdthema}
        setValue={fields.setDoelEnHoofdthema}
      />

      <InputComp
        label={labels.aanvullendeInfo}
        value={fields.aanvullendeInfo}
        setValue={fields.setAanvullendeInfo}
      />

      <InputComp
        label={labels.geplandeVliegduur}
        value={fields.geplandeVliegduur}
        setValue={fields.setGeplandeVliegduur}
        disabled={geplandeVliegduurDisabled}
      />

      {footer}
    </div>
  );
}
