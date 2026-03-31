import { useCallback } from "react";
import HeaderSection from "./sections/HeaderSection";
import PlansFilterSection from "./sections/PlansFilterSection";
import MainImageSection from "./sections/MainImageSection";
import ImagesSelectionSection from "./sections/ImagesSelectionSection";
import { useTimesliderImagePageData } from "./useTimesliderImagePageData";

const PLANS_SECTION_ID = "timeslider-item-plans";

export default function TimesliderItemDetailPage() {
  const {
    queryError,
    invalidQuery,
    from,
    to,
    displayTitle,
    filteredPlans,
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

  const scrollToPlans = useCallback(() => {
    document
      .getElementById(PLANS_SECTION_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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

  return (
    <div className="flex h-screen min-h-0 flex-col bg-gray-100 text-gray-900">
      <HeaderSection
        itemName={headerItemName}
        dateFrom={from}
        dateTo={to}
        onAllPlansClick={scrollToPlans}
      />
      <PlansFilterSection
        plans={invalidQuery || needsAuth || plansError ? [] : filteredPlans}
        loading={allPlansLoading}
        emptyHint={plansEmptyHint}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <MainImageSection
          attachment={blockImages ? null : selectedAttachment}
          plansLoading={allPlansLoading}
          loading={!blockImages && imagesLoading}
          error={!blockImages ? imagesError : null}
          emptyMessage={emptyMain}
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
