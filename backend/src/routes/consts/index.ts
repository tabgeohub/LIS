import { Router } from "express";
import { getActiviteiten } from "./getActiviteiten";
import { getOrganisaties } from "./getOrganisaties";
import { getPiloten } from "./getPiloten";
import { getRegios } from "./getRegios";
import { getWaarnemers } from "./getWaarnemers";
import { getLuchtvaartuig } from "./getLuchtvaartuig";

const router = Router();

router.get("/activiteiten", getActiviteiten);
router.get("/organisaties", getOrganisaties);
router.get("/piloten", getPiloten);
router.get("/regios", getRegios);
router.get("/waarnemers", getWaarnemers);
router.get("/luchtvaartuig", getLuchtvaartuig);

export default router;
