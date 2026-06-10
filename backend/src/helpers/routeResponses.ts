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

export function okResult(
  res: Response,
  result: unknown,
  message: string,
  status = 200
): void {
  res.status(status).json({ result, message });
}

export function created(res: Response, result: unknown, message: string): void {
  okResult(res, result, message, 201);
}

export function serverError(
  res: Response,
  logLabel: string,
  message: string,
  err: unknown
): void {
  console.error(
    logLabel,
    err instanceof Error ? err.message : String(err)
  );
  res.status(500).json({ result: null, message });
}
