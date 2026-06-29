import assert from "node:assert/strict";
import { safeReturnPath } from "./safeReturnPath";

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log("ok", name);
  } catch (error) {
    console.error("FAIL", name, error);
    process.exitCode = 1;
  }
}

run("accepts same-app relative path", () => {
  assert.equal(safeReturnPath("/dashboard"), "/dashboard");
  assert.equal(safeReturnPath("/path?tab=1"), "/path?tab=1");
});

run("rejects open redirect targets", () => {
  assert.equal(safeReturnPath("//evil.com"), null);
  assert.equal(safeReturnPath("https://evil.com"), null);
  assert.equal(safeReturnPath("http://evil.com/path"), null);
  assert.equal(safeReturnPath("/path with space"), null);
});

run("rejects empty and non-string values", () => {
  assert.equal(safeReturnPath(""), null);
  assert.equal(safeReturnPath(null), null);
  assert.equal(safeReturnPath(undefined), null);
  assert.equal(safeReturnPath(123), null);
});

run("decode URI-encoded paths", () => {
  assert.equal(safeReturnPath("%2Fdashboard"), "/dashboard");
});

run("rejects backslash in path", () => {
  assert.equal(safeReturnPath("/\\evil.com"), null);
  assert.equal(safeReturnPath("/path\\segment"), null);
});

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("safeReturnPath tests passed");
