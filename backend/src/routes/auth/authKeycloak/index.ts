import { Router } from "express";
import { loginHandler } from "./loginHandler";
import { loginDirectHandler } from "./loginDirectHandler";
import { callbackHandler } from "./callbackHandler";
import { desktopOkHandler } from "./desktopOkHandler";
import { logoutHandler } from "./logoutHandler";
import { meHandler } from "./meHandler";

const router = Router();

router.get("/login", loginHandler);
router.post("/login-direct", loginDirectHandler);
router.get("/callback", callbackHandler);
router.get("/desktop-ok", desktopOkHandler);
router.post("/logout", logoutHandler);
router.get("/me", meHandler);

export default router;
