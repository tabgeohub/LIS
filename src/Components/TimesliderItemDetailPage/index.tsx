import { useState } from "react";
import HeaderSection from "./sections/HeaderSection";
import LoginRequiredModal from "./sections/LoginRequiredModal";
import TimesliderPlansOverlay from "./sections/TimesliderPlansOverlay";
import TimesliderImageViewer from "./sections/TimesliderImageViewer";
import { useTimesliderImagePageData } from "./useTimesliderImagePageData";
import {
  buildImageNavigation,
  buildTimesliderPageStatus,
} from "./timesliderPageStatus";

export default function TimesliderItemDetailPage() {
  const [plansSectionVisible, setPlansSectionVisible] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(true);

  const data = useTimesliderImagePageData();
  const {
    queryError,
    invalidQuery,
    from,
    to,
    displayTitle,
    filteredPlans,
    selectedPlan,
    setSelectedPlan,
    allPlansLoading,
    plansError,
    needsAuth,
    images,
    imagesLoading,
    imagesError,
    selectedIndex,
    setSelectedIndex,
    noPlansInRange,
    noMatchingPlans,
    firstImageUrlByPlanId,
  } = data;

  const { blockImages, plansEmptyHint, emptyMain } = buildTimesliderPageStatus({
    invalidQuery,
    queryError,
    needsAuth,
    plansError,
    noPlansInRange,
    noMatchingPlans,
    allPlansLoading,
    imagesLoading,
    imagesLength: images.length,
  });

  const { safeIndex, imageNav } = buildImageNavigation({
    blockImages,
    imagesLength: images.length,
    selectedIndex,
    setSelectedIndex,
  });

  const headerItemName = invalidQuery
    ? queryError ?? "Ongeldige link"
    : displayTitle || "—";

  const selectedAttachment =
    !blockImages && images.length > 0
      ? images[safeIndex] ?? null
      : null;

  return (
    <div className="flex h-screen min-h-0 flex-col bg-gray-100 text-gray-900">
      <HeaderSection
        itemName={headerItemName}
        vluchtnummer={invalidQuery ? null : (selectedPlan?.vluchtnummer ?? null)}
        dateFrom={from}
        dateTo={to}
        onAllPlansClick={() => setPlansSectionVisible((visible) => !visible)}
      />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <TimesliderPlansOverlay
          visible={plansSectionVisible}
          blocked={invalidQuery || needsAuth || Boolean(plansError)}
          plans={filteredPlans}
          selectedPlanId={selectedPlan?.id ?? null}
          onSelectPlan={setSelectedPlan}
          loading={allPlansLoading}
          emptyHint={plansEmptyHint}
          firstImageUrlByPlanId={firstImageUrlByPlanId}
          imagesLoading={imagesLoading}
        />
        <TimesliderImageViewer
          blockImages={blockImages}
          images={images}
          selectedAttachment={selectedAttachment}
          selectedIndex={selectedIndex}
          safeIndex={safeIndex}
          setSelectedIndex={setSelectedIndex}
          plansLoading={allPlansLoading}
          imagesLoading={imagesLoading}
          imagesError={imagesError}
          emptyMain={emptyMain}
          imageNav={imageNav}
          galleryOpen={galleryOpen}
          onToggleGallery={() => setGalleryOpen((open) => !open)}
        />
      </div>

      <LoginRequiredModal open={needsAuth} />
    </div>
  );
}
