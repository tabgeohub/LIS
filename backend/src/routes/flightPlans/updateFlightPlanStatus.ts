import { pool } from "../../db";
import { createStatusUpdateHandler } from "../../helpers/http/createStatusUpdateHandler";

export const updateFlightPlanStatus = createStatusUpdateHandler({
  runQuery: (id, status) =>
    pool.query(`UPDATE lis.flightPlans SET status = $1 WHERE id = $2`, [
      status,
      id,
    ]),
  config: {
    successMessage: "Status van het vluchtplan succesvol bijgewerkt",
    logLabel: "Fout bij het bijwerken van het vluchtplan:",
    errorMessage: "Bijwerken van het vluchtplan mislukt: Error:",
  },
});
