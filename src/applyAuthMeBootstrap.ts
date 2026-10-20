/**
 * Canonical bootstrap lives in `bootstrapAuthMe.ts`.
 * This file re-exports so older imports keep working.
 */
export {
  applyAuthMeBootstrap,
  buildAuthUserFromMe,
  pickRealmRole,
} from "./bootstrapAuthMe";
