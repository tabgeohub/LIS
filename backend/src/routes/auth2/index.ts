import { Router } from "express";
import { createAuth2RateLimiters } from "./authRateLimit";
import { loginHandler } from "./loginHandler";
import { logoutHandler } from "./logoutHandler";
import { meHandler } from "./meHandler";
import { requireAuthClientHeader } from "./requireAuthClientHeader";
import { verifyCredentialsHandler } from "./verifyCredentialsHandler";

export async function createAuth2Router() {
  const router = Router();
  const rateLimiters = await createAuth2RateLimiters();

  router.post(
    "/verify-credentials",
    requireAuthClientHeader,
    rateLimiters.verifyCredentials,
    verifyCredentialsHandler
  );
  router.post(
    "/login",
    requireAuthClientHeader,
    rateLimiters.login,
    loginHandler
  );
  router.get("/me", requireAuthClientHeader, meHandler);
  router.post("/logout", requireAuthClientHeader, logoutHandler);

  return router;
}
