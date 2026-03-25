import { Router } from "express";
import { createGeometry } from "./createGeometry";
import { getSingleGeometry } from "./getSingleGeometry";
import { getGeometries } from "./getGeometries";
import { deleteGeometry } from "./deleteGeometry";
import { updateGeometry } from "./updateGeometry";

const router = Router();

// Post
router.post("/", createGeometry);

// Get all geometries (with optional regio filter)
router.get("/", getGeometries);

// Update geometry (metadata + optional points)
router.patch("/:id", updateGeometry);

// Get single geometry
router.get("/:geometry_id", getSingleGeometry);

// Delete geometry
router.delete("/:id", deleteGeometry);

export default router;

