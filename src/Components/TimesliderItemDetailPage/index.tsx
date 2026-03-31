import { useCallback, useEffect, useState } from "react";
import HeaderSection from "./sections/HeaderSection";
import PlansFilterSection from "./sections/PlansFilterSection";
import MainImageSection from "./sections/MainImageSection";
import ImagesSelectionSection from "./sections/ImagesSelectionSection";
import { useTimesliderImagePageData } from "./useTimesliderImagePageData";

const PLANS_SECTION_ID = "timeslider-item-plans";

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

  const scrollPlansIntoView = useCallback(() => {
    document
      .getElementById(PLANS_SECTION_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (!plansSectionVisible) return;
    const t = window.setTimeout(() => scrollPlansIntoView(), 0);
    return () => clearTimeout(t);
  }, [plansSectionVisible, scrollPlansIntoView]);

  const onMeerDatumsBekijken = useCallback(() => {
    setPlansSectionVisible((visible) => {
      if (visible) {
        requestAnimationFrame(() => scrollPlansIntoView());
        return visible;
      }
      return true;
    });
  }, [scrollPlansIntoView]);

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
      {plansSectionVisible ? (
        <PlansFilterSection
          plans={invalidQuery || needsAuth || plansError ? [] : filteredPlans}
          selectedPlanId={selectedPlan?.id ?? null}
          onSelectPlan={setSelectedPlan}
          loading={allPlansLoading}
          emptyHint={plansEmptyHint}
        />
      ) : null}
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
  );
}
