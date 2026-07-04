import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useEffect, useState } from "react";
import Buttons from "../Buttons";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { toast } from "react-hot-toast";
import { updateGeometryPointsComment } from "./updateGeometryPointsComment";

export default function Form({
  setAction,
  setOpenEdit,
}: {
  setAction: (value: string) => void;
  setOpenEdit: (value: boolean) => void;
}) {
  const logAction = useLogAction();

  const { selectedGeometry, selectedPlan, setSelectedPlan, setSelectedGeometry } =
    useFinishedPlansState();

  const { resetFeatures } = useResetFeatures();

  const firstPoint = selectedGeometry?.points?.[0];

  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const content = useContent();

  useEffect(() => {
    if (!firstPoint) return;

    setEmail("");
    setComment(firstPoint?.point_comment || "");
  }, [firstPoint]);

  async function handleUpdate() {
    if (!selectedGeometry || !firstPoint) return;

    setLoading(true);

    try {
      const validUpdatedPoints = await updateGeometryPointsComment({
        points: selectedGeometry.points,
        comment,
      });

      if (validUpdatedPoints.length === 0) {
        toast.error("Failed to update points");
        return;
      }

      toast.success("Geometry updated successfully");
      resetFeatures();
      setAction("form");

      const updatedGeometry = {
        ...selectedGeometry,
        points: validUpdatedPoints,
      };

      setSelectedGeometry(updatedGeometry);

      if (selectedPlan) {
        setSelectedPlan({
          ...selectedPlan,
          geometries: selectedPlan.geometries.map((geom) =>
            geom.id === selectedGeometry.id ? updatedGeometry : geom
          ),
          points_data: selectedPlan.points_data.map((point) => {
            const updatedPoint = validUpdatedPoints.find((p) => p.id === point.id);
            return updatedPoint || point;
          }),
        });
      }

      logAction({
        message: "User clicked 'Update' button",
        step: "Second step - Edit geometry",
        newData: {
          geometry_id: selectedGeometry.id,
          comment,
          specifiek_letten_op: comment,
        },
      });
    } catch (error) {
      toast.error("Failed to update geometry");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!selectedGeometry || !firstPoint) return <div></div>;

  const currentPoint = selectedPlan?.points_data.find(
    (p) => p.id === firstPoint?.id
  );

  return (
    <ScrollButtonsLayout
      buttons={
        <Buttons
          handleUpdate={handleUpdate}
          setOpenEdit={setOpenEdit}
          setAction={setAction}
          selectedGeometry={selectedGeometry}
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
              .editPointDetails.help.save
          }
        </p>
      </div>

      <div className="mt-4 space-y-2 px-2">
        <InputComp
          value={selectedGeometry.geometry_omschrijving || `Geometrie ${selectedGeometry.id}`}
          label="Geometrie naam"
          setValue={() => { }}
          disabled
        />

        <InputComp
          value={selectedPlan?.vluchtnummer || ""}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.vluchtplan
          }
          setValue={() => { }}
          disabled
        />

        <InputComp
          value={`${firstPoint.datum.split("T")[0]} - ${firstPoint.datum.split("T")[1]
            }`}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.datum
          }
          setValue={() => { }}
          disabled
        />

        <InputComp
          value={selectedPlan?.waarnemer || ""}
          label={
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.labels.waarnemer
          }
          setValue={() => { }}
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
          setValue={() => { }}
          disabled
        />

        {currentPoint?.spoed && (
          <InputComp
            value={String(currentPoint.spoedemail)}
            label={
              content.nabewerking.vluchtenZoeken.step2.waarnemingen
                .editPointDetails.labels.spoedrapport
            }
            setValue={() => { }}
            disabled
          />
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
