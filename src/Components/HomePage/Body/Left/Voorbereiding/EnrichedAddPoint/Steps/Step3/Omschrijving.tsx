import { useReadData } from "utils/useReadData";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useContent } from "hooks/useContent";

export default function Omschrijving({
  omschrijving,
  setOmschrijving,
}: {
  omschrijving: string;
  setOmschrijving: (value: string) => void;
}) {
  const content = useContent();

  const { data: nbrOmschrijving } = useReadData(
    `/points/duplicatePoints/${omschrijving}`
  );

  return (
    <>
      <InputComp
        label={content.voorbereiding.aandachtspuntAanmaken.step2.omschrijving}
        value={omschrijving}
        setValue={setOmschrijving}
        required={true}
      />

      {Number(nbrOmschrijving) > 0 && omschrijving !== "" && (
        <div className="flex flex-col items-end">
          <p className="text-red-500  text-xs">
            {
              content.voorbereiding.aandachtspuntAanmaken.step3
                .omschrijvingWarning
            }
          </p>
        </div>
      )}
    </>
  );
}
