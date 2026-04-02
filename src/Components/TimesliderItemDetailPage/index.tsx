import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeaderSection from "./sections/HeaderSection";
import PlansFilterSection from "./sections/PlansFilterSection";
import MainImageSection from "./sections/MainImageSection";
import ImagesSelectionSection from "./sections/ImagesSelectionSection";
import LoginRequiredModal from "./sections/LoginRequiredModal";
import { useTimesliderImagePageData } from "./useTimesliderImagePageData";

export default function TimesliderItemDetailPage() {
  const [plansSectionVisible, setPlansSectionVisible] = useState(false);

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
              className="absolute inset-x-0 top-0 z-30 max-h-[min(45vh,15rem)] overflow-y-auto rounded-b-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            >
              <PlansFilterSection
                plans={
                  invalidQuery || needsAuth || plansError ? [] : filteredPlans
                }
                selectedPlanId={selectedPlan?.id ?? null}
                onSelectPlan={setSelectedPlan}
                loading={allPlansLoading}
                emptyHint={plansEmptyHint}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
          />
        </div>
        <ImagesSelectionSection
          images={blockImages ? [] : images}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          loading={!blockImages && imagesLoading}
        />
      </div>

      <LoginRequiredModal open={needsAuth} />
    </div>
  );
}
