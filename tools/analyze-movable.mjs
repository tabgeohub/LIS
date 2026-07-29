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

const norm = (p) => p.split(path.sep).join("/");
const allFiles = walk(src);

/**
 * folderRel: e.g. "helpers/points"
 * alias: how the folder is referenced absolutely, e.g. "@helpers/points"
 */
function analyze(folderRel, alias) {
  const folderAbs = path.join(src, folderRel);
  if (!fs.existsSync(folderAbs)) return console.log("missing", folderRel);

  const members = fs
    .readdirSync(folderAbs, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.(ts|tsx)$/.test(e.name))
    .map((e) => e.name);
  const stems = new Map(); // stem -> filename
  for (const m of members) stems.set(m.replace(/\.tsx?$/, ""), m);

  // internal graph: file -> [siblings it imports]
  const imports = new Map();
  for (const m of members) {
    const c = fs.readFileSync(path.join(folderAbs, m), "utf8");
    const deps = new Set();
    for (const re of [/from\s+["']\.\/([^"']+)["']/g, /require\(["']\.\/([^"']+)["']\)/g]) {
      let mm;
      while ((mm = re.exec(c))) {
        const stem = mm[1].replace(/\.tsx?$/, "");
        if (stems.has(stem)) deps.add(stems.get(stem));
      }
    }
    imports.set(m, [...deps]);
  }

  // external importers per member
  const extHP = new Map();
  const extOther = new Map();
  for (const m of members) {
    extHP.set(m, []);
    extOther.set(m, []);
  }
  for (const f of allFiles) {
    const nf = norm(f);
    if (nf.includes(`/${folderRel}/`)) continue; // internal
    const c = fs.readFileSync(f, "utf8");
    for (const m of members) {
      const stem = m.replace(/\.tsx?$/, "");
      const needle1 = `${alias}/${stem}"`;
      const needle2 = `${alias}/${stem}'`;
      if (c.includes(needle1) || c.includes(needle2)) {
        if (nf.includes("/Components/HomePage/")) extHP.get(m).push(nf);
        else extOther.get(m).push(nf);
      }
    }
  }

  // pinned = has a non-HomePage external importer
  const stay = new Set(members.filter((m) => extOther.get(m).length > 0));
  // closure: if X stays and X imports Y, Y must stay (else helpers->HomePage edge)
  let grew = true;
  while (grew) {
    grew = false;
    for (const m of [...stay]) {
      for (const d of imports.get(m) || []) {
        if (!stay.has(d)) {
          stay.add(d);
          grew = true;
        }
      }
    }
  }

  const movable = members.filter(
    (m) => !stay.has(m) && (extHP.get(m).length > 0 || true)
  );
  const movableUsed = movable.filter(
    (m) => extHP.get(m).length > 0 || movable.some((o) => (imports.get(o) || []).includes(m))
  );
  const orphans = movable.filter((m) => !movableUsed.includes(m));

  console.log(`\n### ${folderRel}  (alias ${alias})`);
  console.log(`members: ${members.length}`);
  console.log(`STAY (${stay.size}): ${[...stay].sort().join(", ")}`);
  console.log(`MOVE (${movableUsed.length}): ${movableUsed.sort().join(", ")}`);
  if (orphans.length)
    console.log(`NO-IMPORTER (${orphans.length}): ${orphans.sort().join(", ")}`);

  // sanity: any MOVE file imported by a STAY file?
  const violations = [];
  for (const s of stay)
    for (const d of imports.get(s) || [])
      if (movableUsed.includes(d)) violations.push(`${s} -> ${d}`);
  console.log("violations:", violations.length ? violations.join("; ") : "none");
}

analyze("helpers/points", "@helpers/points");
analyze("helpers/ArcGISHelpers", "@helpers/ArcGISHelpers");
