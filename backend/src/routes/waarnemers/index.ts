import { Router } from "express";
import { getAllWaarnemers } from "./getAllWaarnemers";
import { createWaarnemer } from "./createWaarnemer";
import { updateWaarnemer } from "./updateWaarnemer";
import { deleteWaarnemer } from "./deleteWaarnemer";

/**
 * @openapi
 * tags:
 *   - name: Waarnemers
 *     description: Waarnemers management CRUD (regio-scoped)
 */
const router = Router();

router.get("/", getAllWaarnemers);
router.post("/", createWaarnemer);
router.patch("/:id", updateWaarnemer);
router.delete("/:id", deleteWaarnemer);

export default router;
