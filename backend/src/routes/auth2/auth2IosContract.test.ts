import assert from "assert";
import http, { type IncomingHttpHeaders, type Server } from "http";
import express from "express";
import session from "express-session";

type HttpResult = {
  statusCode: number;
  headers: IncomingHttpHeaders;
  body: Record<string, unknown>;
};

type RequestInput = {
  method?: "GET" | "POST";
  path: string;
  body?: Record<string, unknown>;
  cookie?: string;
  client?: string;
};

function jwt(roles: string[], expiresAt: number, subject = "fixture-subject"): string {
  const payload = Buffer.from(
    JSON.stringify({ realm_access: { roles }, exp: expiresAt, sub: subject })
  ).toString("base64url");
  return `fixture.${payload}.signature`;
}

function listen(app: express.Express): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
    server.once("error", reject);
  });
}

function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function request(server: Server, input: RequestInput): Promise<HttpResult> {
  const address = server.address();
  assert(address && typeof address !== "string");
  const encoded = input.body ? JSON.stringify(input.body) : undefined;
  const headers: http.OutgoingHttpHeaders = {
    ...(input.client ? { "x-lis-client": input.client } : {}),
    ...(input.cookie ? { cookie: input.cookie } : {}),
    ...(encoded
      ? {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(encoded),
        }
      : {}),
  };

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port: address.port,
        path: input.path,
        method: input.method ?? "POST",
        headers,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => (body += chunk));
        res.on("end", () =>
          resolve({
            statusCode: res.statusCode ?? 0,
            headers: res.headers,
            body: body ? JSON.parse(body) : {},
          })
        );
      }
    );
    req.once("error", reject);
    if (encoded) req.write(encoded);
    req.end();
  });
}

function sessionCookie(result: HttpResult): string {
  const raw = result.headers["set-cookie"];
  assert(raw && raw.length > 0, "expected a session cookie");
  return raw[0].split(";", 1)[0];
}

async function run() {
  process.env.AUTH2_REQUIRE_CLIENT_HEADER = "true";
  process.env.AUTH2_RATE_LIMIT_STORE = "memory";
  process.env.AUTH2_VERIFY_RATE_LIMIT_MAX = "2";
  process.env.AUTH2_LOGIN_RATE_LIMIT_MAX = "5";
  process.env.AUTH_REFRESH_THRESHOLD_SEC = "60";
  process.env.NODE_ENV = "test";

  // Mock every external dependency before loading the handlers. The router,
  // sessions, validation, rate limiting and error mapping remain real.
  const oidc = require("../auth/oidc") as {
    getOidcClientFor: (req: unknown) => unknown;
  };
  const lookup = require("./keycloakUserLookup") as {
    lookupKeycloakUser: (req: unknown, username: string) => unknown;
  };
  const identity = require("./authIdentity") as {
    resolveAuthenticatedIdentity: (input: any) => Promise<unknown>;
  };
  const resolveIdentityFromStore = identity.resolveAuthenticatedIdentity;

  let refreshCount = 0;
  let revokeCount = 0;
  const expired = Math.floor(Date.now() / 1000) - 1;
  const fresh = Math.floor(Date.now() / 1000) + 3600;
  const userInfoForToken = new Map<string, Record<string, string>>();

  const tokenFor = (username: string, roles: string[], expiresAt: number) => {
    const accessToken = jwt(roles, expiresAt, username);
    userInfoForToken.set(accessToken, {
      preferred_username: username,
      name: `Fixture ${username}`,
      email: `${username}@example.invalid`,
    });
    return {
      access_token: accessToken,
      refresh_token: `refresh-${username}`,
      expires_at: expiresAt,
      claims: () => ({ realm_access: { roles } }),
    };
  };

  const mockClient = {
    async grant(params: Record<string, string>) {
      const username = params.username;
      if (username === "otp-user") {
        if (!params.otp) {
          throw { error: "invalid_grant", error_description: "OTP required" };
        }
        if (params.otp === "000000") {
          throw { error: "invalid_grant", error_description: "Invalid OTP" };
        }
        if (params.otp === "999999") {
          throw { error: "invalid_grant", error_description: "OTP expired" };
        }
        if (params.password !== "correct" || params.otp !== "123456") {
          throw { error: "invalid_grant", error_description: "Invalid user credentials" };
        }
        return tokenFor(username, ["RWS FIXTURE"], expired);
      }
      if (username === "fixture-user" && params.password === "correct") {
        return tokenFor(username, ["RWS FIXTURE"], expired);
      }
      if (username === "admin-user" && params.password === "correct") {
        return tokenFor(username, ["admin"], fresh);
      }
      if (username === "unlinked" && params.password === "correct") {
        return tokenFor(username, ["RWS FIXTURE"], fresh);
      }
      if (username === "expired-session" && params.password === "correct") {
        return tokenFor(username, ["RWS FIXTURE"], expired);
      }
      throw { error: "invalid_grant", error_description: "Invalid credentials" };
    },
    async userinfo(accessToken: string) {
      return userInfoForToken.get(accessToken) ?? {};
    },
    async refresh(refreshToken: string) {
      refreshCount += 1;
      if (refreshToken === "refresh-expired-session") {
        throw new Error("synthetic refresh expiry");
      }
      return tokenFor(refreshToken.replace("refresh-", ""), ["RWS FIXTURE"], fresh);
    },
    async revoke(_refreshToken: string, _hint: string) {
      revokeCount += 1;
    },
  };

  oidc.getOidcClientFor = async () => ({ client: mockClient });
  lookup.lookupKeycloakUser = async (_req: unknown, username: string) => {
    if (username === "otp-user") return { ok: true, userId: "keycloak-otp", hasOtp: true };
    if (["fixture-user", "admin-user", "unlinked", "expired-session", "limited"].includes(username)) {
      return { ok: true, userId: `keycloak-${username}`, hasOtp: false };
    }
    return { ok: false, reason: "not_found" };
  };
  identity.resolveAuthenticatedIdentity = async (input) => {
    if (input.userInfo.preferred_username === "unlinked") return null;
    if (input.userInfo.preferred_username === "admin-user") {
      return { user_id: 77, regio_id: "admin", is_admin: true };
    }
    return { user_id: 42, regio_id: "RWS FIXTURE", is_admin: false };
  };

  const { createAuth2Router } = require("./index") as {
    createAuth2Router: () => Promise<express.Router>;
  };
  const { requireSessionAuth } = require("../../helpers/auth/requireSessionAuth") as {
    requireSessionAuth: express.RequestHandler;
  };

  const app = express();
  app.use(express.json());
  app.use(
    session({
      name: "lis.sid",
      secret: "auth2-ios-contract-test-secret",
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: { httpOnly: true, maxAge: 60_000 },
    })
  );
  app.use("/auth2", await createAuth2Router());
  app.get("/protected", requireSessionAuth, (_req, res) => res.json({ ok: true }));

  const server = await listen(app);
  try {
    const missingHeader = await request(server, {
      path: "/auth2/login",
      body: { username: "fixture-user", password: "correct" },
    });
    assert.equal(missingHeader.statusCode, 403);
    assert.equal(missingHeader.body.code, "CLIENT_HEADER_REQUIRED");

    const wrongHeader = await request(server, {
      path: "/auth2/login",
      client: "android",
      body: { username: "fixture-user", password: "correct" },
    });
    assert.equal(wrongHeader.statusCode, 403);
    assert.equal(wrongHeader.body.code, "CLIENT_HEADER_REQUIRED");

    const desktopLogin = await request(server, {
      path: "/auth2/login",
      client: "desktop",
      body: { username: "fixture-user", password: "correct" },
    });
    assert.equal(desktopLogin.statusCode, 200);
    assert.deepEqual(desktopLogin.body.identity, {
      user_id: 42,
      regio_id: "RWS FIXTURE",
      is_admin: false,
    });

    const adminLogin = await request(server, {
      path: "/auth2/login",
      client: "ios",
      body: { username: "admin-user", password: "correct" },
    });
    assert.equal(adminLogin.statusCode, 200);
    assert.deepEqual(adminLogin.body.identity, {
      user_id: 77,
      regio_id: "admin",
      is_admin: true,
    });

    const otpChallenge = await request(server, {
      path: "/auth2/verify-credentials",
      client: "ios",
      body: { username: "otp-user", password: "anything" },
    });
    assert.equal(otpChallenge.statusCode, 200);
    assert.equal(otpChallenge.body.status, "otp_required");
    assert.equal(otpChallenge.headers["set-cookie"], undefined);

    for (const otp of ["000000", "999999"]) {
      const otpFailure = await request(server, {
        path: "/auth2/login",
        client: "ios",
        body: { username: "otp-user", password: "correct", otp },
      });
      assert.equal(otpFailure.statusCode, 401);
      assert.equal(otpFailure.body.code, "INVALID_OTP");
      assert.equal(otpFailure.headers["set-cookie"], undefined);
    }

    const otpLogin = await request(server, {
      path: "/auth2/login",
      client: "ios",
      body: { username: "otp-user", password: "correct", otp: "123456" },
    });
    assert.equal(otpLogin.statusCode, 200);
    assert.equal(otpLogin.body.identity && (otpLogin.body.identity as { user_id: number }).user_id, 42);

    const iosLogin = await request(server, {
      path: "/auth2/login",
      client: "ios",
      body: { username: "fixture-user", password: "correct" },
    });
    assert.equal(iosLogin.statusCode, 200);
    assert.deepEqual(iosLogin.body.identity, {
      user_id: 42,
      regio_id: "RWS FIXTURE",
      is_admin: false,
    });
    const cookie = sessionCookie(iosLogin);

    const me = await request(server, {
      method: "GET",
      path: "/auth2/me",
      client: "ios",
      cookie,
    });
    assert.equal(me.statusCode, 200);
    assert.deepEqual(me.body.identity, iosLogin.body.identity);
    assert.equal(refreshCount, 1, "expired access token must refresh before /me");

    const protectedRequest = await request(server, {
      method: "GET",
      path: "/protected",
      cookie,
    });
    assert.equal(protectedRequest.statusCode, 200);
    assert.equal(protectedRequest.body.ok, true);

    const noSession = await request(server, {
      method: "GET",
      path: "/auth2/me",
      client: "ios",
    });
    assert.equal(noSession.statusCode, 401);
    assert.equal(noSession.body.authenticated, false);

    const expiredSessionLogin = await request(server, {
      path: "/auth2/login",
      client: "ios",
      body: { username: "expired-session", password: "correct" },
    });
    assert.equal(expiredSessionLogin.statusCode, 200);
    const expiredSession = await request(server, {
      method: "GET",
      path: "/auth2/me",
      client: "ios",
      cookie: sessionCookie(expiredSessionLogin),
    });
    assert.equal(expiredSession.statusCode, 401);
    assert.equal(expiredSession.body.authenticated, false);

    const invalidCredentials = await request(server, {
      path: "/auth2/login",
      client: "ios",
      body: { username: "fixture-user", password: "wrong" },
    });
    assert.equal(invalidCredentials.statusCode, 401);
    assert.equal(invalidCredentials.body.code, "INVALID_PASSWORD");
    assert.equal(invalidCredentials.headers["set-cookie"], undefined);

    const unlinked = await request(server, {
      path: "/auth2/login",
      client: "ios",
      body: { username: "unlinked", password: "correct" },
    });
    assert.equal(unlinked.statusCode, 403);
    assert.equal(unlinked.body.code, "IDENTITY_NOT_LINKED");
    assert.equal(unlinked.headers["set-cookie"], undefined);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const limited = await request(server, {
        path: "/auth2/verify-credentials",
        client: "ios",
        body: { username: "limited", password: "wrong" },
      });
      if (attempt < 2) assert.equal(limited.statusCode, 401);
      else {
        assert.equal(limited.statusCode, 429);
        assert.equal(limited.body.code, "TOO_MANY_REQUESTS");
      }
    }

    const logout = await request(server, {
      path: "/auth2/logout",
      client: "ios",
      cookie,
    });
    assert.equal(logout.statusCode, 200);
    assert.equal(logout.body.success, true);
    assert.equal(revokeCount, 1);

    const afterLogout = await request(server, {
      method: "GET",
      path: "/auth2/me",
      client: "ios",
      cookie,
    });
    assert.equal(afterLogout.statusCode, 401);

    const adminIdentity = await resolveIdentityFromStore({
      tokenSet: {
        access_token: jwt(["admin"], fresh),
        claims: () => ({ realm_access: { roles: ["admin"] } }),
      },
      userInfo: { preferred_username: "admin-user" },
      db: { query: async () => ({ rows: [{ user_id: "77" }] }) },
    });
    assert.deepEqual(adminIdentity, { user_id: 77, regio_id: "admin", is_admin: true });
  } finally {
    await close(server);
  }
}

run()
  .then(() => console.log("auth2 iOS contract tests passed"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
