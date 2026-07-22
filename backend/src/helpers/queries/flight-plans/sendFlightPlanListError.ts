import type { Response } from "express";

type FlightPlanListResolvedErrorOptions = {
  errorLogLabel: string;
  errorMessage: string;
  appendErrorToMessage: boolean;
  includeErrorField: boolean;
};

function buildFlightPlanErrorMessage(
  errorMessage: string,
  errText: string,
  appendErrorToMessage: boolean
): string {
  if (!appendErrorToMessage) return errorMessage;
  const sep = errorMessage.endsWith(":") ? " " : ": ";
  return `${errorMessage}${sep}${errText}`;
}

export function sendFlightPlanListError(
  input: {
    res: Response;
    err: unknown;
  } & FlightPlanListResolvedErrorOptions
): void {
  const errText = input.err instanceof Error ? input.err.message : String(input.err);
  console.error(input.errorLogLabel, errText);
  input.res.status(500).json({
    result: null,
    message: buildFlightPlanErrorMessage(
      input.errorMessage,
      errText,
      input.appendErrorToMessage
    ),
    ...(input.includeErrorField ? { error: errText } : {}),
  });
}
