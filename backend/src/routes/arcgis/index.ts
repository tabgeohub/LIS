import { Router } from "express";
import { getArcGISUserToken } from "../../services/getArcGISUserToken";

const router = Router();

router.get("/token", async (_req, res) => {
  try {
    const token = await getArcGISUserToken();
    res.json(token);
  } catch (error: any) {
    const message = error?.message || "Failed to obtain ArcGIS token";
    console.error("[arcgis/token] error:", message);
    res.status(502).json({ message });
  }
});

export default router;
