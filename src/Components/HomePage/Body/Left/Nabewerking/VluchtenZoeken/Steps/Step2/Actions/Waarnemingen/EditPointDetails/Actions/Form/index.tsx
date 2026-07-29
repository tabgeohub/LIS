import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import { useEffect, useState } from "react";
import Buttons from "./Buttons";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useUpdateData } from "utils/useUpdateData";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { submitEditPointDetails } from "./submitEditPointDetails";
import type { EditObservationFormProps } from "../../../common/editObservationFormProps";
import { ObservationDetailFields } from "../../../common/ObservationDetailFields";

export default function Form({
  setAction,
  setOpenEdit,
}: EditObservationFormProps) {
  const logAction = useLogAction();

  const { selectedPoint, selectedPlan, setSelectedPlan, setSelectedPoint } =
    useFinishedPlansState();

  const { resetFeatures } = useResetFeatures();

  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [omschrijving, setOmschrijving] = useState("");

  const content = useContent();

  useEffect(() => {
    if (!selectedPoint) return;

    setEmail("");
    setComment(selectedPoint?.point_comment);
    setOmschrijving(selectedPoint?.omschrijving);
  }, [selectedPoint]);

  function handleUpdate() {
    submitEditPointDetails({
      selectedPoint,
      selectedPlan,
      omschrijving,
      comment,
      update,
      setSelectedPoint,
      setSelectedPlan,
      resetFeatures,
      setAction,
      logAction,
    });
  }

  if (!selectedPoint) return <div></div>;

  const currentPoint = selectedPlan?.points_data.find(
    (p) => p.id === selectedPoint?.id
  );

  const isAdHoc =
    selectedPoint?.omschrijving?.toLowerCase().includes("ad hoc") || false;

  const labels =
    content.nabewerking.vluchtenZoeken.step2.waarnemingen.editPointDetails
      .labels;

  return (
    <ScrollButtonsLayout
      buttons={
        <Buttons
          handleUpdate={handleUpdate}
          setOpenEdit={setOpenEdit}
          setAction={setAction}
          selectedPoint={selectedPoint}
        />
      }
    >
      <div className="text-[12px] px-2 text-gray-700 mt-2 space-y-2">
        <p>
          {
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.help.photos
          }
        </p>

        <p>
          {
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.help.changePoint
          }
        </p>

        <p>
          {
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.help.deleteObservation
          }
        </p>

        <p>
          {
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.help.save
          }
        </p>
      </div>

      <ObservationDetailFields
        vluchtnummer={selectedPlan?.vluchtnummer || ""}
        datumDisplay={`${selectedPoint.datum.split("T")[0]} - ${
          selectedPoint.datum.split("T")[1]
        }`}
        waarnemer={selectedPlan?.waarnemer || ""}
        email={email}
        setEmail={setEmail}
        comment={comment}
        setComment={setComment}
        showSpoed={Boolean(currentPoint?.spoed)}
        spoedEmail={currentPoint?.spoedemail}
        leadingFields={
          <InputComp
            value={omschrijving}
            label={labels.aandachtspunt}
            setValue={setOmschrijving}
            disabled={
              !selectedPoint.omschrijving.toLowerCase().includes("ad hoc")
            }
          />
        }
      />

      {isAdHoc && (
        <button
          onClick={() => {
            setAction("editPointCoordinates");

            logAction({
              message: "User clicked 'Edit point coordinates' button",
              step: "Second step - Form",
            });
          }}
          className="gray-button !mt-10"
        >
          {
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.editPointCoordinatesBtn
          }
        </button>
      )}

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500/20 bg-opacity-50 z-10">
          <LoadingBars />
        </div>
      )}
    </ScrollButtonsLayout>
  );
}
