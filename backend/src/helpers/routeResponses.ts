import { Response } from "express";

export const MISSING_FIELDS_MESSAGE = "Verplichte velden ontbreken";
export const MISSING_FIELDS_MESSAGE_WITH_PERIOD = "Verplichte velden ontbreken.";

export function missingFields(
  res: Response,
  message: string = MISSING_FIELDS_MESSAGE
): void {
  res.status(400).json({ result: null, message });
}

export function notFound(res: Response, message: string): void {
  res.status(404).json({ result: null, message });
}

export type OkResultInput = {
  res: Response;
  result: unknown;
  message: string;
  status?: number;
};

export function okResult(input: OkResultInput): void {
  const { res, result, message, status = 200 } = input;
  res.status(status).json({ result, message });
}

export type CreatedInput = {
  res: Response;
  result: unknown;
  message: string;
};

export function created(input: CreatedInput): void {
  okResult({ ...input, status: 201 });
}

export type ServerErrorInput = {
  res: Response;
  logLabel: string;
  message: string;
  err: unknown;
};

export function serverError(input: ServerErrorInput): void {
  const { res, logLabel, message, err } = input;
  console.error(logLabel, err instanceof Error ? err.message : String(err));
  res.status(500).json({ result: null, message });
}
