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

type PlansEmptyHintRule = {
  matches: (input: TimesliderPageStatusInput) => boolean;
  hint: (input: TimesliderPageStatusInput) => string | undefined;
};

const PLANS_EMPTY_HINT_RULES: PlansEmptyHintRule[] = [
  {
    matches: (input) => input.invalidQuery,
    hint: (input) => input.queryError ?? undefined,
  },
  {
    matches: (input) => input.needsAuth,
    hint: () => "Log in om plannen te laden.",
  },
];

function resolvePlansEmptyHint(input: TimesliderPageStatusInput) {
  for (const rule of PLANS_EMPTY_HINT_RULES) {
    if (rule.matches(input)) return rule.hint(input);
  }
  return input.plansError ?? undefined;
}

type EmptyMainRule = {
  matches: (input: TimesliderPageStatusInput) => boolean;
  message: (input: TimesliderPageStatusInput) => string;
};

const EMPTY_MAIN_RULES: EmptyMainRule[] = [
  {
    matches: (input) => input.invalidQuery,
    message: (input) => input.queryError ?? "Ongeldige link.",
  },
  {
    matches: (input) => input.needsAuth,
    message: () => "Log in om afbeeldingen te bekijken.",
  },
  {
    matches: (input) => !!input.plansError,
    message: (input) => input.plansError!,
  },
  {
    matches: (input) => input.noPlansInRange,
    message: () => "Geen voltooide plannen in deze periode.",
  },
  {
    matches: (input) => input.noMatchingPlans,
    message: () => "Dit item komt niet voor in de plannen van deze periode.",
  },
  {
    matches: (input) => !input.imagesLoading && input.imagesLength === 0,
    message: () => "Geen afbeeldingen voor deze selectie.",
  },
];

function resolveEmptyMainMessage(input: TimesliderPageStatusInput) {
  for (const rule of EMPTY_MAIN_RULES) {
    if (rule.matches(input)) return rule.message(input);
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
