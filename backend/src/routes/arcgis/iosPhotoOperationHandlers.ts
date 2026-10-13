import express, { type Request, type Response } from "express";
import multer from "multer";
import { mapMulterError } from "../../helpers/uploads/multerErrorMessage";
import { MULTER_SECURITY_LIMITS } from "../../helpers/uploads/multerSecurityLimits";
import { resolvePlanPrincipal } from "../flightPlans/planAccess";
import { MAX_PHOTO_BYTES, readPhotoOperation, reconcileOrCreatePhoto, validatePhotoOperationInput } from "./iosPhotoOperations";

const configuredLimit = MAX_PHOTO_BYTES;
const upload = multer({ storage: multer.memoryStorage(), limits: { ...MULTER_SECURITY_LIMITS, files: 1, parts: 8, fileSize: configuredLimit || 1 },
  fileFilter: (_req, file, cb) => cb(null, ["image/jpeg", "image/png", "image/heic"].includes(file.mimetype)) });

export function iosPhotoUploadMiddleware(req: Request, res: Response, next: express.NextFunction): void {
  if (req.is("application/json")) { next(); return; }
  upload.single("evidence")(req, res, (error) => {
    if (error) { res.status(400).json({ code: "IOS_PHOTO_UPLOAD_INVALID", message: mapMulterError(error) }); return; }
    next();
  });
}

function metadata(req: Request): unknown {
  try { return typeof req.body?.metadata === "string" ? JSON.parse(req.body.metadata) : req.body?.metadata || req.body; }
  catch { return null; }
}
export async function postPhotoOperation(req: Request, res: Response): Promise<void> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "ARCGIS_IDENTITY_UNAVAILABLE", message: "A Keycloak identity is required" }); return; }
  const input = validatePhotoOperationInput(metadata(req), req.file?.buffer);
  if (!input || input.operation_key !== req.params.operationKey || (input.phase === "attachment" && req.file?.mimetype !== input.mime_type)) { res.status(400).json({ code: "PHOTO_OPERATION_INVALID", message: "Invalid photo operation metadata or evidence" }); return; }
  try {
    const result = await reconcileOrCreatePhoto(input, principal);
    res.status(result.httpStatus).json({ operation_key: input.operation_key, ...result });
  } catch { res.status(503).json({ code: "PHOTO_OPERATION_UNAVAILABLE", message: "Photo operation could not be reconciled" }); }
}
export async function getPhotoOperation(req: Request, res: Response): Promise<void> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "ARCGIS_IDENTITY_UNAVAILABLE", message: "A Keycloak identity is required" }); return; }
  const context = typeof req.headers["x-lis-recovery-context"] === "string" ? req.headers["x-lis-recovery-context"] : undefined;
  try {
  const result = await readPhotoOperation(req.params.operationKey, principal, undefined, context);
  if (!result) { res.status(404).json({ code: "PHOTO_OPERATION_NOT_FOUND", message: "Photo operation was not found" }); return; }
  res.status(result.httpStatus).json({ operation_key: req.params.operationKey, ...result });
  } catch { res.status(503).json({ code: "PHOTO_READBACK_UNAVAILABLE", message: "Photo readback inconclusive" }); }
}
