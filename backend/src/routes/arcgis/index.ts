import { Router } from "express";
import {
  handleArcgisGetProxy,
  handleArcgisTokenRequest,
} from "./arcgisRouteHandlers";

const router = Router();

router.get("/token", (req, res) => handleArcgisTokenRequest(req, res));
router.get("/proxy", (req, res) => handleArcgisGetProxy(req, res));

export default router;
