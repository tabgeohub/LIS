import { pool } from "../../db";
import { createStatusUpdateHandler } from "../../helpers/http/createStatusUpdateHandler";

export const editPointStatus = createStatusUpdateHandler({
  runQuery: (id, status) =>
    pool.query(
      `
      UPDATE lis.points SET
        status = $1
      WHERE id = $2
      RETURNING *;
    `,
      [status, id]
    ),
  config: {
    notFoundMessage: "Aandachtspunt niet gevonden",
    successMessage: "Aandachtspunt succesvol bijgewerkt",
    logLabel: "Error updating point status:",
    errorMessage: "Failed to update point status:",
  },
});
