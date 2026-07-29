import { attachmentDisplayUrl } from "@helpers/arcgis/attachmentDisplayUrl";
import type { AttachmentType } from "Types/finished_plans";

export default function PlanAttachmentGrid({
  attachments,
  onImageClick,
}: {
  attachments: AttachmentType[];
  onImageClick: (index: number) => void;
}) {
  return (
    <div className="space-y-2 mt-4">
      <label className="text-sm font-medium text-gray-700">Foto's</label>
      <div className="grid grid-cols-2 gap-2">
        {attachments.map((attachment, index) => (
          <img
            key={attachment.id}
            src={attachmentDisplayUrl(attachment.url)}
            alt={`Attachment ${attachment.id}`}
            className="object-cover aspect-square cursor-pointer hover:scale-105 transition-all rounded shadow-md"
            onClick={() => onImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
