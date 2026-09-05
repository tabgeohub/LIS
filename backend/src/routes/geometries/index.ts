import { Router } from "express";
import { createGeometry } from "./createGeometry";
import { getSingleGeometry } from "./getSingleGeometry";
import { getGeometries } from "./getGeometries";
import { deleteGeometry } from "./deleteGeometry";
import { updateGeometry } from "./updateGeometry";

/**
 * @openapi
 * tags:
 *   - name: Geometries
 *     description: Aandachtspunt geometries (create, list, update, delete)
 */
const router = Router();

router.post("/", createGeometry);
router.get("/", getGeometries);
router.patch("/:id", updateGeometry);
router.get("/:geometry_id", getSingleGeometry);
router.delete("/:id", deleteGeometry);

export default router;
