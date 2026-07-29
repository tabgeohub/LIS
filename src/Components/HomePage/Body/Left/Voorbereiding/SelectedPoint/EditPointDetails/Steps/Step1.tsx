import { useConstSelectOptions } from "Components/HomePage/hooks/consts/useConstSelectOptions";
import { Field } from "formik";
import InputFormik from "../../Common/InputFormik";
import SelectFormik from "../../Common/SelectFormik";
import Step1Buttons from "./Step1Buttons";

export default function Step1({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const organizations = useConstSelectOptions("organisaties");
  const activities = useConstSelectOptions("activiteiten");

  return (
    <div className="h-[65vh] overflow-y-auto thin-scrollbar flex flex-col gap-y-2 p-2">
      <div className="flex gap-x-2 items-center">
        <Field name="herhalen" type="checkbox" placeholder="herhalen" />

        <label htmlFor="herhalen">Herhalen</label>
      </div>

      <InputFormik label="Omschrijving" name="omschrijving" />

      <InputFormik
        disabled={true}
        label="Datum"
        name="datum"
        type="datetime-local"
      />

      <InputFormik disabled={true} label="Aanmaker" name="aanmaker" />

      <InputFormik disabled={true} label="Regio" name="regio_id" />

      <SelectFormik
        label="Activiteit"
        name="activiteit_id"
        options={activities}
      />

      <SelectFormik
        label="Organisatie"
        name="organisatie_id"
        options={organizations}
      />

      <InputFormik
        label="Specifiek letten op"
        name="specifiek_letten_op"
        type="textarea"
      />

      <InputFormik disabled={true} label="RD (X, Y)" name="rd" />

      <InputFormik disabled={true} label="WGS84 (Lat, Lon)" name="wgs84" />

      <InputFormik disabled={true} label="Vertrouwelijk" name="vertrouwelijk" />

      <Step1Buttons setStep={setStep} />
    </div>
  );
}
