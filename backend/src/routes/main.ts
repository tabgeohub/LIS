import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("LIS Backend is running!");
});

export default router;
