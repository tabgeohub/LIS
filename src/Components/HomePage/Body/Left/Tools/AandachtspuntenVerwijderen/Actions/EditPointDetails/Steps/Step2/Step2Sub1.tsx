import EditPointMapClickStep from "Components/HomePage/Body/Common/EditPoint/EditPointMapClickStep";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { useDeletePointMapClick } from "./useDeletePointMapClick";

export default function Step2Sub1({
  setStep,
  setSubStep,
  subStep,
  isLoading,
  handleSubmit,
  currentPoint,
  setCurrentPoint,
}: {
  setStep: (value: number) => void;
  setSubStep: (value: number) => void;
  subStep: number;
  isLoading: boolean;
  handleSubmit: () => void;
  currentPoint: { x: number; y: number };
  setCurrentPoint: (value: { x: number; y: number }) => void;
}) {
  const logAction = useLogAction();
  const content = useContent();
  const { setXCoordinaat_rd, setYCoordinaat_rd, setLatitude, setLongitude } =
    useDeletePointState();

  useDeletePointMapClick({
    subStep,
    currentPoint,
    setCurrentPoint,
    setCoords: ({ rdX, rdY, latitude, longitude }) => {
      setXCoordinaat_rd(rdX);
      setYCoordinaat_rd(rdY);
      setLatitude(latitude);
      setLongitude(longitude);
    },
  });

  return (
    <EditPointMapClickStep
      instructionText={
        content.tools.aandachtspuntenVerwijderen.editPoint.step2.text1
      }
      saveLabel={content.common.opslaan}
      enterCoordinatesLabel={
        content.tools.aandachtspuntenVerwijderen.editPoint.step2
          .coördinatenInvoeren
      }
      cancelLabel={content.common.annuleren}
      onSave={() => {
        handleSubmit();
        logAction({
          message: "User clicked 'Save' button",
          step: "Edit point details - Step 2",
        });
      }}
      onEnterCoordinates={() => {
        setSubStep(2);
        logAction({
          message: "User clicked 'Edit geometry' button",
          step: "Edit point details - Step 2",
        });
      }}
      onCancel={() => {
        setStep(1);
        logAction({
          message: "User clicked 'Back' button",
          step: "Edit point details - Step 2",
        });
      }}
      isLoading={isLoading}
      loadingText={
        content.tools.aandachtspuntenVerwijderen.editPoint.step2.loading
      }
    />
  );
}
