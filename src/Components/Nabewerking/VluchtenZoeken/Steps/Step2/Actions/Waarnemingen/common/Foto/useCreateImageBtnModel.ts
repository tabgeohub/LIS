import { useState } from "react";
import { useCreateData } from "api-hooks/mutations";
import { useUpdateData } from "api-hooks/mutations";
import type {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { useUploadAttachmentForPoint } from "./useUploadAttachmentForPoint";
import { readImageFileAsBlob } from "./attachmentUploadHelpers";
import { useCreateImageUploadEffect } from "./useCreateImageUploadEffect";

type Props = {
  setLoading: (value: boolean) => void;
  attachmentPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
};

export function useCreateImageBtnModel(props: Props) {
  const [newImage, setNewImage] = useState<{
    image: File | Blob;
    timestamp: number;
  } | null>(null);
  const uploadAttachmentForPoint = useUploadAttachmentForPoint();
  const { create } = useCreateData("/finished_plans/attachment");
  const { update } = useUpdateData(
    "/finished_plans/points/finishedPointAttachments"
  );
  useCreateImageUploadEffect({
    ...props,
    newImage,
    setNewImage,
    uploadAttachmentForPoint,
    create: create as never,
    update: update as never,
  });
  return {
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!props.attachmentPoint) return;
      props.setLoading(true);
      const files = event.target.files;
      if (!files?.length) return;
      readImageFileAsBlob(files[0], setNewImage);
    },
  };
}
