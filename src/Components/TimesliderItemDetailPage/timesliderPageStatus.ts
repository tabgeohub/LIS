type TimesliderPageStatusInput = {
  invalidQuery: boolean;
  queryError: string | null;
  needsAuth: boolean;
  plansError: string | null;
  noPlansInRange: boolean;
  noMatchingPlans: boolean;
  allPlansLoading: boolean;
  imagesLoading: boolean;
  imagesLength: number;
};

export function buildTimesliderPageStatus(input: TimesliderPageStatusInput) {
  const blockImages =
    input.invalidQuery ||
    input.needsAuth ||
    !!input.plansError ||
    input.noPlansInRange ||
    input.noMatchingPlans ||
    input.allPlansLoading;

  const plansEmptyHint = input.invalidQuery
    ? input.queryError ?? undefined
    : input.needsAuth
      ? "Log in om plannen te laden."
      : input.plansError ?? undefined;

  const emptyMain = input.invalidQuery
    ? (input.queryError ?? "Ongeldige link.")
    : input.needsAuth
      ? "Log in om afbeeldingen te bekijken."
      : input.plansError
        ? input.plansError
        : input.noPlansInRange
          ? "Geen voltooide plannen in deze periode."
          : input.noMatchingPlans
            ? "Dit item komt niet voor in de plannen van deze periode."
            : !input.imagesLoading && input.imagesLength === 0
              ? "Geen afbeeldingen voor deze selectie."
              : null;

  return { blockImages, plansEmptyHint, emptyMain };
}

export function buildImageNavigation(input: {
  blockImages: boolean;
  imagesLength: number;
  selectedIndex: number;
  setSelectedIndex: (value: number | ((prev: number) => number)) => void;
}) {
  const safeIndex = Math.min(
    input.selectedIndex,
    Math.max(0, input.imagesLength - 1)
  );

  const imageNav =
    !input.blockImages && input.imagesLength > 1
      ? {
          canGoPrevious: safeIndex > 0,
          canGoNext: safeIndex < input.imagesLength - 1,
          onPrevious: () => input.setSelectedIndex((i) => Math.max(0, i - 1)),
          onNext: () =>
            input.setSelectedIndex((i) =>
              Math.min(input.imagesLength - 1, i + 1)
            ),
        }
      : undefined;

  return { safeIndex, imageNav };
}
