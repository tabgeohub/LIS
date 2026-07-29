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

const replacements = [];

// ---- 1) hooks/map -> HomePage (fully HomePage-only) ----
{
  const from = path.join(src, "hooks", "map");
  const to = path.join(src, "Components", "HomePage", "hooks", "map");
  if (fs.existsSync(from)) {
    copyDir(from, to);
    fs.rmSync(from, { recursive: true, force: true });
    replacements.push(["hooks/map/", "Components/HomePage/hooks/map/"]);
    console.log("moved hooks/map");
  }
}

/**
 * Move a subset of files out of a helpers folder into HomePage.
 * Files left behind are referenced absolutely from the moved files.
 */
function moveSubset(folderRel, alias, targetRel, moveNames) {
  const from = path.join(src, folderRel);
  const to = path.join(src, targetRel);
  if (!fs.existsSync(from)) return console.log("missing", folderRel);
  fs.mkdirSync(to, { recursive: true });

  const stayStems = fs
    .readdirSync(from, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.(ts|tsx)$/.test(e.name))
    .map((e) => e.name)
    .filter((n) => !moveNames.includes(n))
    .map((n) => n.replace(/\.tsx?$/, ""));

  for (const name of moveNames) {
    const a = path.join(from, name);
    if (!fs.existsSync(a)) {
      console.log("  skip missing", name);
      continue;
    }
    let c = fs.readFileSync(a, "utf8");
    // relative refs to files that stay behind must become absolute
    for (const stem of stayStems) {
      for (const q of ['"', "'"]) {
        c = c
          .split(`from ${q}./${stem}${q}`)
          .join(`from ${q}${alias}/${stem}${q}`);
      }
    }
    fs.writeFileSync(path.join(to, name), c);
    fs.rmSync(a, { force: true });
  }
  console.log(`moved ${moveNames.length} files from ${folderRel}`);

  const targetAlias = targetRel.replace(/^Components\//, "Components/");
  for (const name of moveNames) {
    const stem = name.replace(/\.tsx?$/, "");
    for (const q of ['"', "'"]) {
      replacements.push([
        `${alias}/${stem}${q}`,
        `${targetAlias}/${stem}${q}`,
      ]);
    }
  }
}

// ---- 2) helpers/points subset ----
moveSubset(
  "helpers/points",
  "@helpers/points",
  "Components/HomePage/helpers/points",
  [
    "buildPointUpdatePayload.ts",
    "flightPlanPointExcel.ts",
    "flightPlanPointExcelCore.ts",
    "flightPlanPointExcel.test.ts",
    "herhalenFilter.ts",
    "herhalenSelection.ts",
    "pointColumnKeys.ts",
    "pointCoreDisplayColumns.ts",
    "pointCoreFieldKeys.ts",
    "pointCoreIdentityKeys.ts",
    "pointCorePayloadFields.ts",
    "pointExportColumns.ts",
    "pointImportRow.ts",
    "sortPointsByImageCount.ts",
  ]
);

// ---- 3) helpers/ArcGISHelpers subset ----
moveSubset(
  "helpers/ArcGISHelpers",
  "@helpers/ArcGISHelpers",
  "Components/HomePage/helpers/ArcGISHelpers",
  [
    "bufferFlightPlansOnLayer.ts",
    "bufferFlightPlansOnLayerCore.ts",
    "bufferGraphics.ts",
    "bufferPointsOnLayer.ts",
    "bufferPointsOnLayerCore.ts",
    "buildPlanBoundingBoxGraphic.ts",
    "buildPlanBoundingBoxGraphicCore.ts",
    "calculateCenterAndZoom.ts",
    "calculateCenterAndZoom.test.ts",
    "centerAndZoomFromPlan.ts",
    "centerAndZoomFromPlanCore.ts",
    "centerAndZoomMath.ts",
    "centerAndZoomMathCore.ts",
    "computeFlightPlanCentroid.ts",
    "createGeometryGraphic.ts",
    "createGeometryGraphicCore.ts",
    "createGeometryGraphicInternal.ts",
    "createGeometryMapGraphics.ts",
    "createNewPointEvent.ts",
    "createPin.ts",
    "createPlanBoundingBoxGraphic.ts",
    "createPoint.ts",
    "createPointMapGraphics.ts",
    "createSymbols.ts",
    "createYellowBorder.ts",
    "createYellowWgs84PointGraphic.ts",
    "finishedPlanCentroidMarkers.ts",
    "finishedPlanCentroidMarkersCore.ts",
    "finishedPlanMapGraphics.ts",
    "flightPlanMapActions.ts",
    "geometryGraphicBuilders.ts",
    "geometryGraphicSymbols.ts",
    "geometryGraphicTypes.ts",
    "geometryMapGraphicActions.ts",
    "geometryMapGraphicActionsCore.ts",
    "geometryMapGraphicFactories.ts",
    "geometryMapGraphicFactoriesCore.ts",
    "geometryNamedSymbolsA.ts",
    "geometryNamedSymbolsB.ts",
    "newPointEventCoords.ts",
    "pinGraphics.ts",
    "planBoundingBoxGeometry.ts",
    "planBoundingBoxGeometryCore.ts",
    "planBoundingBoxSymbols.ts",
    "planBoundingBoxSymbolsCore.ts",
    "planBoundingBoxSymbolsStar.ts",
    "planBoundingBoxTypes.ts",
    "planStarGraphics.ts",
    "planStarGraphicsCore.ts",
    "pointHoverGraphics.ts",
    "pointHoverPinSymbol.ts",
    "pointMapGraphicActions.ts",
    "pointMapGraphicActionsCore.ts",
    "pointMapGraphicFactories.ts",
    "pointMapGraphicFactoriesCore.ts",
    "replaceGraphics.ts",
    "resolveGeometrySymbolOptions.ts",
    "searchResultPointOutlineSymbol.ts",
    "selectedGeometryGraphics.ts",
    "starredPointSymbol.ts",
    "validateMapView.ts",
    "yellowMarkerSymbol.ts",
  ]
);

// ---- Apply import rewrites across src ----
const files = walk(src);
let changed = 0;
for (const f of files) {
  let c = fs.readFileSync(f, "utf8");
  const o = c;
  for (const [a, b] of replacements) c = c.split(a).join(b);
  c = c
    .split("Components/HomePage/Components/HomePage/")
    .join("Components/HomePage/");
  if (c !== o) {
    fs.writeFileSync(f, c);
    changed++;
  }
}
console.log("updated", changed, "files");
