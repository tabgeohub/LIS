import { base64ToBlob } from "@helpers/base64ToBlob";
import { useContent } from "hooks/useContent";
import { useEffect, useState } from "react";
import { useCreateData } from "utils/useCreateData";
import { useUpdateData } from "utils/useUpdateData";
import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { useUploadAttachmentForPoint } from "./useUploadAttachmentForPoint";
import {
  buildAttachmentFromUploadResponse,
  readImageFileAsBlob,
} from "./attachmentUploadHelpers";

export default function CreateImageBtn({
  setLoading,
  attachmentPoint,
  selectedPlan,
  fileInputId,
  onAttachmentsUpdated,
}: {
  setLoading: (value: boolean) => void;
  attachmentPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  fileInputId: string;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
}) {
  const [newImage, setNewImage] = useState<{
    image: File | Blob;
    timestamp: number;
  } | null>(null);

  const uploadAttachmentForPoint = useUploadAttachmentForPoint();
  const content = useContent();

  const { create } = useCreateData("/finished_plans/attachment");
  const { update } = useUpdateData(
    "/finished_plans/points/finishedPointAttachments"
  );

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!attachmentPoint) return;

    setLoading(true);

    const files = event.target.files;
    if (!files || files.length === 0) return;

    readImageFileAsBlob(files[0], setNewImage);
  };

  useEffect(() => {
    if (!attachmentPoint || !newImage || !selectedPlan) return;

    const uploadAttachment = async () => {
      const attachments = await uploadAttachmentForPoint(
        attachmentPoint.id,
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
          pointId: attachmentPoint.id,
          attachmentId: first.objectId,
          taken_at: first.taken_at,
          long: attachmentPoint.longitude,
          lat: attachmentPoint.latitude,
        },
        (responseData) => {
          const uploadedAttachment = buildAttachmentFromUploadResponse(
            first.objectId,
            // @ts-ignore
            responseData.result.id,
            // @ts-ignore
            responseData.result.url,
            attachmentPoint.id,
            first.taken_at
          );

          const isFirstAttachment =
            attachmentPoint.attachments?.at(0) === null ||
            !attachmentPoint.attachments?.length;

          const newAttachments = isFirstAttachment
            ? [uploadedAttachment]
            : [...attachmentPoint.attachments, uploadedAttachment];

          const attachmentsIds = isFirstAttachment
            ? // @ts-ignore
              [responseData.result.id]
            : [
                ...attachmentPoint.attachments.flatMap(
                  (attachment) => attachment.id
                ),
                // @ts-ignore
                responseData.result.id,
              ];

          update({
            point_id: attachmentPoint.id,
            plan_id: selectedPlan.id,
            attachments_id: attachmentsIds,
          });

          onAttachmentsUpdated(newAttachments);
          setLoading(false);
          setNewImage(null);
        }
      );
    };

    uploadAttachment();
  }, [newImage]);

  return (
    <>
      <label className="gray-button flex items-center" htmlFor={fileInputId}>
        <span>
          {
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.addNewImage
          }
        </span>
      </label>

      <input
        id={fileInputId}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="mt-2 p-2 border border-gray-300 rounded sr-only"
      />
    </>
  );
}
