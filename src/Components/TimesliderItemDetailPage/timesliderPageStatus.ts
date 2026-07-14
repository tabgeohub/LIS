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

  const plansEmptyHint = resolvePlansEmptyHint(input);
  const emptyMain = resolveEmptyMainMessage(input);

  return { blockImages, plansEmptyHint, emptyMain };
}

function resolvePlansEmptyHint(input: TimesliderPageStatusInput) {
  if (input.invalidQuery) return input.queryError ?? undefined;
  if (input.needsAuth) return "Log in om plannen te laden.";
  return input.plansError ?? undefined;
}

function resolveEmptyMainMessage(input: TimesliderPageStatusInput) {
  if (input.invalidQuery) return input.queryError ?? "Ongeldige link.";
  if (input.needsAuth) return "Log in om afbeeldingen te bekijken.";
  if (input.plansError) return input.plansError;
  if (input.noPlansInRange) return "Geen voltooide plannen in deze periode.";
  if (input.noMatchingPlans) {
    return "Dit item komt niet voor in de plannen van deze periode.";
  }
  if (!input.imagesLoading && input.imagesLength === 0) {
    return "Geen afbeeldingen voor deze selectie.";
  }
  return null;
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
