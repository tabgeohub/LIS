import fs from "fs";
import path from "path";

const root = "src/Components/TimesliderItemDetailPage";

function strip(name) {
  return name.replace(/\.test\.tsx?$/, "").replace(/\.tsx?$/, "");
}

const hooksN = new Set(fs.readdirSync(path.join(root, "hooks")).map(strip));
const buildersN = new Set(
  fs.readdirSync(path.join(root, "builders")).map(strip)
);
const queryN = new Set(fs.readdirSync(path.join(root, "query")).map(strip));

function folderOf(base) {
  if (hooksN.has(base)) return "hooks";
  if (buildersN.has(base)) return "builders";
  if (queryN.has(base)) return "query";
  return null;
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(ent.name)) out.push(p);
  }
  return out;
}

function currentFolder(file) {
  const rel = path.relative(root, path.dirname(file)).replace(/\\/g, "/");
  if (!rel || rel === ".") return "root";
  return rel.split("/")[0];
}

function fix(file) {
  let text = fs.readFileSync(file, "utf8");
  const fromFolder = currentFolder(file);
  const next = text.replace(
    /from (["'])(\.\.?\/[^"']+)\1/g,
    (m, q, spec) => {
      const base = path.basename(spec).replace(/\.tsx?$/, "");
      const target = folderOf(base);
      if (!target) return m;
      if (spec.includes(`/${target}/`) || spec.includes(`\\${target}\\`)) {
        return m;
      }
      // already same-folder relative after move
      if (fromFolder === target && /^\.\/[^./]+$/.test(spec)) return m;

      let prefix;
      if (fromFolder === "root") prefix = `./${target}/`;
      else if (fromFolder === target) prefix = "./";
      else if (fromFolder === "sections") prefix = `../${target}/`;
      else prefix = `../${target}/`;
      return `from ${q}${prefix}${base}${q}`;
    }
  );
  if (next !== text) {
    fs.writeFileSync(file, next);
    console.log("fixed", file);
  }
}

for (const f of walk(root)) fix(f);
