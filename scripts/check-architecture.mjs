import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = join(root, "src");
const sourceExtensions = new Set([".ts", ".tsx"]);

function sourceFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? sourceFiles(path)
      : sourceExtensions.has(extname(path))
        ? [path]
        : [];
  });
}

const rules = [
  {
    name: "Timeslider must not import HomePage feature internals",
    appliesTo: (path) => path.includes("Components/TimesliderItemDetailPage/"),
    forbidden: /from\s+["']Components\/HomePage\//,
  },
  {
    name: "hooks and api-hooks must not depend on legacy mutation utilities",
    appliesTo: (path) =>
      path.startsWith("hooks/") || path.startsWith("api-hooks/"),
    forbidden:
      /from\s+["']utils\/(?:useCreateData|useUpdateData|useDeleteData|useDebouncedValue)["']/,
  },
  {
    name: "api-hooks must not import hooks (avoids hooks↔api-hooks cycles)",
    appliesTo: (path) => path.startsWith("api-hooks/"),
    forbidden: /from\s+["']hooks\//,
  },
  {
    name: "pure map helpers must be imported from ArcGISHelpers",
    appliesTo: () => true,
    forbidden:
      /from\s+["']hooks\/(?:map\/syncBluePointGraphics|hover-click-handlers\/usePlanStarGraphic)["']/,
  },
];

/** Domains under api-hooks that may only import themselves + shared/mutations/consts. */
const apiHookSharedDomains = new Set(["shared", "mutations", "consts"]);

function apiHookDomain(path) {
  if (!path.startsWith("api-hooks/")) return null;
  const segment = path.slice("api-hooks/".length).split("/")[0];
  return segment || null;
}

function collectCrossDomainApiHookImports(path, contents) {
  const domain = apiHookDomain(path);
  if (!domain || apiHookSharedDomains.has(domain)) return [];

  const importRe =
    /from\s+["']((?:\.\.\/)+)([A-Za-z0-9_-]+)(?:\/[^"']*)?["']/g;
  const found = [];
  let match;
  while ((match = importRe.exec(contents))) {
    const targetDomain = match[2];
    if (
      targetDomain !== domain &&
      !apiHookSharedDomains.has(targetDomain)
    ) {
      found.push(
        `${path}: api-hooks domain "${domain}" must not import "${targetDomain}" (use shared/ or own domain)`
      );
    }
  }
  return found;
}

const violations = [];
for (const absolutePath of sourceFiles(sourceRoot)) {
  const path = relative(sourceRoot, absolutePath).replaceAll("\\", "/");
  const contents = readFileSync(absolutePath, "utf8");
  for (const rule of rules) {
    if (rule.appliesTo(path) && rule.forbidden.test(contents)) {
      violations.push(`${path}: ${rule.name}`);
    }
  }
  violations.push(...collectCrossDomainApiHookImports(path, contents));
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Architecture boundaries passed.");
}
