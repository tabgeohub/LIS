import { Router } from "express";
import { createGeometry } from "./createGeometry";
import { getSingleGeometry } from "./getSingleGeometry";
import { getGeometries } from "./getGeometries";
import { deleteGeometry } from "./deleteGeometry";

const router = Router();

// Post
router.post("/", createGeometry);

// Get all geometries (with optional regio filter)
router.get("/", getGeometries);

// Get single geometry
router.get("/:geometry_id", getSingleGeometry);

// Delete geometry
router.delete("/:id", deleteGeometry);

export default router;

