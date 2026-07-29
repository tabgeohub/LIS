import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import { useEffect, useState } from "react";
import Buttons from "../Buttons";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { toast } from "react-hot-toast";
import { applyGeometryCommentUpdate } from "./applyGeometryCommentUpdate";
import type { EditObservationFormProps } from "../../../common/editObservationFormProps";
import { ObservationDetailFields } from "../../../common/ObservationDetailFields";

export default function Form({
  setAction,
  setOpenEdit,
}: EditObservationFormProps) {
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
      await applyGeometryCommentUpdate({
        selectedGeometry,
        selectedPlan,
        comment,
        setSelectedGeometry,
        setSelectedPlan,
        resetFeatures,
        setAction,
        logAction,
        onSuccessToast: () => toast.success("Geometry updated successfully"),
        onFailureToast: () => toast.error("Failed to update points"),
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

      <ObservationDetailFields
        vluchtnummer={selectedPlan?.vluchtnummer || ""}
        datumDisplay={`${firstPoint.datum.split("T")[0]} - ${
          firstPoint.datum.split("T")[1]
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
            value={
              selectedGeometry.geometry_omschrijving ||
              `Geometrie ${selectedGeometry.id}`
            }
            label="Geometrie naam"
            setValue={() => {}}
            disabled
          />
        }
      />

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500/20 bg-opacity-50 z-10">
          <LoadingBars />
        </div>
      )}
    </ScrollButtonsLayout>
  );
}
