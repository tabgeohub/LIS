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
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { toast } from "react-hot-toast";

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

  // Get first point from geometry
  const firstPoint = selectedGeometry?.points?.[0];

  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [omschrijving, setOmschrijving] = useState("");
  const [loading, setLoading] = useState(false);

  const content = useContent();

  useEffect(() => {
    if (!firstPoint) return;

    setEmail("");
    setComment(firstPoint?.point_comment || "");
    setOmschrijving(firstPoint?.omschrijving || "");
  }, [firstPoint]);

  async function handleUpdate() {
    if (!selectedGeometry || !firstPoint) return;

    setLoading(true);

    try {
      // Update all points in the geometry with the same comment and specifiek_letten_op
      const updatePromises = selectedGeometry.points.map(async (point) => {
        const payload = {
          omschrijving: point.omschrijving,
          regio_id: point.regio_id,
          xcoordinaat_rd: point.xcoordinaat_rd,
          ycoordinaat_rd: point.ycoordinaat_rd,
          latitude: point.latitude,
          longitude: point.longitude,
          vertrouwelijk: point.vertrouwelijk,
          herhalen: point.herhalen,
          user_id: point.user_id,
          activiteit_id: point.activiteit_id,
          organisatie_id: point.organisatie_id,
          specifiek_letten_op: comment, // Use comment from form
          datum: point.datum,
          id: point.id,
        };

        try {
          const response = await axios.patch(
            `${getBackEndUrl()}/api/points/${point.id}`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.result) {
            return {
              ...point,
              specifiek_letten_op: comment,
              point_comment: comment,
            };
          }
          return null;
        } catch (err) {
          console.error(`Failed to update point ${point.id}:`, err);
          return null;
        }
      });

      const updatedPoints = await Promise.all(updatePromises);
      const validUpdatedPoints = updatedPoints.filter((p) => p !== null) as typeof selectedGeometry.points;

      if (validUpdatedPoints.length === 0) {
        toast.error("Failed to update points");
        setLoading(false);
        return;
      }

      toast.success("Geometry updated successfully");
      resetFeatures();
      setAction("form");

      // Update the geometry with updated points
      const updatedGeometry = {
        ...selectedGeometry,
        points: validUpdatedPoints,
      };

      setSelectedGeometry(updatedGeometry);

      // Update the plan's geometry
      if (selectedPlan) {
        setSelectedPlan({
          ...selectedPlan,
          geometries: selectedPlan.geometries.map((geom) =>
            geom.id === selectedGeometry.id ? updatedGeometry : geom
          ),
          // Also update points_data if they exist in the geometry
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

