import { Router } from "express";
import { uploadDiagnostics } from "../iosUploadDiagnostics";
import { createLogs } from "./createLogs";
import { podLogs } from "./podLogs";
import { getIOSLogOperation, postIOSLogOperation } from "./iosLogOperationHandlers";

const router = Router();
router.use("/ios", uploadDiagnostics("logs"));

router.post("/", createLogs);
router.post("/ios/operations/:operationKey", postIOSLogOperation);
router.get("/ios/operations/:operationKey", getIOSLogOperation);

router.post("/podLogs", podLogs);

export default router;
