import assert from "assert";
import fs from "fs";
import os from "os";
import path from "path";
import { resolveSafeUploadFile } from "./safeUploadFile";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "lis-upload-test-"));
const uploadDir = path.join(tempDir, "uploads");
const filename = "1735689600000-123e4567-e89b-12d3-a456-426614174000.zip";

try {
  fs.mkdirSync(uploadDir);
  fs.writeFileSync(path.join(uploadDir, filename), "test");

  assert.equal(
    resolveSafeUploadFile(uploadDir, filename),
    fs.realpathSync(path.join(uploadDir, filename))
  );
  assert.equal(resolveSafeUploadFile(uploadDir, "../../etc/passwd"), null);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
