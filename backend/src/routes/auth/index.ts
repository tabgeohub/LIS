import { Router } from "express";
import { loginUser } from "./loginUser";

const router = Router();

router.post("/", loginUser);

export default router;

// import { Router } from "express";
// import { loginUser } from "./loginUser";

// import { loginHandler } from "./authHandlers/loginHandler";
// import { callbackHandler } from "./authHandlers/callbackHandler";
// import { desktopOkHandler } from "./authHandlers/desktopOkHandler";
// import { logoutHandler } from "./authHandlers/logoutHandler";
// import { meHandler } from "./authHandlers/meHandler";

// const router = Router();

// router.post("/", loginUser);

// // GET /auth/login
// router.get("/login", loginHandler);

// // GET /auth/callback
// router.get("/callback", callbackHandler);

// // GET /auth/desktop-ok
// router.get("/desktop-ok", desktopOkHandler);

// // POST /auth/logout
// router.post("/logout", logoutHandler);

// // GET /auth/me
// router.get("/me", meHandler);

// export default router;
