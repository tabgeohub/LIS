import EditPointMapClickStep from "Components/HomePage/Body/Common/EditPoint/EditPointMapClickStep";
import { useFormikContext } from "formik";
import useLogAction from "hooks/useLogAction";
import { useState } from "react";
import { useEditPointFormMapClick } from "./useEditPointFormMapClick";
import type { EditPointMapStepProps } from "Components/HomePage/Body/Common/EditPoint/EditPointMapStepProps";

export default function Step2Sub1({
  setStep,
  setSubStep,
  subStep,
  isLoading,
  handleSubmit,
  currentPoint,
  setCurrentPoint,
}: EditPointMapStepProps) {
  const logAction = useLogAction();
  const { values, setValues } = useFormikContext<{
    id: number;
    herhalen: number;
    omschrijving: string;
    datum: number;
    regio_id: string;
    activiteit_id: string;
    organisatie_id: string;
    specifiek_letten_op: string;
    rd: string;
    wgs84: string;
    vertrouwelijk: number;
    x: number;
    y: number;
    longitude: number;
    latitude: number;
  }>();

  const [mapClickedNotify, setMapClickedNotify] = useState(0);

  useEditPointFormMapClick({
    subStep,
    mapClickedNotify,
    setMapClickedNotify,
    setCurrentPoint,
    setValues,
    values,
  });

  return (
    <EditPointMapClickStep
      instructionText={`Klik in de kaart om de locatie van het aandachtspunt in te tekenen of kies voor de optie "invoeren' om de coordinaten van het aandachtspunt op te geven.`}
      saveLabel="Opslaan"
      enterCoordinatesLabel="Coördinaten invoeren"
      cancelLabel="Annuleren"
      onSave={handleSubmit}
      onEnterCoordinates={() => {
        setSubStep(2);
        logAction({
          message: "User clicked 'Enter coordinates' button",
          step: "Edit point details - Step 2",
        });
      }}
      onCancel={() => {
        setStep(1);
        logAction({
          message: "User clicked 'Cancel' button",
          step: "Edit point details - Step 2",
        });
      }}
      isLoading={isLoading}
      loadingText="Bezig met opslaan..."
    />
  );
}
