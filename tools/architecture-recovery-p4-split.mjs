import fs from "fs";
import path from "path";

const src = path.join(process.cwd(), "src");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
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

const MOVES = [
  {
    from: path.join(src, "Components/HomePage/Body/Left/Voorbereiding"),
    to: path.join(src, "Components/Voorbereiding"),
    oldAbs: "Components/HomePage/Body/Left/Voorbereiding/",
    newAbs: "Components/Voorbereiding/",
    name: "Voorbereiding",
  },
  {
    from: path.join(src, "Components/HomePage/Body/Left/Nabewerking"),
    to: path.join(src, "Components/Nabewerking"),
    oldAbs: "Components/HomePage/Body/Left/Nabewerking/",
    newAbs: "Components/Nabewerking/",
    name: "Nabewerking",
  },
  {
    from: path.join(src, "Components/HomePage/Body/Left/Tools"),
    to: path.join(src, "Components/HomePageTools"),
    oldAbs: "Components/HomePage/Body/Left/Tools/",
    newAbs: "Components/HomePageTools/",
    name: "Tools",
  },
];

for (const m of MOVES) {
  if (!fs.existsSync(m.from)) {
    console.log("skip missing", m.name);
    continue;
  }
  copyDir(m.from, m.to);
  fs.rmSync(m.from, { recursive: true, force: true });
  console.log("moved", m.name, "→", m.to);
}

// Rewrite all src files: absolute path prefixes + Left/index relative imports
let changed = 0;
for (const f of walk(src)) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  for (const m of MOVES) {
    c = c.split(m.oldAbs).join(m.newAbs);
  }
  // Left/index.tsx style: ./Voorbereiding/X → Components/Voorbereiding/X
  c = c
    .replace(
      /from\s+(["'])\.\/Voorbereiding\//g,
      "from $1Components/Voorbereiding/",
    )
    .replace(
      /from\s+(["'])\.\/Nabewerking\//g,
      "from $1Components/Nabewerking/",
    )
    .replace(/from\s+(["'])\.\/Tools\//g, "from $1Components/HomePageTools/");

  if (c !== o) {
    fs.writeFileSync(f, c);
    changed++;
  }
}
console.log("global path retarget files:", changed);

// Fix relative escapes inside the moved trees
function fixEscapes(treeAbs, treeName) {
  let n = 0;
  for (const f of walk(treeAbs)) {
    let c = fs.readFileSync(f, "utf8");
    const o = c;
    // Deep relative escapes into src/hooks/zustand → absolute
    c = c.replace(
      /from\s+(["'])(?:\.\.\/)+hooks\/zustand\//g,
      "from $1hooks/zustand/",
    );
    // Relative escapes to Left/Common → absolute HomePage Common
    // Patterns like ../../../Common/ or ../../Common/ or ../../../../Common/
    c = c.replace(
      /from\s+(["'])(?:\.\.\/)+Common\//g,
      "from $1Components/HomePage/Body/Left/Common/",
    );
    // Nabewerking → Voorbereiding ViewPlan Loading
    c = c.replace(
      /from\s+(["'])(?:\.\.\/)+Voorbereiding\//g,
      "from $1Components/Voorbereiding/",
    );
    if (c !== o) {
      fs.writeFileSync(f, c);
      n++;
    }
  }
  console.log("escape fixes in", treeName, ":", n);
}

fixEscapes(path.join(src, "Components/Voorbereiding"), "Voorbereiding");
fixEscapes(path.join(src, "Components/Nabewerking"), "Nabewerking");
fixEscapes(path.join(src, "Components/HomePageTools"), "HomePageTools");

console.log("P4 split done");
