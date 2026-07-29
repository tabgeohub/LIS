import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useContent } from "hooks/useContent";
import { useOmschrijvingExists } from "../helpers/useOmschrijvingExists";

export default function GeometryOmschrijvingField({
  omschrijving,
  setOmschrijving,
}: {
  omschrijving: string;
  setOmschrijving: (value: string) => void;
}) {
  const content = useContent();
  const omschrijvingExists = useOmschrijvingExists(omschrijving);

  return (
    <div>
      <InputComp
        label={content.voorbereiding.aandachtspuntAanmaken.step2.omschrijving}
        value={omschrijving}
        setValue={setOmschrijving}
        required={true}
      />

      {omschrijvingExists && omschrijving !== "" && (
        <div className="flex flex-col items-end mt-1">
          <p className="text-red-500 text-xs">Deze omschrijving bestaat al</p>
        </div>
      )}
    </div>
  );
}
