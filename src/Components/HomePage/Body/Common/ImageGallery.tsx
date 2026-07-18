import { useMemo } from "react";
import { AttachmentType } from "Types/finished_plans";
import { attachmentDisplayUrl } from "@helpers/arcgis/attachmentDisplayUrl";
import { useImageGalleryPreload } from "./useImageGalleryPreload";
import { ImageGalleryToolbar } from "./ImageGalleryToolbar";
import { ImageGalleryLightModal } from "./ImageGalleryLightModal";

const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default function ImageGallery({
  isOpen,
  setIsOpen,
  attachments,
  activeIndex,
  setActiveIndex,
  onDelete,
  onShowLocation,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  attachments: AttachmentType[];
  activeIndex: number;
  setActiveIndex: (value: number | ((prev: number) => number)) => void;
  onDelete?: (attachmentId: number) => void;
  onShowLocation?: (location: string) => void;
}) {
  const mainImageUrl = useMemo(
    () =>
      attachments[activeIndex]
        ? attachmentDisplayUrl(attachments[activeIndex].url)
        : "",
    [attachments, activeIndex]
  );
  useImageGalleryPreload(isOpen, attachments, activeIndex);

  if (attachments.length === 0) return null;

  const prevImage = () =>
    setActiveIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1));
  const nextImage = () =>
    setActiveIndex((prev) =>
      prev === attachments.length - 1 ? 0 : prev + 1
    );
  const handleDelete = () => {
    const attachmentToDelete = attachments[activeIndex];
    if (onDelete && attachmentToDelete) onDelete(attachmentToDelete.id);
  };

  return (
    <ImageGalleryLightModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 z-[100000] max-w-none w-screen h-screen p-0 rounded-none overflow-hidden flex flex-col bg-white">
        <div className="relative flex-1 flex overflow-hidden">
          {attachments.length > 1 && (
            <div className="w-[120px] bg-white border-r overflow-y-auto py-4 px-2 space-y-2">
              {attachments.map((attachment, index) => (
                <img
                  key={attachment.id}
                  src={attachmentDisplayUrl(attachment.url)}
                  alt={String(attachment.id)}
                  loading="lazy"
                  onClick={() => setActiveIndex(index)}
                  className={`h-[80px] w-full object-cover aspect-square cursor-pointer rounded border-2 transition-all ${
                    index === activeIndex
                      ? "border-blue-500 scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
          <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
            <ImageGalleryToolbar
              attachments={attachments}
              activeIndex={activeIndex}
              onClose={() => setIsOpen(false)}
              onDelete={onDelete ? handleDelete : undefined}
              onShowLocation={onShowLocation}
            />
            {attachments.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full shadow-md transition-all z-50"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full shadow-md transition-all z-50"
                  aria-label="Next image"
                >
                  <ChevronRightIcon />
                </button>
              </>
            )}
            {mainImageUrl && (
              <img
                src={mainImageUrl}
                alt={`Attachment ${attachments[activeIndex].id}`}
                className="max-w-full max-h-full object-contain"
                draggable={false}
              />
            )}
            {attachments.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded">
                {activeIndex + 1} / {attachments.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </ImageGalleryLightModal>
  );
}
