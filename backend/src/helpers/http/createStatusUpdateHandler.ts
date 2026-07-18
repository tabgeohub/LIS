import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
  runStatusUpdate,
  type RunStatusUpdateInput,
} from "./runReturningUpdate";

type StatusUpdateHandlerConfig = {
  runQuery: (id: unknown, status: unknown) => Promise<QueryResult>;
  config: RunStatusUpdateInput["config"];
};

/** Shared Express handler for body `{ id, status }` returning-update routes. */
export function createStatusUpdateHandler(options: StatusUpdateHandlerConfig) {
  return async (req: Request, res: Response): Promise<void> => {
    const { id, status } = req.body;
    await runStatusUpdate({
      res,
      id,
      runQuery: () => options.runQuery(id, status),
      config: options.config,
    });
  };
}
