import fs from "fs";
import path from "path";

const root = process.cwd();
const src = path.join(root, "src");

const TARGETS = [
  "filters",
  "handleCancel",
  "flightPlan",
  "kaartlagen",
  "editPoint",
  "popUpModal",
  "tabs",
  "viewPlan",
  "bottom",
  "layout",
];

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

// 1) Move folders on disk
for (const d of TARGETS) {
  const from = path.join(src, "hooks", d);
  const to = path.join(src, "Components", "HomePage", "hooks", d);
  if (!fs.existsSync(from)) {
    console.log("skip missing", d);
    continue;
  }
  copyDir(from, to);
  fs.rmSync(from, { recursive: true, force: true });
  console.log("moved hooks/" + d, "-> Components/HomePage/hooks/" + d);
}

// 2) Retarget imports across the whole src tree
const files = walk(src);
let changed = 0;
for (const f of files) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  for (const d of TARGETS) {
    c = c.split(`hooks/${d}/`).join(`Components/HomePage/hooks/${d}/`);
  }
  // guard against accidental double prefix
  c = c
    .split("Components/HomePage/Components/HomePage/")
    .join("Components/HomePage/");
  if (c !== o) {
    fs.writeFileSync(f, c);
    changed++;
  }
}
console.log("updated", changed, "files");
