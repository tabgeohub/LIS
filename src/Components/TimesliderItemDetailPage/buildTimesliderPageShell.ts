import {
  buildImageNavigation,
  buildTimesliderPageStatus,
} from "./timesliderPageStatus";
import { buildTimesliderHeaderProps } from "./buildTimesliderHeaderProps";
import { buildTimesliderPlansOverlayProps } from "./buildTimesliderPlansOverlayProps";
import { buildTimesliderImageViewerProps } from "./buildTimesliderImageViewerProps";
import type { BuildTimesliderPageShellInput } from "./timesliderPageShellTypes";

export type { TimesliderImagePageDataSlice } from "./timesliderPageShellTypes";

/** Derive page shell props from image-page data + local UI state. */
export function buildTimesliderPageShell(input: BuildTimesliderPageShellInput) {
  const d = input.data;
  const status = buildTimesliderPageStatus({
    invalidQuery: d.invalidQuery, queryError: d.queryError,
    needsAuth: d.needsAuth, plansError: d.plansError,
    noPlansInRange: d.noPlansInRange, noMatchingPlans: d.noMatchingPlans,
    allPlansLoading: d.allPlansLoading, imagesLoading: d.imagesLoading,
    imagesLength: d.images.length,
  });
  const nav = buildImageNavigation({
    blockImages: status.blockImages,
    imagesLength: d.images.length,
    selectedIndex: d.selectedIndex,
    setSelectedIndex: d.setSelectedIndex,
  });
  return {
    header: buildTimesliderHeaderProps(input),
    plansOverlay: buildTimesliderPlansOverlayProps(input, status.plansEmptyHint),
    imageViewer: buildTimesliderImageViewerProps(input, {
      blockImages: status.blockImages,
      safeIndex: nav.safeIndex,
      emptyMain: status.emptyMain,
      imageNav: nav.imageNav,
    }),
    needsAuth: d.needsAuth,
  };
}
