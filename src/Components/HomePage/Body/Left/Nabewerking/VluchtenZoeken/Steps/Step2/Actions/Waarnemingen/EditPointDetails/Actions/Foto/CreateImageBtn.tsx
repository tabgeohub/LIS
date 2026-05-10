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

  const { selectedPoint, selectedPlan, setSelectedPlan, setSelectedPoint } =
    useFinishedPlansState();
  const uploadAttachmentForPoint = useUploadAttachmentForPoint();

  const content = useContent();

  const { create } = useCreateData("/finished_plans/attachment");
  const { update } = useUpdateData(
    "/finished_plans/points/finishedPointAttachments"
  );

  const handleFileInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!selectedPoint) return;

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
    if (!selectedPoint || !newImage || !selectedPlan) return;

    const uploadAttachment = async () => {
      const attachments = await uploadAttachmentForPoint(
        selectedPoint.id,
        newImage
      );

      const first = attachments[0];
      if (!first?.url || first.objectId == null) {
        setLoading(false);
        setNewImage(null);
        return;
      }

      create(
        {
          url: first.url,
          pointId: selectedPoint.id,
          attachmentId: first.objectId,
          taken_at: first.taken_at,
          long: selectedPoint.longitude,
          lat: selectedPoint.latitude,
        },
        (responseData) => {
          if (selectedPoint.attachments.at(0) === null) {
            const newAttachment = [
              {
                attachmentid: Number(first.objectId),
                // @ts-ignore
                id: Number(responseData.result.id),
                point_id: Number(selectedPoint.id),
                taken_at: Number(first.taken_at),
                // @ts-ignore
                url: responseData.result.url,
              },
            ];

            update({
              point_id: selectedPoint.id,
              plan_id: selectedPlan.id,
              // @ts-ignore
              attachments_id: [responseData.result.id],
            });

            setSelectedPoint({
              ...selectedPoint,
              attachments: newAttachment,
            });

            setSelectedPlan({
              ...selectedPlan,
              points_data: selectedPlan?.points_data.map((point) => {
                if (point.id === selectedPoint?.id) {
                  return {
                    ...point,
                    attachments: newAttachment,
                  };
                }
                return point;
              }),
            });

            setLoading(false);
          } else {
            const newAttachmentsIds = [
              ...selectedPoint.attachments.flatMap(
                (attachment) => attachment.id
              ),
              //   @ts-ignore
              responseData.result.id,
            ];

            const newAttachments = [
              ...selectedPoint.attachments,
              {
                attachmentid: Number(first.objectId),
                // @ts-ignore
                id: Number(responseData.result.id),
                point_id: Number(selectedPoint.id),
                taken_at: Number(first.taken_at),
                // @ts-ignore
                url: responseData.result.url,
              },
            ];

            update({
              point_id: selectedPoint.id,
              plan_id: selectedPlan.id,
              attachments_id: newAttachmentsIds,
            });

            setSelectedPoint({
              ...selectedPoint,
              attachments: newAttachments,
            });

            setSelectedPlan({
              ...selectedPlan,
              points_data: selectedPlan?.points_data.map((point) => {
                if (point.id === selectedPoint?.id) {
                  return {
                    ...point,
                    attachments: newAttachments,
                  };
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
