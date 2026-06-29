import assert from "node:assert/strict";
import {
  getFixedPostLoginRedirectUrl,
  storePendingClientRedirect,
  consumePendingClientRedirect,
} from "./resolvePostLoginRedirect";

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log("ok", name);
  } catch (error) {
    console.error("FAIL", name, error);
    process.exitCode = 1;
  }
}

run("getFixedPostLoginRedirectUrl falls back to public profile", () => {
  assert.equal(
    getFixedPostLoginRedirectUrl("unknown-profile"),
    getFixedPostLoginRedirectUrl("public")
  );
});

run("storePendingClientRedirect rejects unsafe paths", () => {
  const session: { pendingClientPath?: string } = {};
  storePendingClientRedirect(session as any, "//evil.com");
  assert.equal(session.pendingClientPath, undefined);

  storePendingClientRedirect(session as any, "/dashboard?tab=1");
  assert.equal(session.pendingClientPath, "/dashboard?tab=1");
});

run("consumePendingClientRedirect returns path once", () => {
  const session: { pendingClientPath?: string } = {
    pendingClientPath: "/images",
  };
  assert.equal(consumePendingClientRedirect(session as any), "/images");
  assert.equal(session.pendingClientPath, undefined);
  assert.equal(consumePendingClientRedirect(session as any), undefined);
});

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("resolvePostLoginRedirect tests passed");
