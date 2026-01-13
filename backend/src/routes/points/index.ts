import { Router } from "express";
import { createPoint } from "./createPoint";
import { getPoints } from "./getPoints";
import { editPoint } from "./editPoint";
import { getPrepreparedFlightPlanPoints } from "./getPrePreparedPlanPoints";
import { deletePoint } from "./deletePoint";
import { getFlightPlansByPoint } from "./getFlightPlansByPoint";
import { getSearchedPoints } from "./getSearchedPoints";
import { getPointsDescription } from "./getPointsDescription";
import { createPointFromImport } from "./createPointFromImport";
import { editPointStatus } from "./editPointStatus";

const router = Router();

// Post
router.post("/", createPoint);
router.post("/import", createPointFromImport);

// Get
router.get("/", getPoints);
router.get("/:id", getPrepreparedFlightPlanPoints);

// Get by point
router.get("/flightPlans/:pointId", getFlightPlansByPoint);
router.get("/searchedPoints/:omschrijving", getSearchedPoints);
router.get("/duplicatePoints/:omschrijving", getPointsDescription);

// Update
router.patch("/:id", editPoint);
router.patch("/:id/status", editPointStatus);

// Delete
router.delete("/:id", deletePoint);

export default router;
