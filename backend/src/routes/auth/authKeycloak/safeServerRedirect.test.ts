import "dotenv/config";
import assert from "node:assert/strict";
import { isSafeServerRedirectTarget } from "./safeServerRedirect";
import { OIDC_PROFILES } from "../oidcProfiles";

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log("ok", name);
  } catch (error) {
    console.error("FAIL", name, error);
    process.exitCode = 1;
  }
}

const publicFrontend = OIDC_PROFILES.public.frontendUrl.replace(/\/+$/, "");

run("allows configured frontend URL", () => {
  assert.equal(isSafeServerRedirectTarget(publicFrontend), true);
  assert.equal(isSafeServerRedirectTarget(`${publicFrontend}/dashboard`), true);
});

run("allows desktop callback path", () => {
  assert.equal(isSafeServerRedirectTarget("/auth/desktop-ok"), true);
});

run("rejects external and protocol-relative targets", () => {
  assert.equal(isSafeServerRedirectTarget("https://evil.com"), false);
  assert.equal(isSafeServerRedirectTarget("//evil.com"), false);
  assert.equal(isSafeServerRedirectTarget("/auth/desktop-ok/../../../evil"), false);
  assert.equal(isSafeServerRedirectTarget("javascript:alert(1)"), false);
});

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("safeServerRedirect tests passed");
