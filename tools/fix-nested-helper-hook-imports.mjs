import fs from "fs";
import path from "path";

const replacements = [
  ["@helpers/getBackEndUrl", "@helpers/http/getBackEndUrl"],
  ["@helpers/refreshToken", "@helpers/http/refreshToken"],
  ["@helpers/base64ToBlob", "@helpers/http/base64ToBlob"],
  ["@helpers/haversine", "@helpers/geo/haversine"],
  ["@helpers/getDistanceMeters", "@helpers/geo/getDistanceMeters"],
  ["@helpers/classNames", "@helpers/dom/classNames"],
  ["@helpers/isValidEmail", "@helpers/dom/isValidEmail"],
  ["@helpers/getLoginUrlWithReturn", "@helpers/auth/getLoginUrlWithReturn"],
  ["@helpers/arcgisTokenRegistration", "@helpers/auth/arcgisTokenRegistration"],
  ["@helpers/filterPlans", "@helpers/plans/filterPlans"],
  ['from "hooks/useMapInitialization"', 'from "hooks/map/useMapInitialization"'],
  ["from 'hooks/useMapInitialization'", "from 'hooks/map/useMapInitialization'"],
  ['from "hooks/useRenderVluchtPlans"', 'from "hooks/map/useRenderVluchtPlans"'],
  ["from 'hooks/useRenderVluchtPlans'", "from 'hooks/map/useRenderVluchtPlans'"],
  ['from "hooks/flightPathMetrics"', 'from "hooks/map/flightPathMetrics"'],
  ["from 'hooks/flightPathMetrics'", "from 'hooks/map/flightPathMetrics'"],
  ['from "hooks/useGetFlightTimesDistance"', 'from "hooks/map/useGetFlightTimesDistance"'],
  ["from 'hooks/useGetFlightTimesDistance'", "from 'hooks/map/useGetFlightTimesDistance'"],
  ['from "hooks/useTimeRange"', 'from "hooks/time/useTimeRange"'],
  ["from 'hooks/useTimeRange'", "from 'hooks/time/useTimeRange'"],
  ['from "hooks/useTimeRangeCore"', 'from "hooks/time/useTimeRangeCore"'],
  ["from 'hooks/useTimeRangeCore'", "from 'hooks/time/useTimeRangeCore'"],
  ['from "hooks/useResetTabs"', 'from "hooks/tabs/useResetTabs"'],
  ["from 'hooks/useResetTabs'", "from 'hooks/tabs/useResetTabs'"],
];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === "dist") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(ent.name)) out.push(p);
  }
  return out;
}

let filesChanged = 0;
for (const file of walk("src")) {
  let text = fs.readFileSync(file, "utf8");
  let next = text;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  // relative imports of moved hooks from within hooks/
  next = next.replace(
    /from ["']\.\/useTimeRangeCore["']/g,
    'from "./useTimeRangeCore"'
  );
  if (next !== text) {
    fs.writeFileSync(file, next);
    filesChanged++;
  }
}

// Fix hooks/time internal import if useTimeRange imports useTimeRangeCore
const timeRange = "src/hooks/time/useTimeRange.ts";
if (fs.existsSync(timeRange)) {
  let t = fs.readFileSync(timeRange, "utf8");
  const n = t.replace(
    /from ["']\.\/useTimeRangeCore["']/g,
    'from "./useTimeRangeCore"'
  ).replace(
    /from ["']hooks\/useTimeRangeCore["']/g,
    'from "./useTimeRangeCore"'
  );
  if (n !== t) fs.writeFileSync(timeRange, n);
}

console.log("filesChanged", filesChanged);
