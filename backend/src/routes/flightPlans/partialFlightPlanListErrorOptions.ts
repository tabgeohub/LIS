/** Shared error options for partial/prepared flight-plan list routes. */
export const PARTIAL_FLIGHT_PLAN_LIST_ERROR_OPTIONS = {
  errorMessage: "Failed to fetch partial flight plans",
  appendErrorToMessage: false,
  includeErrorField: true,
} as const;
