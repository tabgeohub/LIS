import { Router } from "express";
import managementRouter from "./management/index";

const router = Router();

router.use("/management", managementRouter);

export default router;

