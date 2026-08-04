import {
  buildLogEntry,
  type LogActionInput,
  type LogContext,
} from "./logEntry";
import { enqueueLogEntry } from "./logQueue";

export function createLogActionHandler(context: LogContext) {
  return (input: LogActionInput) =>
    enqueueLogEntry(buildLogEntry(input, context));
}
