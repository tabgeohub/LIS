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

const PREFIX = "Components/HomePage/Body/Left/Common/";

// False positives: local feature Common modules rewritten to Left/Common
const LOCAL_FIXES = [
  // AddPointsVluchtPlan
  {
    filesUnder: "Components/Voorbereiding/AddPointsVluchtPlan",
    map: {
      AddPointsVluchtPlanStepContent: "Components/Voorbereiding/AddPointsVluchtPlan/Common/AddPointsVluchtPlanStepContent",
      StepContent: "Components/Voorbereiding/AddPointsVluchtPlan/Common/StepContent",
      Filter: "Components/Voorbereiding/AddPointsVluchtPlan/Common/Filter",
      Header: "Components/Voorbereiding/AddPointsVluchtPlan/Common/Header",
      PointsList: "Components/Voorbereiding/AddPointsVluchtPlan/Common/PointsList",
    },
  },
  // FlightPlan
  {
    filesUnder: "Components/Voorbereiding/FlightPlan",
    map: {
      Filter: "Components/Voorbereiding/FlightPlan/Common/Filter",
      Header: "Components/Voorbereiding/FlightPlan/Common/Header",
      PointsList: "Components/Voorbereiding/FlightPlan/Common/PointsList",
      GeometriesList: "Components/Voorbereiding/FlightPlan/Common/GeometriesList",
    },
  },
  // EnrichedAddPoint
  {
    filesUnder: "Components/Voorbereiding/EnrichedAddPoint",
    map: {
      SearchWidget: "Components/Voorbereiding/EnrichedAddPoint/Common/SearchWidget",
    },
  },
  // ReuseFlightPlan — Loading + Filter live in ReuseFlightPlan/Common
  {
    filesUnder: "Components/Voorbereiding/ReuseFlightPlan",
    map: {
      Filter: "Components/Voorbereiding/ReuseFlightPlan/Common/Filter",
      Loading: "Components/Voorbereiding/ReuseFlightPlan/Common/Loading",
    },
  },
  // SelectedPoint formik helpers
  {
    filesUnder: "Components/Voorbereiding/SelectedPoint",
    map: {
      InputFormik: "Components/Voorbereiding/SelectedPoint/Common/InputFormik",
      SelectFormik: "Components/Voorbereiding/SelectedPoint/Common/SelectFormik",
    },
  },
];

let n = 0;
for (const group of LOCAL_FIXES) {
  const root = path.join(src, group.filesUnder);
  for (const f of walk(root)) {
    let c = fs.readFileSync(f, "utf8");
    const o = c;
    for (const [name, target] of Object.entries(group.map)) {
      const re = new RegExp(
        `from\\s+(["'])${PREFIX.replace(/\//g, "\\/")}${name}\\1`,
        "g",
      );
      c = c.replace(re, `from $1${target}$1`);
    }
    if (c !== o) {
      fs.writeFileSync(f, c);
      n++;
    }
  }
}
console.log("local Common false-positive fixes:", n);

// Fix remaining HomePage relative paths to moved trees
const REL_FIXES = [
  [
    /from\s+(["'])(?:\.\.\/)*Left\/Voorbereiding\//g,
    "from $1Components/Voorbereiding/",
  ],
  [
    /from\s+(["'])(?:\.\.\/)*Left\/Nabewerking\//g,
    "from $1Components/Nabewerking/",
  ],
  [
    /from\s+(["'])(?:\.\.\/)*Left\/Tools\//g,
    "from $1Components/HomePageTools/",
  ],
  [
    /from\s+(["'])\.\.\/Body\/Left\/Tools\//g,
    "from $1Components/HomePageTools/",
  ],
  [
    /from\s+(["'])\.\.\/Left\/Tools\//g,
    "from $1Components/HomePageTools/",
  ],
];

n = 0;
for (const f of walk(src)) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  for (const [re, rep] of REL_FIXES) c = c.replace(re, rep);
  // also absolute-ish broken paths
  c = c
    .split("Components/HomePage/Body/Left/Voorbereiding/")
    .join("Components/Voorbereiding/")
    .split("Components/HomePage/Body/Left/Nabewerking/")
    .join("Components/Nabewerking/")
    .split("Components/HomePage/Body/Left/Tools/")
    .join("Components/HomePageTools/");
  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
  }
}
console.log("remaining path fixes:", n);

// InputFormik / SelectFormik — locate and fix if needed
function findFile(base, name) {
  for (const f of walk(path.join(src, base))) {
    if (f.endsWith(path.sep + name) || f.endsWith("/" + name)) return f;
  }
  return null;
}
console.log(
  "InputFormik at",
  findFile("Components", "InputFormik.tsx") ||
    findFile("Components", "InputFormik.ts"),
);
console.log(
  "SelectFormik at",
  findFile("Components", "SelectFormik.tsx") ||
    findFile("Components", "SelectFormik.ts"),
);
