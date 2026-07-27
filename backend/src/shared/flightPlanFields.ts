/** Core persistence field names shared by FE pick/merge and BE update normalize. */
export const FLIGHT_PLAN_PERSISTENCE_FIELD_NAMES = [
  "omschrijving",
  "waarnemer",
  "piloot",
  "datum",
  "vliegduur",
  "luchtvaartuig",
  "passagiers",
  "hoofdthema",
  "aanvullende",
] as const;

/** Full BE update-column list (persistence fields + plan identity / status). */
export const FLIGHT_PLAN_UPDATE_COLUMNS = [
  "vluchtnummer",
  ...FLIGHT_PLAN_PERSISTENCE_FIELD_NAMES,
  "points",
  "status",
] as const;
