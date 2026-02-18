import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useEffect, useState } from "react";
import Buttons from "./Buttons";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useUpdateData } from "utils/useUpdateData";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";

export default function Form({
  setAction,
  setOpenEdit,
}: {
  setAction: (value: string) => void;
  setOpenEdit: (value: boolean) => void;
}) {
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
    if (!selectedPoint) return;

    const updatedPoint = {
      ...selectedPoint,
      omschrijving: omschrijving,
      specifiek_letten_op: comment,
    };

    const payload = {
      omschrijving: omschrijving,
      regio_id: selectedPoint.regio_id,
      xcoordinaat_rd: selectedPoint.xcoordinaat_rd,
      ycoordinaat_rd: selectedPoint.ycoordinaat_rd,
      latitude: selectedPoint.latitude,
      longitude: selectedPoint.longitude,
      vertrouwelijk: selectedPoint.vertrouwelijk,
      herhalen: selectedPoint.herhalen,
      user_id: selectedPoint.user_id,
      activiteit_id: selectedPoint.activiteit_id,
      organisatie_id: selectedPoint.organisatie_id,
      specifiek_letten_op: comment,
      datum: selectedPoint.datum,
      id: selectedPoint.id,
    };

    update(payload, (responseData) => {
      if (!responseData.result) return;

      if (!selectedPlan) return;

      resetFeatures();
      setAction("form");

      setSelectedPoint(updatedPoint);

      setSelectedPlan({
        ...selectedPlan,
        points_data: [
          ...selectedPlan.points_data.filter(
            (point) => point.id !== payload.id
          ),
          updatedPoint,
        ],
      });
    });

    logAction({
      message: "User clicked 'Update' button",
      step: "Second step - Edit point",
      newData: {
        ...payload,
      },
    });
  }

  if (!selectedPoint) return <div></div>;

  const currentPoint = selectedPlan?.points_data.find(
    (p) => p.id === selectedPoint?.id
  );

  const isAdHoc =
    selectedPoint?.omschrijving?.toLowerCase().includes("ad hoc") || false;

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

      <div className="mt-4 space-y-2 px-2">
        <InputComp
          value={omschrijving}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.aandachtspunt
          }
          setValue={setOmschrijving}
          disabled={
            !selectedPoint.omschrijving.toLowerCase().includes("ad hoc")
          }
        />

        <InputComp
          value={selectedPlan?.vluchtnummer || ""}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.vluchtplan
          }
          setValue={() => {}}
          disabled
        />

        <InputComp
          value={`${selectedPoint.datum.split("T")[0]} - ${
            selectedPoint.datum.split("T")[1]
          }`}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.datum
          }
          setValue={() => {}}
          disabled
        />

        <InputComp
          value={selectedPlan?.waarnemer || ""}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.waarnemer
          }
          setValue={() => {}}
          disabled
        />

        <InputComp
          value={email}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.emailadres
          }
          setValue={setEmail}
        />
        <TextAreaComp
          value={comment}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.aanvullendeInfo
          }
          setValue={setComment}
        />

        <InputComp
          value={"Finished"}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.status
          }
          setValue={() => {}}
          disabled
        />

        {currentPoint?.spoed && (
          <InputComp
            value={String(currentPoint.spoedemail)}
            label={
              content.nabewerking.vluchtenZoeken.step2.waarnemingen
                .editPointDetails.labels.spoedrapport
            }
            setValue={() => {}}
            disabled
          />
        )}

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
      </div>

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500/20 bg-opacity-50 z-10">
          <LoadingBars />
        </div>
      )}
    </ScrollButtonsLayout>
  );
}
