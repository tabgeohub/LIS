import { useCreateImageBtnModel } from "./useCreateImageBtnModel";
import { CreateImageBtnView } from "./CreateImageBtnView";
import type {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";

export default function CreateImageBtn(props: {
  setLoading: (value: boolean) => void;
  attachmentPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  fileInputId: string;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
}) {
  const { onFileChange } = useCreateImageBtnModel(props);
  return (
    <CreateImageBtnView
      fileInputId={props.fileInputId}
      onFileChange={onFileChange}
    />
  );
}
