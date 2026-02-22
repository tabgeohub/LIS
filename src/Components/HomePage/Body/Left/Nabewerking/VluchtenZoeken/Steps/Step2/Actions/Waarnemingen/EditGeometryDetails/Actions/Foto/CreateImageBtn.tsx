/* eslint-disable react-hooks/exhaustive-deps */
import { base64ToBlob } from "@helpers/base64ToBlob";
import { useContent } from "hooks/useContent";
import { useUploadAttachmentForPoint } from "./useUploadAttachmentForPoint";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useEffect, useState } from "react";
import { useCreateData } from "utils/useCreateData";
import { useUpdateData } from "utils/useUpdateData";

export default function CreateImageBtn({
  setLoading,
}: {
  setLoading: (value: boolean) => void;
}) {
  const [newImage, setNewImage] = useState<{
    image: File | Blob;
    timestamp: number;
  } | null>(null);

  const { selectedGeometry, selectedPlan, setSelectedPlan, setSelectedGeometry } =
    useFinishedPlansState();

  // Get first point from geometry
  const firstPoint = selectedGeometry?.points?.[0];

  const uploadAttachmentForPoint = useUploadAttachmentForPoint();

  const content = useContent();

  const { create } = useCreateData("/finished_plans/attachment");
  const { update } = useUpdateData(
    "/finished_plans/points/finishedPointAttachments"
  );

  const handleFileInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!firstPoint) return;

    setLoading(true);

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        const base64Image = reader.result as string;
        const blob = base64ToBlob(base64Image);

        setNewImage({ image: blob, timestamp: Date.now() });
      }
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!firstPoint || !newImage || !selectedPlan) return;

    const uploadAttachment = async () => {
      const attachments = await uploadAttachmentForPoint(
        firstPoint.id,
        newImage
      );

      create(
        {
          url: attachments[0].url,
          pointId: firstPoint.id,
          attachmentId: attachments[0].objectId,
          taken_at: attachments[0].taken_at,
          long: firstPoint.longitude,
          lat: firstPoint.latitude,
        },
        (responseData) => {
          if (firstPoint.attachments?.at(0) === null || !firstPoint.attachments) {
            const newAttachment = [
              {
                attachmentid: Number(attachments[0].objectId),
                // @ts-ignore
                id: Number(responseData.result.id),
                point_id: Number(firstPoint.id),
                taken_at: Number(attachments[0].taken_at),
                // @ts-ignore
                url: responseData.result.url,
              },
            ];

            update({
              point_id: firstPoint.id,
              plan_id: selectedPlan.id,
              // @ts-ignore
              attachments_id: [responseData.result.id],
            });

            const updatedFirstPoint = {
              ...firstPoint,
              attachments: newAttachment,
            };

            const updatedPoints = selectedGeometry?.points.map((point) =>
              point.id === firstPoint.id ? updatedFirstPoint : point
            );

            const updatedGeometry = {
              ...selectedGeometry,
              points: updatedPoints,
            };

            setSelectedGeometry(updatedGeometry);

            setSelectedPlan({
              ...selectedPlan,
              geometries: selectedPlan?.geometries.map((geom) =>
                geom.id === selectedGeometry?.id ? updatedGeometry : geom
              ),
              points_data: selectedPlan?.points_data.map((point) => {
                if (point.id === firstPoint.id) {
                  return updatedFirstPoint;
                }
                return point;
              }),
            });

            setLoading(false);
          } else {
            const newAttachmentsIds = [
              ...firstPoint.attachments.flatMap(
                (attachment) => attachment.id
              ),
              //   @ts-ignore
              responseData.result.id,
            ];

            const newAttachments = [
              ...firstPoint.attachments,
              {
                attachmentid: Number(attachments[0].objectId),
                // @ts-ignore
                id: Number(responseData.result.id),
                point_id: Number(firstPoint.id),
                taken_at: Number(attachments[0].taken_at),
                // @ts-ignore
                url: responseData.result.url,
              },
            ];

            update({
              point_id: firstPoint.id,
              plan_id: selectedPlan.id,
              attachments_id: newAttachmentsIds,
            });

            const updatedFirstPoint = {
              ...firstPoint,
              attachments: newAttachments,
            };

            const updatedPoints = selectedGeometry?.points.map((point) =>
              point.id === firstPoint.id ? updatedFirstPoint : point
            );

            const updatedGeometry = {
              ...selectedGeometry,
              points: updatedPoints,
            };

            setSelectedGeometry(updatedGeometry);

            setSelectedPlan({
              ...selectedPlan,
              geometries: selectedPlan?.geometries.map((geom) =>
                geom.id === selectedGeometry?.id ? updatedGeometry : geom
              ),
              points_data: selectedPlan?.points_data.map((point) => {
                if (point.id === firstPoint.id) {
                  return updatedFirstPoint;
                }
                return point;
              }),
            });

            setLoading(false);
          }
        }
      );
    };

    uploadAttachment();
  }, [newImage]);

  return (
    <>
      <label className="gray-button flex items-center" htmlFor="images">
        <span>
          {
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.addNewImage
          }
        </span>
      </label>

      <input
        id="images"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="mt-2 p-2 border border-gray-300 rounded sr-only"
      />
    </>
  );
}

