import { pool } from "../../db";
import { createStatusUpdateHandler } from "../../helpers/http/createStatusUpdateHandler";
import { updateFlightPlanStatus as updateFlightPlanStatusRow } from "../../helpers/repositories/flightPlansRepo";

export const updateFlightPlanStatus = createStatusUpdateHandler({
  runQuery: (id, status) =>
    updateFlightPlanStatusRow(pool, {
      id: id as string | number,
      status: String(status),
    }),
  config: {
    successMessage: "Status van het vluchtplan succesvol bijgewerkt",
    logLabel: "Fout bij het bijwerken van het vluchtplan:",
    errorMessage: "Bijwerken van het vluchtplan mislukt: Error:",
  },
});
