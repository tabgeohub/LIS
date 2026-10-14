import { Router } from "express";
import { uploadDiagnostics } from "../iosUploadDiagnostics";
import {
  handleArcgisGetProxy,
  handleArcgisIOSCredentialContract,
  handleArcgisTokenRequest,
} from "./arcgisRouteHandlers";
import { getPhotoOperation, iosPhotoUploadMiddleware, postPhotoOperation } from "./iosPhotoOperationHandlers";

const router = Router();
router.use("/ios/photo-operations", uploadDiagnostics("photo"));
router.use("/ios/credential", uploadDiagnostics("capability"));

router.get("/token", (req, res) => handleArcgisTokenRequest(req, res));
router.get("/proxy", (req, res) => handleArcgisGetProxy(req, res));
router.get("/ios/credential", (req, res) => handleArcgisIOSCredentialContract(req, res));
router.get("/ios/photo-operations/:operationKey", getPhotoOperation);
router.post("/ios/photo-operations/:operationKey", iosPhotoUploadMiddleware, postPhotoOperation);

export default router;
