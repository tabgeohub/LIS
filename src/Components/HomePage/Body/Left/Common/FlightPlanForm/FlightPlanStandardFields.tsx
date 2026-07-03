import { ReactNode } from "react";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import {
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";

export type FlightPlanFieldLabels = {
  omschrijving: string;
  waarnemer: string;
  piloot: string;
  datum: string;
  geplandeVliegduur: string;
  typeLuchtvaartuig: string;
  aantalPassagiers: string;
  doelEnHoofdthema: string;
  aanvullendeInfo: string;
};

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
  omschrijvingAsTextArea?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function pickFlightPlanFormFields(
  store: FlightPlanFormFieldValues & FlightPlanFormFieldSetters
) {
  return {
    omschrijving: store.omschrijving,
    setOmschrijving: store.setOmschrijving,
    waarnemer: store.waarnemer,
    setWaarnemer: store.setWaarnemer,
    piloot: store.piloot,
    setPiloot: store.setPiloot,
    datum: store.datum,
    setDatum: store.setDatum,
    geplandeVliegduur: store.geplandeVliegduur,
    setGeplandeVliegduur: store.setGeplandeVliegduur,
    typeLuchtvaartuig: store.typeLuchtvaartuig,
    setTypeLuchtvaartuig: store.setTypeLuchtvaartuig,
    aantalPassagiers: store.aantalPassagiers,
    setAantalPassagiers: store.setAantalPassagiers,
    doelEnHoofdthema: store.doelEnHoofdthema,
    setDoelEnHoofdthema: store.setDoelEnHoofdthema,
    aanvullendeInfo: store.aanvullendeInfo,
    setAanvullendeInfo: store.setAanvullendeInfo,
  };
}

export default function FlightPlanStandardFields({
  fields,
  labels,
  pilootOptions,
  typeLuchtvaartuigOptions,
  waarnemerOptions,
  waarnemerDisabled = false,
  datumDisabled = false,
  geplandeVliegduurDisabled = false,
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

      <SelectComp
        label={labels.typeLuchtvaartuig}
        value={fields.typeLuchtvaartuig}
        setValue={fields.setTypeLuchtvaartuig}
        options={typeLuchtvaartuigOptions}
      />

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
