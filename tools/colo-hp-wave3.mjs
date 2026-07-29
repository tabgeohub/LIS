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

// Replacements applied across all of src at the end.
const replacements = [];

// ---- Wave A: whole HomePage-only folders ----
for (const d of ["consts", "points", "logging"]) {
  const from = path.join(src, "hooks", d);
  const to = path.join(src, "Components", "HomePage", "hooks", d);
  if (!fs.existsSync(from)) {
    console.log("skip missing hooks/" + d);
    continue;
  }
  copyDir(from, to);
  fs.rmSync(from, { recursive: true, force: true });
  replacements.push([`hooks/${d}/`, `Components/HomePage/hooks/${d}/`]);
  console.log("moved hooks/" + d);
}

{
  const from = path.join(src, "helpers", "dom");
  const to = path.join(src, "Components", "HomePage", "helpers", "dom");
  if (fs.existsSync(from)) {
    copyDir(from, to);
    fs.rmSync(from, { recursive: true, force: true });
    replacements.push(["@helpers/dom/", "Components/HomePage/helpers/dom/"]);
    console.log("moved helpers/dom");
  }
}

// ---- Wave B: split hooks/features, keeping the two shared stores ----
const KEEP = new Set(["useGeometriesStore.ts", "usePointsStore.ts"]);
const featuresFrom = path.join(src, "hooks", "features");
const featuresTo = path.join(src, "Components", "HomePage", "hooks", "features");
const movedStems = [];

if (fs.existsSync(featuresFrom)) {
  fs.mkdirSync(featuresTo, { recursive: true });
  for (const e of fs.readdirSync(featuresFrom, { withFileTypes: true })) {
    if (!e.isFile() || KEEP.has(e.name)) continue;
    const a = path.join(featuresFrom, e.name);
    const b = path.join(featuresTo, e.name);
    // moved files referencing the staying stores must use absolute paths
    let c = fs.readFileSync(a, "utf8");
    c = c
      .split('from "./useGeometriesStore"')
      .join('from "hooks/features/useGeometriesStore"')
      .split('from "./usePointsStore"')
      .join('from "hooks/features/usePointsStore"');
    fs.writeFileSync(b, c);
    fs.rmSync(a, { force: true });
    movedStems.push(e.name.replace(/\.tsx?$/, ""));
  }
  console.log("features moved:", movedStems.length, "| kept:", [...KEEP].join(", "));
}

// Per-stem replacements so the two kept stores are never retargeted.
for (const stem of movedStems) {
  for (const q of ['"', "'"]) {
    replacements.push([
      `hooks/features/${stem}${q}`,
      `Components/HomePage/hooks/features/${stem}${q}`,
    ]);
  }
}

// ---- Apply import rewrites ----
const files = walk(src);
let changed = 0;
for (const f of files) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  for (const [a, b] of replacements) c = c.split(a).join(b);
  c = c
    .split("Components/HomePage/Components/HomePage/")
    .join("Components/HomePage/");
  if (c !== o) {
    fs.writeFileSync(f, c);
    changed++;
  }
}
console.log("updated", changed, "files");
