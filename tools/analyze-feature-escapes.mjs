import fs from "fs";
import path from "path";

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (/\.(ts|tsx)$/.test(e.name)) a.push(p);
  }
  return a;
}

function analyze(treeRel) {
  const root = path.join("src/Components/HomePage/Body/Left", treeRel);
  const escapes = new Map();
  for (const f of walk(root)) {
    const c = fs.readFileSync(f, "utf8");
    const re = /from\s+["'](\.[^"']+)["']/g;
    let m;
    while ((m = re.exec(c))) {
      const resolved = path.normalize(path.join(path.dirname(f), m[1]));
      const norm = resolved.split(path.sep).join("/");
      if (!norm.includes(`/Body/Left/${treeRel}/`) && !norm.endsWith(`/Body/Left/${treeRel}`)) {
        escapes.set(m[1], (escapes.get(m[1]) || 0) + 1);
      }
    }
  }
  console.log("###", treeRel, "relative escapes");
  [...escapes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .forEach(([k, v]) => console.log(v, k));
}

analyze("Voorbereiding");
analyze("Nabewerking");
analyze("Tools");
