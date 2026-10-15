import { Router } from "express";

import { getFlightPlanById } from "./getFlightPlanById";
import { getAllFlightPlans } from "./getAllFlightPlans";
import { createFlightPlan } from "./createFlightPlan";
import { getFlighPlansNummer } from "./getFlighPlansNummer";
import { updateVluchtPlan } from "./updateVluchtPlan";
import { getPrepreparedFlightPlans } from "./getPrepreparedFlightPlans";
import { updateFlightPlanStatus } from "./updateFlightPlanStatus";
import { updateVluchtPlanPoints } from "./updateVluchtPlanPoints";
import { getUnPreparedPlans } from "./getUnPreparedPlans";
import { deleteFlightPlan } from "./deleteFlightPlan";
import { getPreparedFlightPlans } from "./getPreparedFlightPlans";
import { getFullPreparedFlightPlans } from "./getFullPreparedFlightPlans";
import { getSearchedFlightPlans } from "./getSearchedFlightPlans";

const router = Router();

// Get
router.get("/flightplan/:id", getFlightPlanById);
router.get("/searchedFlightplan", getSearchedFlightPlans);
router.get("/", getAllFlightPlans);
router.get("/prepreparedFlightPlans", getPrepreparedFlightPlans);
router.get("/vluchtnummer/:vluchtnummer", getFlighPlansNummer);
router.get("/unPreparedPlans", getUnPreparedPlans);
router.get("/preparedFlighPlans", getPreparedFlightPlans);
router.get("/fullPreparedFlightPlans", getFullPreparedFlightPlans);

// Delete
router.delete("/:id", deleteFlightPlan);

// Post
router.post("/", createFlightPlan);

// Patch
router.patch("/vluchtplans", updateVluchtPlan);
router.patch("/updateFlightPlanStatus", updateFlightPlanStatus);
router.patch("/vluchtplans/points", updateVluchtPlanPoints);

export default router;
