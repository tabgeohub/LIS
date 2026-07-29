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

function moveFolder(relFrom, relTo, importReplacements) {
  const from = path.join(src, relFrom);
  const to = path.join(src, relTo);
  if (!fs.existsSync(from)) {
    console.log("skip missing", relFrom);
    return;
  }
  copyDir(from, to);
  fs.rmSync(from, { recursive: true, force: true });
  console.log("moved", relFrom, "->", relTo);

  const files = walk(src);
  let n = 0;
  for (const f of files) {
    let c = fs.readFileSync(f, "utf8");
    const o = c;
    for (const [a, b] of importReplacements) {
      c = c.split(a).join(b);
    }
    // avoid double prefix
    c = c.split("Components/HomePage/Components/HomePage/").join("Components/HomePage/");
    if (c !== o) {
      fs.writeFileSync(f, c);
      n++;
    }
  }
  console.log("updated", n, "files for", relFrom);
}

moveFolder("hooks/resultTab", "Components/HomePage/hooks/resultTab", [
  ["hooks/resultTab/", "Components/HomePage/hooks/resultTab/"],
]);

moveFolder("hooks/hover-click-handlers", "Components/HomePage/hooks/hover-click-handlers", [
  ["hooks/hover-click-handlers/", "Components/HomePage/hooks/hover-click-handlers/"],
]);
