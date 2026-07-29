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

// 1) logging must stay in src/hooks: useLogAction imports it relatively.
const logFrom = path.join(src, "Components", "HomePage", "hooks", "logging");
const logTo = path.join(src, "hooks", "logging");
if (fs.existsSync(logFrom)) {
  copyDir(logFrom, logTo);
  fs.rmSync(logFrom, { recursive: true, force: true });
  console.log("restored hooks/logging");
}

const files = walk(src);
let changed = 0;
for (const f of files) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  // 2) undo the api-hooks mangling
  c = c.split("api-Components/HomePage/hooks/").join("api-hooks/");
  // 3) undo the logging retarget
  c = c
    .split("Components/HomePage/hooks/logging/")
    .join("hooks/logging/");
  if (c !== o) {
    fs.writeFileSync(f, c);
    changed++;
  }
}
console.log("fixed", changed, "files");
