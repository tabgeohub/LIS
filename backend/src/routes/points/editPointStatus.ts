import { pool } from "../../db";
import { createStatusUpdateHandler } from "../../helpers/http/createStatusUpdateHandler";
import { updatePointStatus } from "../../helpers/repositories/pointsRepo";

export const editPointStatus = createStatusUpdateHandler({
  runQuery: (id, status) =>
    updatePointStatus(pool, {
      id: id as string | number,
      status: String(status),
    }),
  config: {
    notFoundMessage: "Aandachtspunt niet gevonden",
    successMessage: "Aandachtspunt succesvol bijgewerkt",
    logLabel: "Error updating point status:",
    errorMessage: "Failed to update point status:",
  },
});
