/**
 * Architecture huge push: extract shared UI/hooks from HomePage,
 * evacuate feature stores, extract flight-plan UI kit.
 * Behavior-preserving path moves + import rewrites only.
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const src = path.join(root, "src");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyDir(from, to) {
  ensureDir(to);
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name);
    const b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
}

function movePath(from, to) {
  if (!fs.existsSync(from)) {
    console.log("  skip missing:", path.relative(root, from));
    return false;
  }
  if (fs.existsSync(to)) {
    console.log("  skip exists:", path.relative(root, to));
    return false;
  }
  ensureDir(path.dirname(to));
  const st = fs.statSync(from);
  if (st.isDirectory()) {
    copyDir(from, to);
    fs.rmSync(from, { recursive: true, force: true });
  } else {
    fs.copyFileSync(from, to);
    fs.unlinkSync(from);
  }
  console.log("  moved", path.relative(root, from), "→", path.relative(root, to));
  return true;
}

/** Absolute import prefix rewrites (longest-first). */
const REWRITES = [];

function addRewrite(oldAbs, newAbs) {
  REWRITES.push({ oldAbs, newAbs });
}

function applyRewrites(content) {
  let c = content;
  const sorted = [...REWRITES].sort((a, b) => b.oldAbs.length - a.oldAbs.length);
  for (const { oldAbs, newAbs } of sorted) {
    c = c.split(oldAbs).join(newAbs);
  }
  return c;
}

function rewriteAll() {
  let changed = 0;
  for (const f of walk(src)) {
    let c = fs.readFileSync(f, "utf8");
    const o = c;
    c = applyRewrites(c);
    if (c !== o) {
      fs.writeFileSync(f, c);
      changed++;
    }
  }
  console.log("rewrote", changed, "files");
}

// ---------------------------------------------------------------------------
// Wave 1 — Shared UI → Components/Common
// ---------------------------------------------------------------------------
console.log("\n=== Wave 1: Common UI ===");

const w1 = [
  [
    "Components/HomePage/Body/Common/Wizard",
    "Components/Common/Wizard",
    "Components/HomePage/Body/Common/Wizard/",
    "Components/Common/Wizard/",
  ],
  [
    "Components/HomePage/Body/Left/Common/ScrollButtonsLayout.tsx",
    "Components/Common/ScrollButtonsLayout.tsx",
    "Components/HomePage/Body/Left/Common/ScrollButtonsLayout",
    "Components/Common/ScrollButtonsLayout",
  ],
  [
    "Components/HomePage/Body/Common/LoadingBars.tsx",
    "Components/Common/LoadingBars.tsx",
    "Components/HomePage/Body/Common/LoadingBars",
    "Components/Common/LoadingBars",
  ],
  [
    "Components/HomePage/Body/Common/Modal.tsx",
    "Components/Common/Modal.tsx",
    "Components/HomePage/Body/Common/Modal",
    "Components/Common/Modal",
  ],
  [
    "Components/HomePage/Body/Common/CancelModal.tsx",
    "Components/Common/CancelModal.tsx",
    "Components/HomePage/Body/Common/CancelModal",
    "Components/Common/CancelModal",
  ],
  [
    "Components/HomePage/Body/Left/Common/FormComponents",
    "Components/Common/FormComponents",
    "Components/HomePage/Body/Left/Common/FormComponents/",
    "Components/Common/FormComponents/",
  ],
];

for (const [fromRel, toRel, oldAbs, newAbs] of w1) {
  movePath(path.join(src, fromRel), path.join(src, toRel));
  addRewrite(oldAbs, newAbs);
}

// ---------------------------------------------------------------------------
// Wave 2 — Shared hooks out of HomePage
// ---------------------------------------------------------------------------
console.log("\n=== Wave 2: Shared hooks ===");

const w2 = [
  [
    "Components/HomePage/hooks/wizard",
    "hooks/wizard",
    "Components/HomePage/hooks/wizard/",
    "hooks/wizard/",
  ],
  [
    "Components/HomePage/hooks/consts",
    "hooks/consts",
    "Components/HomePage/hooks/consts/",
    "hooks/consts/",
  ],
  [
    "Components/HomePage/hooks/handleCancel",
    "hooks/handleCancel",
    "Components/HomePage/hooks/handleCancel/",
    "hooks/handleCancel/",
  ],
  [
    "Components/HomePage/hooks/hover-click-handlers",
    "hooks/hover-click",
    "Components/HomePage/hooks/hover-click-handlers/",
    "hooks/hover-click/",
  ],
  [
    "Components/HomePage/helpers/dom",
    "helpers/dom",
    "Components/HomePage/helpers/dom/",
    "helpers/dom/",
  ],
];

for (const [fromRel, toRel, oldAbs, newAbs] of w2) {
  movePath(path.join(src, fromRel), path.join(src, toRel));
  addRewrite(oldAbs, newAbs);
}

// useResetFeatures (+ siblings that are pure shared) — move individual files into hooks/features
const resetMoves = [
  "useResetFeatures.ts",
  "useResetPointFilters.ts",
  "useFetchInitialFeatures.ts",
];
for (const name of resetMoves) {
  const from = path.join(src, "Components/HomePage/hooks/features", name);
  const to = path.join(src, "hooks/features", name);
  if (movePath(from, to)) {
    addRewrite(
      `Components/HomePage/hooks/features/${name.replace(/\.tsx?$/, "")}`,
      `hooks/features/${name.replace(/\.tsx?$/, "")}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Wave 3 — Evacuate feature stores
// ---------------------------------------------------------------------------
console.log("\n=== Wave 3: Evacuate stores ===");

const w3HomePage = [
  [
    "Components/HomePage/hooks/zustand/voorbereiding/useViewPlanState.ts",
    "Components/Voorbereiding/ViewPlan/useViewPlanState.ts",
    "Components/HomePage/hooks/zustand/voorbereiding/useViewPlanState",
    "Components/Voorbereiding/ViewPlan/useViewPlanState",
  ],
  [
    "Components/HomePage/hooks/zustand/voorbereiding/useFlightPlanState.ts",
    "Components/Voorbereiding/FlightPlan/useFlightPlanState.ts",
    "Components/HomePage/hooks/zustand/voorbereiding/useFlightPlanState",
    "Components/Voorbereiding/FlightPlan/useFlightPlanState",
  ],
  [
    "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState.ts",
    "Components/Nabewerking/VluchtenZoeken/useFinishedPlansState.ts",
    "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState",
    "Components/Nabewerking/VluchtenZoeken/useFinishedPlansState",
  ],
  [
    "Components/HomePage/hooks/zustand/nabewerking/useChangePlanStatusState.ts",
    "Components/Nabewerking/ChangeFlightPlanStatus/useChangePlanStatusState.ts",
    "Components/HomePage/hooks/zustand/nabewerking/useChangePlanStatusState",
    "Components/Nabewerking/ChangeFlightPlanStatus/useChangePlanStatusState",
  ],
];

for (const [fromRel, toRel, oldAbs, newAbs] of w3HomePage) {
  movePath(path.join(src, fromRel), path.join(src, toRel));
  addRewrite(oldAbs, newAbs);
}

// CreateReport state is a folder of related files
const createReportFrom = path.join(
  src,
  "Components/HomePage/hooks/zustand/nabewerking",
);
const createReportFiles = [
  "useCreateReportState.ts",
  "createReportStateValues.ts",
  "createReportSetters.ts",
  "createReportStateTypes.ts",
  "createReportClearState.ts",
];
const createReportTo = path.join(src, "Components/Nabewerking/CreateReport/state");
ensureDir(createReportTo);
for (const name of createReportFiles) {
  const from = path.join(createReportFrom, name);
  const to = path.join(createReportTo, name);
  if (movePath(from, to)) {
    addRewrite(
      `Components/HomePage/hooks/zustand/nabewerking/${name.replace(/\.tsx?$/, "")}`,
      `Components/Nabewerking/CreateReport/state/${name.replace(/\.tsx?$/, "")}`,
    );
  }
}

// Delete point state kit
const deletePointFrom = path.join(src, "Components/HomePage/hooks/zustand/tools");
const deletePointFiles = [
  "useDeletePointState.ts",
  "deletePointStateCore.ts",
  "deletePointFormFields.ts",
  "deletePointStateTypes.ts",
];
const deletePointTo = path.join(
  src,
  "Components/HomePageTools/AandachtspuntenVerwijderen/state",
);
ensureDir(deletePointTo);
for (const name of deletePointFiles) {
  const from = path.join(deletePointFrom, name);
  const to = path.join(deletePointTo, name);
  if (movePath(from, to)) {
    addRewrite(
      `Components/HomePage/hooks/zustand/tools/${name.replace(/\.tsx?$/, "")}`,
      `Components/HomePageTools/AandachtspuntenVerwijderen/state/${name.replace(/\.tsx?$/, "")}`,
    );
  }
}

// Domain stores out of src/hooks/zustand
const w3Domain = [
  [
    "hooks/zustand/useDrawingStore.ts",
    "Components/Voorbereiding/DrawingTool/useDrawingStore.ts",
    "hooks/zustand/useDrawingStore",
    "Components/Voorbereiding/DrawingTool/useDrawingStore",
  ],
  [
    "hooks/zustand/useReuseFlightPlan.ts",
    "Components/Voorbereiding/ReuseFlightPlan/useReuseFlightPlan.ts",
    "hooks/zustand/useReuseFlightPlan",
    "Components/Voorbereiding/ReuseFlightPlan/useReuseFlightPlan",
  ],
  [
    "hooks/zustand/useDeleteFlightPlan.ts",
    "Components/Voorbereiding/RemoveFlightPlan/useDeleteFlightPlan.ts",
    "hooks/zustand/useDeleteFlightPlan",
    "Components/Voorbereiding/RemoveFlightPlan/useDeleteFlightPlan",
  ],
  [
    "hooks/zustand/useAddPointStates.ts",
    "Components/Voorbereiding/AddPointsVluchtPlan/useAddPointStates.ts",
    "hooks/zustand/useAddPointStates",
    "Components/Voorbereiding/AddPointsVluchtPlan/useAddPointStates",
  ],
];

for (const [fromRel, toRel, oldAbs, newAbs] of w3Domain) {
  movePath(path.join(src, fromRel), path.join(src, toRel));
  addRewrite(oldAbs, newAbs);
}

// Enriched point state cluster
const enrichedFiles = [
  "useEnrichedPointState.ts",
  "enrichedPointStateActions.ts",
  "enrichedPointStateDefaults.ts",
  "enrichedPointStateDefaults.test.ts",
  "enrichedPointStateTypes.ts",
  "pickEnrichedCoordinateControls.ts",
];
const enrichedTo = path.join(src, "Components/Voorbereiding/EnrichedAddPoint/state");
ensureDir(enrichedTo);
for (const name of enrichedFiles) {
  const from = path.join(src, "hooks/zustand", name);
  const to = path.join(enrichedTo, name);
  if (movePath(from, to)) {
    addRewrite(
      `hooks/zustand/${name.replace(/\.tsx?$/, "")}`,
      `Components/Voorbereiding/EnrichedAddPoint/state/${name.replace(/\.tsx?$/, "")}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Wave 4 — Flight-plan / EditPoint UI kit → Common
// ---------------------------------------------------------------------------
console.log("\n=== Wave 4: Flight-plan UI kit ===");

const w4 = [
  [
    "Components/HomePage/Body/Common/EditPoint",
    "Components/Common/EditPoint",
    "Components/HomePage/Body/Common/EditPoint/",
    "Components/Common/EditPoint/",
  ],
  [
    "Components/HomePage/Body/Common/ViewPlan",
    "Components/Common/ViewPlan",
    "Components/HomePage/Body/Common/ViewPlan/",
    "Components/Common/ViewPlan/",
  ],
  [
    "Components/HomePage/Body/Left/Common/FlightPlanSummary.tsx",
    "Components/Common/FlightPlanSummary.tsx",
    "Components/HomePage/Body/Left/Common/FlightPlanSummary",
    "Components/Common/FlightPlanSummary",
  ],
  [
    "Components/HomePage/Body/Left/Common/FlightPlanClickableRow.tsx",
    "Components/Common/FlightPlanClickableRow.tsx",
    "Components/HomePage/Body/Left/Common/FlightPlanClickableRow",
    "Components/Common/FlightPlanClickableRow",
  ],
  [
    "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields.tsx",
    "Components/Common/AandachtspuntDetailsFields.tsx",
    "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields",
    "Components/Common/AandachtspuntDetailsFields",
  ],
  [
    "Components/HomePage/Body/Left/Common/PlanInformationPanel.tsx",
    "Components/Common/PlanInformationPanel.tsx",
    "Components/HomePage/Body/Left/Common/PlanInformationPanel",
    "Components/Common/PlanInformationPanel",
  ],
  [
    "Components/HomePage/Body/Left/Common/FlightPlanForm",
    "Components/Common/FlightPlanForm",
    "Components/HomePage/Body/Left/Common/FlightPlanForm/",
    "Components/Common/FlightPlanForm/",
  ],
  [
    "Components/HomePage/Body/Common/ImageGallery.tsx",
    "Components/Common/ImageGallery.tsx",
    "Components/HomePage/Body/Common/ImageGallery",
    "Components/Common/ImageGallery",
  ],
  [
    "Components/HomePage/Body/Common/ImageGalleryToolbar.tsx",
    "Components/Common/ImageGalleryToolbar.tsx",
    "Components/HomePage/Body/Common/ImageGalleryToolbar",
    "Components/Common/ImageGalleryToolbar",
  ],
  [
    "Components/HomePage/Body/Common/ImageGalleryLightModal.tsx",
    "Components/Common/ImageGalleryLightModal.tsx",
    "Components/HomePage/Body/Common/ImageGalleryLightModal",
    "Components/Common/ImageGalleryLightModal",
  ],
  [
    "Components/HomePage/Body/Common/useImageGalleryPreload.ts",
    "Components/Common/useImageGalleryPreload.ts",
    "Components/HomePage/Body/Common/useImageGalleryPreload",
    "Components/Common/useImageGalleryPreload",
  ],
];

for (const [fromRel, toRel, oldAbs, newAbs] of w4) {
  movePath(path.join(src, fromRel), path.join(src, toRel));
  addRewrite(oldAbs, newAbs);
}

console.log("\n=== Applying import rewrites ===");
rewriteAll();

// Update hooks/features barrel to export useResetFeatures
const featuresBarrel = path.join(src, "hooks/features/index.ts");
if (fs.existsSync(featuresBarrel)) {
  let barrel = fs.readFileSync(featuresBarrel, "utf8");
  if (!barrel.includes("useResetFeatures") && fs.existsSync(path.join(src, "hooks/features/useResetFeatures.ts"))) {
    barrel += `\nexport { useResetFeatures } from "./useResetFeatures";\n`;
    if (fs.existsSync(path.join(src, "hooks/features/useResetPointFilters.ts"))) {
      barrel += `export { useResetPointFilters } from "./useResetPointFilters";\n`;
    }
    if (fs.existsSync(path.join(src, "hooks/features/useFetchInitialFeatures.ts"))) {
      barrel += `export { useFetchInitialFeatures } from "./useFetchInitialFeatures";\n`;
    }
    fs.writeFileSync(featuresBarrel, barrel);
    console.log("updated hooks/features barrel");
  }
}

// Clean empty dirs left behind
function rmEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) rmEmpty(path.join(dir, e.name));
  }
  try {
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  } catch {
    /* ignore */
  }
}
rmEmpty(path.join(src, "Components/HomePage/hooks/zustand"));
rmEmpty(path.join(src, "Components/HomePage/hooks/features"));
rmEmpty(path.join(src, "Components/HomePage/helpers"));

console.log("\nDone.");
