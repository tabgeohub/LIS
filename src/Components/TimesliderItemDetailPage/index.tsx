import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeaderSection from "./sections/HeaderSection";
import PlansFilterSection from "./sections/PlansFilterSection";
import MainImageSection from "./sections/MainImageSection";
import ImagesSelectionSection from "./sections/ImagesSelectionSection";
import LoginRequiredModal from "./sections/LoginRequiredModal";
import { useTimesliderImagePageData } from "./useTimesliderImagePageData";

const GALLERY_HEIGHT_PX = 144; // matches Tailwind h-36 (thumbnail strip)

export default function TimesliderItemDetailPage() {
  const [plansSectionVisible, setPlansSectionVisible] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(true);

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
  } = useTimesliderImagePageData();

  const headerItemName = invalidQuery
    ? queryError ?? "Ongeldige link"
    : displayTitle || "—";

  const onMeerDatumsBekijken = () => {
    setPlansSectionVisible((visible) => !visible);
  };

  const plansEmptyHint = invalidQuery
    ? queryError ?? undefined
    : needsAuth
      ? "Log in om plannen te laden."
      : plansError ?? undefined;

  const blockImages =
    invalidQuery ||
    needsAuth ||
    !!plansError ||
    noPlansInRange ||
    noMatchingPlans ||
    allPlansLoading;

  const emptyMain = invalidQuery
    ? (queryError ?? "Ongeldige link.")
    : needsAuth
      ? "Log in om afbeeldingen te bekijken."
      : plansError
        ? plansError
        : noPlansInRange
          ? "Geen voltooide plannen in deze periode."
          : noMatchingPlans
            ? "Dit item komt niet voor in de plannen van deze periode."
            : !imagesLoading && images.length === 0
              ? "Geen afbeeldingen voor deze selectie."
              : null;

  const selectedAttachment =
    !blockImages && images.length > 0
      ? images[Math.min(selectedIndex, images.length - 1)] ?? null
      : null;

  const safeIndex = Math.min(
    selectedIndex,
    Math.max(0, images.length - 1)
  );
  const imageNav =
    !blockImages && images.length > 1
      ? {
          canGoPrevious: safeIndex > 0,
          canGoNext: safeIndex < images.length - 1,
          onPrevious: () => setSelectedIndex((i) => Math.max(0, i - 1)),
          onNext: () =>
            setSelectedIndex((i) => Math.min(images.length - 1, i + 1)),
        }
      : undefined;

  return (
    <div className="flex h-screen min-h-0 flex-col bg-gray-100 text-gray-900">
      <HeaderSection
        itemName={headerItemName}
        vluchtnummer={
          invalidQuery ? null : (selectedPlan?.vluchtnummer ?? null)
        }
        dateFrom={from}
        dateTo={to}
        onAllPlansClick={onMeerDatumsBekijken}
      />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence>
          {plansSectionVisible && (
            <motion.div
              key="timeslider-plans-overlay"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-x-0 top-0 z-30 max-h-[min(45vh,15rem)] overflow-y-auto rounded-b-lg bg-gray-50 px-3 pb-2 pt-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            >
              <PlansFilterSection
                plans={
                  invalidQuery || needsAuth || plansError ? [] : filteredPlans
                }
                selectedPlanId={selectedPlan?.id ?? null}
                onSelectPlan={setSelectedPlan}
                loading={allPlansLoading}
                emptyHint={plansEmptyHint}
                firstImageUrlByPlanId={firstImageUrlByPlanId}
                imagesLoading={imagesLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <MainImageSection
            attachment={blockImages ? null : selectedAttachment}
            plansLoading={allPlansLoading}
            loading={!blockImages && imagesLoading}
            error={!blockImages ? imagesError : null}
            emptyMessage={emptyMain}
            imageNav={imageNav}
            imageIndex={
              !blockImages && images.length > 0
                ? { current: safeIndex + 1, total: images.length }
                : undefined
            }
            galleryToggle={
              !blockImages && selectedAttachment
                ? {
                    open: galleryOpen,
                    onToggle: () => setGalleryOpen((o) => !o),
                  }
                : undefined
            }
          />
          <motion.div
            initial={false}
            animate={{
              height:
                !blockImages && galleryOpen ? GALLERY_HEIGHT_PX : 0,
              opacity: !blockImages && galleryOpen ? 1 : 0,
            }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className={`absolute bottom-2 left-2 right-2 z-20 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_-6px_24px_rgba(0,0,0,0.12)] ${
              !blockImages && galleryOpen
                ? "pointer-events-auto"
                : "pointer-events-none"
            }`}
          >
            <div className="h-36">
              <ImagesSelectionSection
                images={blockImages ? [] : images}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                loading={!blockImages && imagesLoading}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <LoginRequiredModal open={needsAuth} />
    </div>
  );
}
