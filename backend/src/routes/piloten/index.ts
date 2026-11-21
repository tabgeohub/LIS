import { Router } from "express";
import { getAllPiloten } from "./getAllPiloten";
import { createPiloot } from "./createPiloot";
import { updatePiloot } from "./updatePiloot";
import { deletePiloot } from "./deletePiloot";

/**
 * @openapi
 * tags:
 *   - name: Piloten
 *     description: Piloten management CRUD
 */
const router = Router();

router.get("/", getAllPiloten);
router.post("/", createPiloot);
router.patch("/:id", updatePiloot);
router.delete("/:id", deletePiloot);

export default router;
