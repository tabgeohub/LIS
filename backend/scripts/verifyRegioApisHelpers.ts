import { resolveRegioFilter } from "../src/helpers/queries/shared/resolveRegioFilter";

export const REGIO = "RWS NN";
export const ADMIN = "admin";

export type VerifyResult = { name: string; ok: boolean; detail: string };

const results: VerifyResult[] = [];

export function getVerifyResults(): VerifyResult[] {
  return results;
}

export function pass(name: string, detail: string) {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name} — ${detail}`);
}

export function fail(name: string, detail: string) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name} — ${detail}`);
}

export const reporter = { pass, fail };

export function makeFakeAccessToken(roles: string[]): string {
  const payload = Buffer.from(
    JSON.stringify({ realm_access: { roles } })
  ).toString("base64url");
  return `e30.${payload}.e30`;
}

export function mockReq(input: {
  roles: string[];
  query?: Record<string, string>;
}) {
  const { roles, query = {} } = input;
  return {
    query,
    session: {
      auth: {
        tokenSet: { access_token: makeFakeAccessToken(roles) },
      },
    },
  } as Parameters<typeof resolveRegioFilter>[0];
}

export const RESOLVE_REGIO_FILTER_CASES: Array<{
  name: string;
  roles: string[];
  query?: Record<string, string>;
  expected: string | undefined;
}> = [
  {
    name: "RWS NN session, no query",
    roles: ["RWS NN", "offline_access"],
    expected: REGIO,
  },
  {
    name: "RWS NN session, query admin (no escalation)",
    roles: ["RWS NN"],
    query: { regio_id: "admin" },
    expected: REGIO,
  },
  {
    name: "RWS NN session, query other regio (no escalation)",
    roles: ["RWS NN"],
    query: { regio_id: "RWS WNN" },
    expected: REGIO,
  },
  {
    name: "admin session, no query",
    roles: ["admin"],
    expected: ADMIN,
  },
  {
    name: "admin session, query RWS NN",
    roles: ["admin"],
    query: { regio_id: REGIO },
    expected: REGIO,
  },
  {
    name: "no session, query RWS NN",
    roles: [],
    query: { regio_id: REGIO },
    expected: REGIO,
  },
  {
    name: "no session, no query",
    roles: [],
    expected: undefined,
  },
];
