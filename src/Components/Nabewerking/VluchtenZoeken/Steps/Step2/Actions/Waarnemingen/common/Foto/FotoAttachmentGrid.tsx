import ImageGallery from "Components/Common/ImageGallery";
import { MdLocationOn } from "react-icons/md";
import { attachmentDisplayUrl } from "@helpers/arcgis/attachmentDisplayUrl";
import { AttachmentType } from "Types/finished_plans";
import FotoEmptyState from "./FotoEmptyState";

export default function FotoAttachmentGrid(input: {
  validAttachments: AttachmentType[];
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  onDelete: (attachmentId: number) => void;
  onShowLocation: (location: string | null | undefined) => void;
}) {
  if (input.validAttachments.length === 0) {
    return <FotoEmptyState />;
  }

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {input.validAttachments
        .sort((a, b) => a.taken_at - b.taken_at)
        .map((attachment, index) => (
          <div key={attachment.id} className="relative group">
            <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-20 shadow-lg">
              {index + 1}
            </div>
            <img
              src={attachmentDisplayUrl(attachment.url)}
              alt={String(attachment.id)}
              onClick={() => {
                input.setActiveIndex(index);
                input.setIsOpen(true);
              }}
              className="object-cover aspect-square cursor-pointer hover:scale-105 transition-all rounded shadow-md w-full"
            />
            {attachment.location && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  input.onShowLocation(attachment.location);
                }}
                className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                title="Show location on map"
              >
                <MdLocationOn className="size-4" />
              </button>
            )}
          </div>
        ))}

      <ImageGallery
        isOpen={input.isOpen}
        setIsOpen={input.setIsOpen}
        attachments={input.validAttachments}
        activeIndex={input.activeIndex}
        setActiveIndex={input.setActiveIndex}
        onDelete={input.onDelete}
        onShowLocation={input.onShowLocation}
      />
    </div>
  );
}
