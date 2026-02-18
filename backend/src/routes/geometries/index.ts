import { Router } from "express";
import { createGeometry } from "./createGeometry";
import { getSingleGeometry } from "./getSingleGeometry";
import { getGeometries } from "./getGeometries";

const router = Router();

// Post
router.post("/", createGeometry);

// Get all geometries (with optional regio filter)
router.get("/", getGeometries);

// Get single geometry
router.get("/:geometry_id", getSingleGeometry);

export default router;

