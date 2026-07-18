import type { BuildTimesliderPageShellInput } from "./timesliderPageShellTypes";

type ImageViewerExtras = {
  blockImages: boolean;
  safeIndex: number;
  emptyMain: string | null;
  imageNav:
    | {
        canGoPrevious: boolean;
        canGoNext: boolean;
        onPrevious: () => void;
        onNext: () => void;
      }
    | undefined;
};

/** Image viewer props for the timeslider detail page shell. */
export function buildTimesliderImageViewerProps(
  input: BuildTimesliderPageShellInput,
  extras: ImageViewerExtras
) {
  const d = input.data;
  return {
    blockImages: extras.blockImages,
    images: d.images,
    selectedAttachment:
      !extras.blockImages && d.images.length > 0
        ? (d.images[extras.safeIndex] ?? null)
        : null,
    selectedIndex: d.selectedIndex,
    safeIndex: extras.safeIndex,
    setSelectedIndex: d.setSelectedIndex,
    plansLoading: d.allPlansLoading,
    imagesLoading: d.imagesLoading,
    imagesError: d.imagesError,
    emptyMain: extras.emptyMain,
    imageNav: extras.imageNav,
    galleryOpen: input.galleryOpen,
    onToggleGallery: () => input.setGalleryOpen((open) => !open),
  };
}
