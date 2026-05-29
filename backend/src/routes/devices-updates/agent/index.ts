import { Router } from "express";
import { requireDeviceToken } from "../middleware";
import { registerAgent } from "./registerAgent";
import { getAgentCommands } from "./getAgentCommands";
import { reportAgentStatus } from "./reportAgentStatus";

const router = Router();

router.post("/register", registerAgent);
router.get("/commands", requireDeviceToken, getAgentCommands);
router.post("/report", requireDeviceToken, reportAgentStatus);

export default router;
