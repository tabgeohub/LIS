import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdir, mkdtemp, rename, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import express from "express";
import session from "express-session";
import { TokenSet } from "openid-client";
import picturesRouter from "./pictures";

const image = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X3foAAAAASUVORK5CYII=",
  "base64"
);

test("pictures API", async (t) => {
  const originalSharePath = process.env.LIS_SHARE_PATH;
  const sharePath = await mkdtemp(path.join(os.tmpdir(), "lis-pictures-"));
  t.after(async () => {
    if (originalSharePath === undefined) delete process.env.LIS_SHARE_PATH;
    else process.env.LIS_SHARE_PATH = originalSharePath;
    await rm(sharePath, { recursive: true, force: true });
  });
  process.env.LIS_SHARE_PATH = sharePath;

  const picturesPath = path.join(sharePath, "Pictures");
  await mkdir(picturesPath);
  await writeFile(path.join(picturesPath, "OTG sample.PNG"), image);
  await writeFile(path.join(sharePath, "outside.png"), image);
  await mkdir(path.join(picturesPath, "folder.png"));

  const app = express();
  app.use(session({ secret: "pictures-test-secret", resave: false, saveUninitialized: false }));
  app.post("/fixture-login", (req, res) => {
    req.session.auth = {
      tokenSet: new TokenSet({ access_token: "fixture-access", expires_in: 3600 }),
      userInfo: { sub: "fixture-user" },
    };
    res.sendStatus(204);
  });
  app.use("/api/pictures", picturesRouter);

  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  await once(server, "listening");
  const address = server.address();
  assert(address && typeof address !== "string");
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const login = await fetch(`${baseUrl}/fixture-login`, { method: "POST" });
  assert.equal(login.status, 204);
  const cookie = login.headers.get("set-cookie")?.split(";")[0];
  assert(cookie);
  const getPicture = (filename: string) =>
    fetch(`${baseUrl}/api/pictures/${filename}`, { headers: { cookie } });

  await t.test("requires a LIS session", async () => {
    const response = await fetch(`${baseUrl}/api/pictures/OTG%20sample.PNG`);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { message: "Authentication required" });
  });

  await t.test("returns the original image bytes with private response headers", async () => {
    const response = await getPicture("OTG%20sample.PNG");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), image);
  });

  await t.test("rejects path separators, control characters and unsupported formats", async () => {
    for (const filename of ["..%2Foutside.png", "..%5Coutside.png", "a%00.png", "photo.svg"]) {
      const response = await getPicture(filename);
      assert.equal(response.status, 400, filename);
      await response.json();
    }
  });

  await t.test("returns 404 for missing files and directories", async () => {
    for (const filename of ["missing.png", "outside.png", "folder.png"]) {
      const response = await getPicture(filename);
      assert.equal(response.status, 404, filename);
      assert.deepEqual(await response.json(), { message: "Picture not found." });
    }
  });

  await t.test("rejects a symbolic link to a file outside Pictures", async (linkTest) => {
    try {
      await symlink(path.join(sharePath, "outside.png"), path.join(picturesPath, "linked.png"), "file");
    } catch (error) {
      if (process.platform !== "win32" || (error as NodeJS.ErrnoException).code !== "EPERM") throw error;
      linkTest.skip("Windows does not allow this process to create file symlinks");
      return;
    }

    const response = await getPicture("linked.png");
    assert.equal(response.status, 404);
    await response.json();
  });

  await t.test("returns 503 if Pictures is missing or is a symbolic link", async () => {
    const movedPicturesPath = path.join(sharePath, "MovedPictures");
    await rename(picturesPath, movedPicturesPath);
    const missingDirectory = await getPicture("OTG%20sample.PNG");
    assert.equal(missingDirectory.status, 503);
    assert.deepEqual(await missingDirectory.json(), { message: "Picture storage is unavailable." });

    await symlink(movedPicturesPath, picturesPath, process.platform === "win32" ? "junction" : "dir");
    const linkedDirectory = await getPicture("OTG%20sample.PNG");
    assert.equal(linkedDirectory.status, 503);
    assert.deepEqual(await linkedDirectory.json(), { message: "Picture storage is unavailable." });
  });
});
