import type {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";

export type CreateImageUploadInput = {
  attachmentPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType;
  newImage: { image: File | Blob; timestamp: number };
  uploadAttachmentForPoint: (
    pointId: number,
    image: { image: File | Blob; timestamp: number }
  ) => Promise<{ url?: string; objectId?: number; taken_at: number }[]>;
  create: (args: {
    data: Record<string, unknown>;
    onSuccess: (responseData: { result: { id: number; url: string } }) => void;
  }) => void;
  update: (args: { data: Record<string, unknown> }) => void;
  onAttachmentsUpdated: (attachments: AttachmentType[]) => void;
  setLoading: (value: boolean) => void;
  setNewImage: (value: null) => void;
};
