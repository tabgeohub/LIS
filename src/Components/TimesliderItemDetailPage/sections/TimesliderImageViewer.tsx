import { motion } from "framer-motion";
import { AttachmentType } from "Types/finished_plans";
import ImagesSelectionSection from "./ImagesSelectionSection";
import MainImageSection from "./MainImageSection";

const GALLERY_HEIGHT_PX = 144;

type ImageNavigation = {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

type TimesliderImageViewerProps = {
  blockImages: boolean;
  images: AttachmentType[];
  selectedAttachment: AttachmentType | null;
  selectedIndex: number;
  safeIndex: number;
  setSelectedIndex: (index: number) => void;
  plansLoading: boolean;
  imagesLoading: boolean;
  imagesError: string | null;
  emptyMain: string | null;
  imageNav?: ImageNavigation;
  galleryOpen: boolean;
  onToggleGallery: () => void;
};

export default function TimesliderImageViewer({
  blockImages,
  images,
  selectedAttachment,
  selectedIndex,
  safeIndex,
  setSelectedIndex,
  plansLoading,
  imagesLoading,
  imagesError,
  emptyMain,
  imageNav,
  galleryOpen,
  onToggleGallery,
}: TimesliderImageViewerProps) {
  const showImages = !blockImages;
  const showGallery = showImages && galleryOpen;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <MainImageSection
        attachment={showImages ? selectedAttachment : null}
        plansLoading={plansLoading}
        loading={showImages && imagesLoading}
        error={showImages ? imagesError : null}
        emptyMessage={emptyMain}
        imageNav={imageNav}
        imageIndex={
          showImages && images.length > 0
            ? { current: safeIndex + 1, total: images.length }
            : undefined
        }
        galleryToggle={
          showImages && selectedAttachment
            ? { open: galleryOpen, onToggle: onToggleGallery }
            : undefined
        }
      />
      <motion.div
        initial={false}
        animate={{
          height: showGallery ? GALLERY_HEIGHT_PX : 0,
          opacity: showGallery ? 1 : 0,
        }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className={`absolute bottom-2 left-2 right-2 z-20 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_-6px_24px_rgba(0,0,0,0.12)] ${
          showGallery ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="h-36">
          <ImagesSelectionSection
            images={showImages ? images : []}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            loading={showImages && imagesLoading}
          />
        </div>
      </motion.div>
    </div>
  );
}
