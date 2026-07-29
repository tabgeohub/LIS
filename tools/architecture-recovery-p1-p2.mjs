import fs from "fs";
import path from "path";

const root = process.cwd();
const src = path.join(root, "src");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "dist") continue;
      walk(p, out);
    } else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name);
    const b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
}

const files = walk(src);
let n = 0;

// ---- P1a: hooks/zustand/ui/<file> → hooks/zustand/ui (skip files inside ui/) ----
const uiDir = path.join(src, "hooks", "zustand", "ui");
for (const f of files) {
  if (f.startsWith(uiDir + path.sep) || f.startsWith(uiDir + "/")) continue;
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  // named deep imports → barrel
  c = c.replace(
    /from\s+(["'])hooks\/zustand\/ui\/[^"']+\1/g,
    "from $1hooks/zustand/ui$1",
  );
  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
  }
}
console.log("P1a ui-barrel retarget files:", n);

// ---- P1b: HomePage utils mutation shims → api-hooks/mutations ----
n = 0;
const hp = path.join(src, "Components", "HomePage");
for (const f of walk(hp)) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  c = c
    .replace(/from\s+(["'])utils\/useCreateData\1/g, "from $1api-hooks/mutations$1")
    .replace(/from\s+(["'])utils\/useUpdateData\1/g, "from $1api-hooks/mutations$1")
    .replace(/from\s+(["'])utils\/useDeleteData\1/g, "from $1api-hooks/mutations$1");
  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
  }
}
console.log("P1b mutations→api-hooks files:", n);

// ---- P1c: deep api-hooks paths → package barrels ----
n = 0;
for (const f of files) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  c = c
    .replace(
      /from\s+(["'])api-hooks\/planImages\/useEntityPlanImages\1/g,
      "from $1api-hooks/planImages$1",
    )
    .replace(
      /from\s+(["'])api-hooks\/templateFlights\/types\1/g,
      "from $1api-hooks/templateFlights$1",
    )
    .replace(
      /from\s+(["'])api-hooks\/consts\/types\1/g,
      "from $1api-hooks/consts$1",
    );
  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
  }
}
console.log("P1c deep api-hooks→barrel files:", n);

// ---- P2: revert ArcGISHelpers from HomePage → helpers ----
const arcFrom = path.join(src, "Components", "HomePage", "helpers", "ArcGISHelpers");
const arcTo = path.join(src, "helpers", "ArcGISHelpers");
if (fs.existsSync(arcFrom)) {
  fs.mkdirSync(arcTo, { recursive: true });
  for (const e of fs.readdirSync(arcFrom, { withFileTypes: true })) {
    if (!e.isFile()) continue;
    const a = path.join(arcFrom, e.name);
    const b = path.join(arcTo, e.name);
    // If target exists (shared stay-behind), skip overwrite of stay files —
    // Wave-4 moved files should not collide with the 15 stayers.
    if (fs.existsSync(b)) {
      console.log("P2 skip collision (already in helpers):", e.name);
      fs.rmSync(a, { force: true });
      continue;
    }
    let c = fs.readFileSync(a, "utf8");
    // absolute alias refs to @helpers/ArcGISHelpers stay valid once co-located
    // HomePage path refs inside moved files (unlikely) → alias
    c = c
      .split("Components/HomePage/helpers/ArcGISHelpers/")
      .join("@helpers/ArcGISHelpers/");
    fs.writeFileSync(b, c);
    fs.rmSync(a, { force: true });
  }
  // remove empty dir tree
  try {
    fs.rmSync(arcFrom, { recursive: true, force: true });
  } catch {}
  console.log("P2 moved ArcGISHelpers files back to helpers");
}

// Retarget all imports of HomePage ArcGISHelpers path
n = 0;
for (const f of walk(src)) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  c = c
    .split("Components/HomePage/helpers/ArcGISHelpers/")
    .join("@helpers/ArcGISHelpers/");
  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
  }
}
console.log("P2 ArcGIS import retarget files:", n);

console.log("done recovery script phase 1-2");
