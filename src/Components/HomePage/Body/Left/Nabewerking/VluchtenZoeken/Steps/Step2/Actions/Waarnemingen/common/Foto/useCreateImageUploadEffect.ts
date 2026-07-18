import { useEffect } from "react";
import type { CreateImageUploadInput } from "./createImageUploadTypes";
import { runCreateImageUpload } from "./runCreateImageUpload";

export function useCreateImageUploadEffect(input: {
  attachmentPoint: CreateImageUploadInput["attachmentPoint"] | null;
  selectedPlan: CreateImageUploadInput["selectedPlan"] | null;
  newImage: CreateImageUploadInput["newImage"] | null;
  setNewImage: CreateImageUploadInput["setNewImage"];
  setLoading: CreateImageUploadInput["setLoading"];
  onAttachmentsUpdated: CreateImageUploadInput["onAttachmentsUpdated"];
  uploadAttachmentForPoint: CreateImageUploadInput["uploadAttachmentForPoint"];
  create: CreateImageUploadInput["create"];
  update: CreateImageUploadInput["update"];
}) {
  useEffect(() => {
    if (!input.attachmentPoint || !input.newImage || !input.selectedPlan)
      return;
    runCreateImageUpload({
      attachmentPoint: input.attachmentPoint,
      selectedPlan: input.selectedPlan,
      newImage: input.newImage,
      uploadAttachmentForPoint: input.uploadAttachmentForPoint,
      create: input.create,
      update: input.update,
      onAttachmentsUpdated: input.onAttachmentsUpdated,
      setLoading: input.setLoading,
      setNewImage: input.setNewImage,
    });
  }, [input.newImage]);
}
