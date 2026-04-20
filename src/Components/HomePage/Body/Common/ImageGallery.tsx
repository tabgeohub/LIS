import { useMemo, useEffect } from "react";
import { AttachmentType } from "Types/finished_plans";

// Lightweight inline SVG icons (replaces react-icons - saves ~80-120 KB)
const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// Lightweight modal (replaces @headlessui/react Modal - saves ~50-100 KB)
function LightModal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div onClick={(e) => e.stopPropagation()} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}

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
  const token = localStorage.getItem("credential_token");

  // Memoize image URLs to avoid recalculating on every render
  const getImageUrl = useMemo(
    () => (url: string) => `${url.split("token=").at(0)}token=${token}`,
    [token]
  );

  const mainImageUrl = useMemo(
    () =>
      attachments[activeIndex] ? getImageUrl(attachments[activeIndex].url) : "",
    [attachments, activeIndex, getImageUrl]
  );

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    if (!isOpen || attachments.length <= 1) return;

    const preloadImage = (url: string) => {
      const img = new Image();
      img.src = url;
    };

    // Preload next image
    const nextIndex = (activeIndex + 1) % attachments.length;
    if (attachments[nextIndex]) {
      preloadImage(getImageUrl(attachments[nextIndex].url));
    }

    // Preload previous image
    const prevIndex =
      (activeIndex - 1 + attachments.length) % attachments.length;
    if (attachments[prevIndex]) {
      preloadImage(getImageUrl(attachments[prevIndex].url));
    }
  }, [isOpen, activeIndex, attachments, getImageUrl]);

  if (attachments.length === 0) return null;

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === attachments.length - 1 ? 0 : prev + 1));
  };

  const handleDelete = () => {
    if (!onDelete || attachments.length === 0) return;

    const attachmentToDelete = attachments[activeIndex];
    if (!attachmentToDelete) return;

    onDelete(attachmentToDelete.id);
  };

  return (
    <LightModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 z-[100000] max-w-none w-screen h-screen p-0 rounded-none overflow-hidden flex flex-col bg-white">
        <div className="relative flex-1 flex overflow-hidden">
          {/* Thumbnails sidebar */}
          {attachments.length > 1 && (
            <div className="w-[120px] bg-white border-r overflow-y-auto py-4 px-2 space-y-2">
              {attachments.map((attachment, index) => (
                <img
                  key={attachment.id}
                  src={getImageUrl(attachment.url)}
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

          {/* Main image area */}
          <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 border-2 border-white text-white p-2 rounded-full transition-all"
              aria-label="Close gallery"
            >
              <CloseIcon />
            </button>

            {/* Show location button - only show if onShowLocation is provided and current image has location */}
            {onShowLocation &&
              attachments[activeIndex]?.location && (
                <button
                  onClick={() => {
                    const location = attachments[activeIndex]?.location;
                    if (location) onShowLocation(location);
                  }}
                  className="absolute top-4 right-20 z-50 bg-blue-500 hover:bg-blue-600 border-2 border-white text-white p-2 rounded-full transition-all"
                  title="Show location on map"
                  aria-label="Show location on map"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}

            {/* Delete button - only show if onDelete is provided */}
            {onDelete && (
              <button
                onClick={handleDelete}
                className={`absolute top-4 z-50 bg-red-500 hover:bg-red-600 border-2 border-white text-white p-2 rounded-full transition-all ${
                  onShowLocation && attachments[activeIndex]?.location
                    ? "right-32"
                    : "right-20"
                }`}
                title="Delete image"
                aria-label="Delete image"
              >
                <TrashIcon />
              </button>
            )}

            {/* Navigation buttons */}
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

            {/* Main image */}
            {mainImageUrl && (
              <img
                src={mainImageUrl}
                alt={`Attachment ${attachments[activeIndex].id}`}
                className="max-w-full max-h-full object-contain"
                draggable={false}
              />
            )}

            {/* Image counter */}
            {attachments.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded">
                {activeIndex + 1} / {attachments.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </LightModal>
  );
}
