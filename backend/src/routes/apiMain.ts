import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("LIS API is running!");
});

export default router;
