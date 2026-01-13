import { Router } from "express";
import { createLogs } from "./createLogs";
import { podLogs } from "./podLogs";

const router = Router();

router.post("/", createLogs);

router.post("/podLogs", podLogs);

export default router;
