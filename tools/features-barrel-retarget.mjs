import fs from "fs";
import path from "path";

const src = path.join(process.cwd(), "src");
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "dist") continue;
      walk(p, out);
    } else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

const feat = path.join(src, "hooks", "features");
let n = 0;
for (const f of walk(src)) {
  if (f.startsWith(feat + path.sep)) continue;
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  c = c.replace(
    /from\s+(["'])hooks\/features\/usePointsStore\1/g,
    "from $1hooks/features$1",
  );
  c = c.replace(
    /from\s+(["'])hooks\/features\/useGeometriesStore\1/g,
    "from $1hooks/features$1",
  );
  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
  }
}
console.log("features barrel retarget", n);
