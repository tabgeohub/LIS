import { Response } from "undici";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type HttpErrorStatusInput = {
  err: unknown;
  min: number;
  max: number;
};

export function isHttpErrorWithStatus(input: HttpErrorStatusInput) {
  const { err, min, max } = input;
  return err instanceof HttpError && err.status >= min && err.status <= max;
}

export async function readJsonResponse<T>(
  res: Response,
  label: string
): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    throw new HttpError(
      res.status,
      `${label} HTTP ${res.status}: ${text.slice(0, 500)}`
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${label} response not JSON: ${text.slice(0, 200)}`);
  }
}
