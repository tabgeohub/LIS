import fs from "fs";
import path from "path";

const root = process.cwd();
const src = path.join(root, "src");
const fromDir = path.join(src, "helpers", "tableExports");
const toDir = path.join(src, "Components", "HomePage", "helpers", "tableExports");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|mjs|js)$/.test(e.name)) out.push(p);
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

if (!fs.existsSync(fromDir)) {
  console.error("missing", fromDir);
  process.exit(1);
}

copyDir(fromDir, toDir);

const files = walk(src);
let n = 0;
for (const f of files) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  c = c.replaceAll(
    "@helpers/tableExports/",
    "Components/HomePage/helpers/tableExports/",
  );
  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
  }
}

// remove old dir
fs.rmSync(fromDir, { recursive: true, force: true });
console.log(`moved tableExports; updated ${n} files`);
