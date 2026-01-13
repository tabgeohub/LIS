import { Router } from "express";
import usersRouter from "./users/index";

const router = Router();

router.use(usersRouter);

export default router;

