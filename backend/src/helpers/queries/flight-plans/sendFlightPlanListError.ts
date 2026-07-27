import type { Response } from "express";

type FlightPlanListResolvedErrorOptions = {
  errorLogLabel: string;
  errorMessage: string;
  appendErrorToMessage: boolean;
  includeErrorField: boolean;
};

function buildFlightPlanErrorMessage(input: {
  errorMessage: string;
  errText: string;
  appendErrorToMessage: boolean;
}): string {
  if (!input.appendErrorToMessage) return input.errorMessage;
  const sep = input.errorMessage.endsWith(":") ? " " : ": ";
  return `${input.errorMessage}${sep}${input.errText}`;
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
    message: buildFlightPlanErrorMessage({
      errorMessage: input.errorMessage,
      errText,
      appendErrorToMessage: input.appendErrorToMessage,
    }),
    ...(input.includeErrorField ? { error: errText } : {}),
  });
}
