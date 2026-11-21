import { Request, Response } from "express";
import {
  isAdminRegioValue,
  resolveRegioFilter,
} from "../shared/resolveRegioFilter";

/** Effective regio for writes: admin may use body/query; others locked to session role. */
export function resolveWritableRegioId(
  req: Request,
  requestedRegioId?: unknown
): string | undefined {
  const sessionRegio = resolveRegioFilter(req);

  if (sessionRegio && isAdminRegioValue(sessionRegio)) {
    if (requestedRegioId == null || requestedRegioId === "") {
      return undefined;
    }
    return String(requestedRegioId);
  }

  return sessionRegio;
}

export function forbidIfRegioMismatch(input: {
  res: Response;
  sessionRegio: string | undefined;
  rowRegioId: string | null | undefined;
}): boolean {
  const { res, sessionRegio, rowRegioId } = input;

  if (!sessionRegio || isAdminRegioValue(sessionRegio)) {
    return false;
  }

  if (rowRegioId !== sessionRegio) {
    res.status(403).json({
      result: null,
      message: "Geen toegang tot waarnemers buiten uw regio",
    });
    return true;
  }

  return false;
}
