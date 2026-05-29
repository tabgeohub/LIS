import { Router } from "express";
import { requireSessionAuth } from "../../helpers/requireSessionAuth";
import agentRouter from "./agent";
import { requireAdmin } from "./middleware";
import { getDevices } from "./getDevices";
import { checkDeviceStatus } from "./checkDeviceStatus";
import { triggerDeviceUpdate } from "./triggerDeviceUpdate";

const router = Router();

router.use("/agent", agentRouter);
router.use(requireSessionAuth);

router.get("/devices", requireAdmin, getDevices);
router.post("/devices/:id/check-status", requireAdmin, checkDeviceStatus);
router.post("/devices/:id/update", requireAdmin, triggerDeviceUpdate);

export default router;
