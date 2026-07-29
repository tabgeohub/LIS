import type { ReactNode } from "react";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import { useContent } from "hooks/useContent";

type ObservationDetailFieldsProps = {
  vluchtnummer: string;
  datumDisplay: string;
  waarnemer: string;
  email: string;
  setEmail: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  spoedEmail?: string | null;
  showSpoed: boolean;
  leadingFields?: ReactNode;
};

/** Shared read-only / editable observation fields for point + geometry edit forms. */
export function ObservationDetailFields(props: ObservationDetailFieldsProps) {
  const content = useContent();
  const labels =
    content.nabewerking.vluchtenZoeken.step2.waarnemingen.editPointDetails
      .labels;

  return (
    <div className="mt-4 space-y-2 px-2">
      {props.leadingFields}

      <InputComp
        value={props.vluchtnummer}
        label={labels.vluchtplan}
        setValue={() => {}}
        disabled
      />

      <InputComp
        value={props.datumDisplay}
        label={labels.datum}
        setValue={() => {}}
        disabled
      />

      <InputComp
        value={props.waarnemer}
        label={labels.waarnemer}
        setValue={() => {}}
        disabled
      />

      <InputComp
        value={props.email}
        label={labels.emailadres}
        setValue={props.setEmail}
      />
      <TextAreaComp
        value={props.comment}
        label={labels.aanvullendeInfo}
        setValue={props.setComment}
      />

      <InputComp
        value={"Finished"}
        label={labels.status}
        setValue={() => {}}
        disabled
      />

      {props.showSpoed && (
        <InputComp
          value={String(props.spoedEmail)}
          label={labels.spoedrapport}
          setValue={() => {}}
          disabled
        />
      )}
    </div>
  );
}
