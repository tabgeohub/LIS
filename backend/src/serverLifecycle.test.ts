import assert from "assert";
import { spawn, type ChildProcess } from "child_process";
import http from "http";
import net from "net";
import path from "path";

const requiredEnvironment = {
  SESSION_SECRET: "server-lifecycle-test-secret",
  PGUSER: "test",
  PGHOST: "127.0.0.1",
  PGPORT: "1",
  PGDATABASE: "test",
  PGPASSWORD: "test",
  ARCGIS_TOKEN_ENDPOINT: "http://127.0.0.1:1/token",
  ARCGIS_CLIENT_ID: "test",
  ARCGIS_CLIENT_SECRET: "test",
  ARCGIS_SERVER_URL: "http://127.0.0.1:1/arcgis",
} as const;

function reservePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      assert(address && typeof address !== "string");
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

function startServer(env: NodeJS.ProcessEnv): ChildProcess {
  return spawn(
    process.execPath,
    [path.join("node_modules", "ts-node", "dist", "bin.js"), "--transpile-only", "src/server.ts"],
    {
      cwd: process.cwd(),
      env,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
}

function waitForOutput(
  child: ChildProcess,
  expected: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => {
      reject(new Error(`Timed out waiting for ${expected}. Output: ${output}`));
    }, 10_000);
    const append = (chunk: Buffer) => {
      output += chunk.toString();
      if (output.includes(expected)) {
        clearTimeout(timer);
        resolve(output);
      }
    };
    child.stdout?.on("data", append);
    child.stderr?.on("data", append);
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("exit", (code, signal) => {
      clearTimeout(timer);
      reject(
        new Error(
          `Server exited before ${expected} (code=${code}, signal=${signal}). Output: ${output}`
        )
      );
    });
  });
}

function requestProbe(port: number): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(
      `http://127.0.0.1:${port}/api/ios/bootstrap/probe`,
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => (body += chunk));
        res.on("end", () =>
          resolve({ statusCode: res.statusCode ?? 0, body })
        );
      }
    );
    req.once("error", reject);
  });
}

function waitForExit(
  child: ChildProcess
): Promise<{ code: number | null; signal: NodeJS.Signals | null }> {
  if (child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve({
      code: child.exitCode,
      signal: child.signalCode,
    });
  }

  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code, signal }));
  });
}

async function run() {
  const port = await reservePort();
  const child = startServer({
    ...process.env,
    ...requiredEnvironment,
    PORT: String(port),
    SESSION_STORE: "memory",
    AUTH2_RATE_LIMIT_STORE: "memory",
    NODE_ENV: "test",
  });

  try {
    await waitForOutput(child, `Server is running on port ${port}`);
    const probe = await requestProbe(port);
    assert.equal(probe.statusCode, 200);
    assert.deepEqual(JSON.parse(probe.body), {
      service: "lis-backend",
      version: 1,
      status: "ready",
      scope: "bootstrap-only",
    });
  } finally {
    child.kill("SIGTERM");
    const stopped = await waitForExit(child);
    assert.equal(stopped.signal, "SIGTERM");
  }

  const missingEnvironment = { ...process.env };
  for (const key of Object.keys(requiredEnvironment)) {
    delete missingEnvironment[key];
  }
  const failedStart = startServer({
    ...missingEnvironment,
    PORT: String(port),
    SESSION_STORE: "memory",
    AUTH2_RATE_LIMIT_STORE: "memory",
    NODE_ENV: "test",
  });
  const failureOutput = await waitForOutput(
    failedStart,
    "Missing required environment variables"
  );
  const failure = await waitForExit(failedStart);
  assert.equal(failure.code, 1);
  assert.equal(failureOutput.includes("server-lifecycle-test-secret"), false);
}

run()
  .then(() => console.log("server lifecycle tests passed"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
