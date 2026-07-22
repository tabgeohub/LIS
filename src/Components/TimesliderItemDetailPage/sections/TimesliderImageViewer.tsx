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

function whenShowing<T>(input: {
  showImages: boolean;
  value: T;
  fallback: T;
}): T {
  return input.showImages ? input.value : input.fallback;
}

function buildImageIndex(input: {
  showImages: boolean;
  imagesLength: number;
  safeIndex: number;
}) {
  if (!input.showImages || input.imagesLength === 0) return undefined;
  return { current: input.safeIndex + 1, total: input.imagesLength };
}

function buildGalleryToggle(input: {
  showImages: boolean;
  selectedAttachment: AttachmentType | null;
  galleryOpen: boolean;
  onToggleGallery: () => void;
}) {
  if (!input.showImages || !input.selectedAttachment) return undefined;
  return { open: input.galleryOpen, onToggle: input.onToggleGallery };
}

function buildMainImageProps(input: TimesliderImageViewerProps & {
  showImages: boolean;
}) {
  const { showImages } = input;
  return {
    attachment: whenShowing({
      showImages,
      value: input.selectedAttachment,
      fallback: null,
    }),
    plansLoading: input.plansLoading,
    loading: showImages && input.imagesLoading,
    error: whenShowing({
      showImages,
      value: input.imagesError,
      fallback: null,
    }),
    emptyMessage: input.emptyMain,
    imageNav: input.imageNav,
    imageIndex: buildImageIndex({
      showImages,
      imagesLength: input.images.length,
      safeIndex: input.safeIndex,
    }),
    galleryToggle: buildGalleryToggle({
      showImages,
      selectedAttachment: input.selectedAttachment,
      galleryOpen: input.galleryOpen,
      onToggleGallery: input.onToggleGallery,
    }),
  };
}

export default function TimesliderImageViewer(props: TimesliderImageViewerProps) {
  const showImages = !props.blockImages;
  const showGallery = showImages && props.galleryOpen;
  const mainImageProps = buildMainImageProps({ ...props, showImages });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <MainImageSection {...mainImageProps} />
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
            images={showImages ? props.images : []}
            selectedIndex={props.selectedIndex}
            onSelect={props.setSelectedIndex}
            loading={showImages && props.imagesLoading}
          />
        </div>
      </motion.div>
    </div>
  );
}
