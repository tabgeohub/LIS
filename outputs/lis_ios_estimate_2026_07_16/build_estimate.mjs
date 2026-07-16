import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = new URL("./", import.meta.url).pathname.replace(/^\/(.:)/, "$1");
const outputPath = `${outputDir}LIS_iOS_300_Plus_Auto_Layers_Estimate.xlsx`;

const navy = "#16324F";
const blue = "#246BFD";
const lightBlue = "#EAF2FF";
const paleBlue = "#F5F8FC";
const green = "#1B7F5A";
const lightGreen = "#E9F7F1";
const amber = "#B76E00";
const lightAmber = "#FFF4DE";
const red = "#B42318";
const lightRed = "#FDECEC";
const text = "#1F2937";
const muted = "#667085";
const border = "#D8E0EA";
const white = "#FFFFFF";

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Summary");
const detail = workbook.worksheets.add("Detailed Estimate");
const auto = workbook.worksheets.add("Auto Layers Update");
const assumptions = workbook.worksheets.add("Assumptions");

for (const sheet of [summary, detail, auto, assumptions]) {
  sheet.showGridLines = false;
}

// ---------------- Detailed Estimate ----------------
detail.getRange("A1:H1").merge();
detail.getRange("A1").values = [["LIS iOS — Greenfield Implementation Estimate"]];
detail.getRange("A1:H1").format = {
  fill: navy,
  font: { bold: true, color: white, size: 18 },
  verticalAlignment: "center",
};
detail.getRange("A1:H1").format.rowHeight = 34;

detail.getRange("A2:H2").merge();
detail.getRange("A2").values = [["Core iOS application target: 300 hours. Automatic map/layer updates are estimated separately."]];
detail.getRange("A2:H2").format = {
  fill: lightBlue,
  font: { color: navy, italic: true },
  verticalAlignment: "center",
};
detail.getRange("A2:H2").format.rowHeight = 26;

const detailHeaders = [["ID", "Module", "Scope / Included Work", "Hours", "% Total", "Primary Deliverable", "Dependency", "Risk"]];
detail.getRange("A5:H5").values = detailHeaders;
detail.getRange("A5:H5").format = {
  fill: blue,
  font: { bold: true, color: white },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: border },
};
detail.getRange("A5:H5").format.rowHeight = 30;

const modules = [
  [1, "Project Setup & Release Foundation", "Xcode project, environments, dependency setup, configuration, signing baseline and app structure.", 8, null, "Buildable project foundation", "Apple account / Xcode", "Low"],
  [2, "Architecture & Core Models", "App state, domain models, service/repository boundaries, shared errors and dependency injection.", 10, null, "Maintainable SwiftUI architecture", "Project setup", "Low"],
  [3, "Authentication & Regio", "Keycloak login, Keychain storage, session expiry/refresh, /auth/me, logout and regio resolution.", 18, null, "Secure authenticated session", "Stable auth APIs", "Medium"],
  [4, "API Client & DTO Mapping", "Reusable API client, request/response handling, DTOs, model mappers and authenticated calls.", 16, null, "Typed API integration layer", "Authentication", "Medium"],
  [5, "Flight Plan Selection & Opening", "Fetch regional plans, list/select/open flow, download required data and create active session.", 14, null, "Usable plan preparation flow", "API client", "Low"],
  [6, "Offline TPK/TPKX Basemap", "Import, validate, store and load offline tile packages; missing/corrupt/storage handling.", 16, null, "Reliable offline basemap", "ArcGIS SDK", "Medium"],
  [7, "Map Workspace & Geometry Layers", "ArcGIS map, points, lines, polygons, symbols, selection, locked layers and map interactions.", 30, null, "Operational inspection map", "Plans + basemap", "High"],
  [8, "Inspection Workflow", "Shared point/geometry form, notes, statuses, item colors, open-item workflow and list/map synchronization.", 23, null, "Complete local inspection flow", "Map workspace", "Medium"],
  [9, "Local Storage & Recovery", "Autosave, active-session JSON, finished plans, atomic writes, restart/crash recovery and safe cleanup.", 28, null, "No-loss local-first storage", "Core models", "High"],
  [10, "GPS, Helicopter & Flight Path", "CoreLocation permissions, current position, speed/altitude/course, red path and local track storage.", 18, null, "Live flight navigation data", "Map + local storage", "Medium"],
  [11, "Photos & Attachments", "Camera, photo library/files, local originals/thumbnails, point/geometry attachment and safe retention.", 18, null, "Local-first photo workflow", "Inspection + storage", "Medium"],
  [12, "Timer & Action Logs", "Start/pause/resume timer, persisted timer state, essential action logging and logs payload.", 10, null, "Persisted timer and logs", "Local storage", "Low"],
  [13, "Finish, Upload & Retry", "Afronden/Verstuur, finished local plan, ArcGIS photo upload, plan/log uploads, retry and duplicate protection.", 30, null, "Reliable manual upload pipeline", "Auth + storage + photos", "High"],
  [14, "Settings & Critical Error Handling", "Logout, pending uploads, storage/map status, permission errors and safe destructive confirmations.", 10, null, "Basic support and recovery UI", "All core modules", "Medium"],
  [15, "Testing, Field QA & TestFlight", "Unit/integration/UI tests, real iPad, offline/crash/auth/upload cases, fixes, archive and TestFlight release.", 51, null, "Pilot-ready tested build", "All modules", "High"],
];

detail.getRange("A6:H20").values = modules;
detail.getRange("E6").formulas = [["=D6/$D$21"]];
detail.getRange("E6:E20").fillDown();
detail.getRange("A21:C21").merge();
detail.getRange("A21").values = [["CORE IOS APP TOTAL"]];
detail.getRange("D21").formulas = [["=SUM(D6:D20)"]];
detail.getRange("E21").formulas = [["=SUM(E6:E20)"]];
detail.getRange("F21:H21").merge();
detail.getRange("F21").values = [["Automatic layers update excluded"]];

detail.getRange("A6:H20").format = {
  font: { color: text, size: 10 },
  verticalAlignment: "top",
  wrapText: true,
  borders: { insideHorizontal: { style: "thin", color: border } },
};
detail.getRange("D6:E21").format.horizontalAlignment = "right";
detail.getRange("D6:D21").format.numberFormat = "#,##0";
detail.getRange("E6:E21").format.numberFormat = "0.0%";
detail.getRange("A21:H21").format = {
  fill: navy,
  font: { bold: true, color: white },
  verticalAlignment: "center",
  borders: { preset: "outside", style: "medium", color: navy },
};
detail.getRange("A21:H21").format.rowHeight = 28;

for (let row = 6; row <= 20; row++) {
  if (row % 2 === 0) detail.getRange(`A${row}:H${row}`).format.fill = paleBlue;
}
detail.getRange("H6:H20").conditionalFormats.add("containsText", { text: "High", format: { fill: lightRed, font: { color: red, bold: true } } });
detail.getRange("H6:H20").conditionalFormats.add("containsText", { text: "Medium", format: { fill: lightAmber, font: { color: amber, bold: true } } });
detail.getRange("H6:H20").conditionalFormats.add("containsText", { text: "Low", format: { fill: lightGreen, font: { color: green, bold: true } } });
detail.freezePanes.freezeRows(5);
detail.getRange("A:A").format.columnWidth = 6;
detail.getRange("B:B").format.columnWidth = 28;
detail.getRange("C:C").format.columnWidth = 57;
detail.getRange("D:D").format.columnWidth = 10;
detail.getRange("E:E").format.columnWidth = 11;
detail.getRange("F:F").format.columnWidth = 31;
detail.getRange("G:G").format.columnWidth = 26;
detail.getRange("H:H").format.columnWidth = 12;
detail.getRange("A6:H20").format.rowHeight = 46;

// ---------------- Auto Layers Update ----------------
auto.getRange("A1:F1").merge();
auto.getRange("A1").values = [["Automatic TPK / Operational Layers Update — Separate 35-Hour Add-On"]];
auto.getRange("A1:F1").format = { fill: navy, font: { bold: true, color: white, size: 17 }, verticalAlignment: "center" };
auto.getRange("A1:F1").format.rowHeight = 34;
auto.getRange("A2:F2").merge();
auto.getRange("A2").values = [["This 35-hour module is separate from the 300-hour core iOS application estimate."]];
auto.getRange("A2:F2").format = { fill: lightBlue, font: { color: navy, italic: true }, wrapText: true };
auto.getRange("A2:F2").format.rowHeight = 30;

auto.getRange("A5:F5").values = [["ID", "Work Item", "Included Work", "Hours", "% Auto Update", "Output"]];
auto.getRange("A5:F5").format = { fill: blue, font: { bold: true, color: white }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };

const autoRows = [
  [1, "Update Architecture", "Package/layer ownership, region strategy, version rules and update lifecycle.", 5, null, "Approved update design"],
  [2, "Monthly Generation Job", "Scheduled server script/job that generates or publishes the new package/layer release.", 7, null, "Repeatable monthly job"],
  [3, "Manifest & Integrity Metadata", "Version, publish date, URL, size, SHA-256, minimum app version and region metadata.", 4, null, "Version manifest endpoint/file"],
  [4, "iOS Version Check", "Check on launch/network return/manual refresh; compare installed and available versions.", 5, null, "Update availability manager"],
  [5, "Background Download & Storage", "Background URLSession, progress, space checks, temporary file and resumable behavior.", 5, null, "Reliable package download"],
  [6, "Validation, Atomic Swap & Rollback", "Verify integrity and ArcGIS load, avoid active-flight replacement, preserve last-known-good version.", 5, null, "Safe activation and rollback"],
  [7, "Update QA & Failure Scenarios", "Interrupted download, invalid manifest/package, low storage, offline mode and monthly rerun testing.", 4, null, "Verified failure-safe update flow"],
];
auto.getRange("A6:F12").values = autoRows;
auto.getRange("E6").formulas = [["=D6/$D$13"]];
auto.getRange("E6:E12").fillDown();
auto.getRange("A13:C13").merge();
auto.getRange("A13").values = [["AUTO UPDATE TOTAL"]];
auto.getRange("D13").formulas = [["=SUM(D6:D12)"]];
auto.getRange("E13").formulas = [["=SUM(E6:E12)"]];
auto.getRange("F13").values = [["Excluded from 300-hour core app"]];
auto.getRange("A6:F12").format = { font: { color: text, size: 10 }, verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: border } } };
for (let row = 6; row <= 12; row++) if (row % 2 === 0) auto.getRange(`A${row}:F${row}`).format.fill = paleBlue;
auto.getRange("A13:F13").format = { fill: navy, font: { bold: true, color: white }, verticalAlignment: "center" };
auto.getRange("D6:D13").format.numberFormat = "#,##0";
auto.getRange("E6:E13").format.numberFormat = "0.0%";
auto.getRange("D6:E13").format.horizontalAlignment = "right";
auto.freezePanes.freezeRows(5);
auto.getRange("A:A").format.columnWidth = 6;
auto.getRange("B:B").format.columnWidth = 30;
auto.getRange("C:C").format.columnWidth = 62;
auto.getRange("D:D").format.columnWidth = 10;
auto.getRange("E:E").format.columnWidth = 16;
auto.getRange("F:F").format.columnWidth = 31;
auto.getRange("A6:F12").format.rowHeight = 45;

// ---------------- Assumptions ----------------
assumptions.getRange("A1:D1").merge();
assumptions.getRange("A1").values = [["Estimate Assumptions & Boundaries"]];
assumptions.getRange("A1:D1").format = { fill: navy, font: { bold: true, color: white, size: 17 }, verticalAlignment: "center" };
assumptions.getRange("A1:D1").format.rowHeight = 34;

assumptions.getRange("A4:C4").merge();
assumptions.getRange("D4").values = [["Value"]];
assumptions.getRange("A4").values = [["Planning Input"]];
assumptions.getRange("A5:C8").merge(true);
assumptions.getRange("A5:A8").values = [["Productive hours / week"], ["Contingency"], ["Weeks / month"], ["Baseline scope starts from"]];
assumptions.getRange("D5:D8").values = [[35], [0.15], [4.33], ["Greenfield / zero implementation"]];
assumptions.getRange("A4:D4").format = { fill: blue, font: { bold: true, color: white } };
assumptions.getRange("D5").format.numberFormat = "#,##0";
assumptions.getRange("D6").format.numberFormat = "0%";
assumptions.getRange("D7").format.numberFormat = "0.00";

assumptions.getRange("A11:D11").values = [["#", "Assumption", "Included Interpretation", "Impact if False"]];
assumptions.getRange("A11:D11").format = { fill: blue, font: { bold: true, color: white }, horizontalAlignment: "center", wrapText: true };
const assumptionRows = [
  [1, "Existing APIs are available and stable", "No major backend redesign; endpoint contracts can be consumed from Swift.", "Add backend analysis/change hours."],
  [2, "Windows/Web workflows are the functional reference", "Business rules and expected behavior are known; limited discovery is needed.", "Add product discovery and specification time."],
  [3, "AI coding tools are used actively", "AI accelerates models, DTOs, SwiftUI scaffolding, refactors and test generation.", "Increase implementation hours by approximately 20–35%."],
  [4, "One experienced Swift developer", "Estimate is effort, not a fixed calendar promise; parallel staffing is not assumed.", "Ramp-up or coordination changes duration."],
  [5, "Auto update uses a server-side monthly schedule", "iOS checks/downloads when allowed; iOS does not guarantee exact monthly background execution.", "A different update architecture may add scope."],
  [6, "TPK/TPKX package hosting is available", "A protected file location or simple endpoint can serve versioned packages and manifest.", "Add infrastructure/security implementation."],
  [7, "No advanced Phase-2 extras", "No background GPS, external GNSS, advanced admin console or complex conflict resolution.", "Estimate separately if requested."],
  [8, "Real-device access is available", "A Mac, test iPad and TestFlight access are available throughout development.", "External waiting time extends calendar duration."],
];
assumptions.getRange("A12:D19").values = assumptionRows;
assumptions.getRange("A12:D19").format = { font: { color: text, size: 10 }, verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: border } } };
for (let row = 12; row <= 19; row++) if (row % 2 === 0) assumptions.getRange(`A${row}:D${row}`).format.fill = paleBlue;

assumptions.getRange("A22:B22").merge();
assumptions.getRange("C22:D22").merge();
assumptions.getRange("A22").values = [["Reference"]];
assumptions.getRange("C22").values = [["URL"]];
assumptions.getRange("A23:B25").merge(true);
assumptions.getRange("C23:D25").merge(true);
assumptions.getRange("A23:A25").values = [["Apple background downloads"], ["Apple background processing"], ["ArcGIS scheduled offline updates"]];
assumptions.getRange("C23:C25").values = [["https://developer.apple.com/documentation/foundation/downloading-files-in-the-background"], ["https://developer.apple.com/documentation/backgroundtasks/bgprocessingtask"], ["https://developers.arcgis.com/swift/v200/sample-code/apply-scheduled-updates-to-preplanned-map-area/"]];
assumptions.getRange("A22:D22").format = { fill: blue, font: { bold: true, color: white } };
assumptions.getRange("A23:D25").format = { font: { color: text, size: 10 }, wrapText: true, verticalAlignment: "top" };
assumptions.freezePanes.freezeRows(4);
assumptions.getRange("A:A").format.columnWidth = 8;
assumptions.getRange("B:B").format.columnWidth = 48;
assumptions.getRange("C:C").format.columnWidth = 58;
assumptions.getRange("D:D").format.columnWidth = 42;
assumptions.getRange("A12:D19").format.rowHeight = 48;
assumptions.getRange("A23:B25").format.rowHeight = 38;

// ---------------- Summary ----------------
summary.getRange("A1:H1").merge();
summary.getRange("A1").values = [["LIS iOS Implementation Estimate"]];
summary.getRange("A1:H1").format = { fill: navy, font: { bold: true, color: white, size: 20 }, verticalAlignment: "center" };
summary.getRange("A1:H1").format.rowHeight = 38;
summary.getRange("A2:H2").merge();
summary.getRange("A2").values = [["300-hour core iOS app + separate 35-hour automatic TPK/layers update module"]];
summary.getRange("A2:H2").format = { fill: lightBlue, font: { color: navy, italic: true }, verticalAlignment: "center" };
summary.getRange("A2:H2").format.rowHeight = 27;

summary.getRange("A4:B4").merge(); summary.getRange("A4").values = [["CORE IOS APP"]];
summary.getRange("C4:D4").merge(); summary.getRange("C4").values = [["AUTO UPDATE"]];
summary.getRange("E4:F4").merge(); summary.getRange("E4").values = [["COMBINED BASELINE"]];
summary.getRange("G4:H4").merge(); summary.getRange("G4").values = [["BUFFERED TOTAL"]];
summary.getRange("A5:B6").merge(); summary.getRange("A5").formulas = [["='Detailed Estimate'!D21"]];
summary.getRange("C5:D6").merge(); summary.getRange("C5").formulas = [["='Auto Layers Update'!D13"]];
summary.getRange("E5:F6").merge(); summary.getRange("E5").formulas = [["=A5+C5"]];
summary.getRange("G5:H6").merge(); summary.getRange("G5").formulas = [["=E5*(1+'Assumptions'!D6)"]];

summary.getRange("A4:H4").format = { fill: blue, font: { bold: true, color: white }, horizontalAlignment: "center", verticalAlignment: "center" };
summary.getRange("A5:H6").format = { fill: white, font: { bold: true, color: navy, size: 20 }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: border } };
summary.getRange("A5:H6").format.numberFormat = "#,##0 \"hrs\"";

summary.getRange("A8:B8").values = [["Schedule Metric", "Value"]];
summary.getRange("A9:A13").values = [["Productive hours / week"], ["Core app working weeks"], ["Combined baseline weeks"], ["Buffered working weeks"], ["Buffered calendar months"]];
summary.getRange("B9").formulas = [["='Assumptions'!D5"]];
summary.getRange("B10").formulas = [["=A5/B9"]];
summary.getRange("B11").formulas = [["=E5/B9"]];
summary.getRange("B12").formulas = [["=G5/B9"]];
summary.getRange("B13").formulas = [["=B12/'Assumptions'!D7"]];
summary.getRange("A8:B8").format = { fill: navy, font: { bold: true, color: white } };
summary.getRange("A9:B13").format = { fill: paleBlue, font: { color: text }, borders: { insideHorizontal: { style: "thin", color: border } } };
summary.getRange("B9").format.numberFormat = "#,##0";
summary.getRange("B10:B13").format.numberFormat = "0.0";

summary.getRange("D8:F8").values = [["Workstream", "Hours", "% Total"]];
summary.getRange("D9:D14").values = [["Foundation"], ["Access & Data"], ["Map & Field Workflow"], ["Reliability & Delivery"], ["Auto Layers Update"], ["Testing & Release"]];
summary.getRange("E9").formulas = [["=SUM('Detailed Estimate'!D6:D7)"]];
summary.getRange("E10").formulas = [["=SUM('Detailed Estimate'!D8:D10)"]];
summary.getRange("E11").formulas = [["=SUM('Detailed Estimate'!D11:D13)+'Detailed Estimate'!D15+'Detailed Estimate'!D16"]];
summary.getRange("E12").formulas = [["='Detailed Estimate'!D14+'Detailed Estimate'!D17+'Detailed Estimate'!D18+'Detailed Estimate'!D19"]];
summary.getRange("E13").formulas = [["='Auto Layers Update'!D13"]];
summary.getRange("E14").formulas = [["='Detailed Estimate'!D20"]];
summary.getRange("F9").formulas = [["=E9/$E$5"]];
summary.getRange("F9:F14").fillDown();
summary.getRange("D8:F8").format = { fill: navy, font: { bold: true, color: white }, horizontalAlignment: "center" };
summary.getRange("D9:F14").format = { fill: paleBlue, font: { color: text }, borders: { insideHorizontal: { style: "thin", color: border } } };
summary.getRange("E9:E14").format.numberFormat = "#,##0";
summary.getRange("F9:F14").format.numberFormat = "0.0%";

summary.getRange("A16:H16").merge();
summary.getRange("A16").values = [["Key Scope Notes"]];
summary.getRange("A16:H16").format = { fill: navy, font: { bold: true, color: white } };
summary.getRange("A17:H20").merge(true);
summary.getRange("A17:H20").values = [
  ["• The core iOS application is estimated at 300 hours; automatic monthly map/layer updates add 35 hours separately."],
  ["• Existing stable APIs, known LIS Desktop/Web behavior and AI development tools are reflected in the estimate."],
  ["• The combined baseline is 335 hours; the 15% contingency is shown separately and produces the buffered total."],
  ["• Calendar duration depends on device access, review cycles, API stability and field-test availability."],
];
summary.getRange("A17:H20").format = { fill: lightBlue, font: { color: text }, wrapText: true, verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: border } };
summary.getRange("A17:H20").format.rowHeight = 27;

summary.getRange("A:A").format.columnWidth = 26;
summary.getRange("B:B").format.columnWidth = 16;
summary.getRange("C:C").format.columnWidth = 4;
summary.getRange("D:D").format.columnWidth = 30;
summary.getRange("E:E").format.columnWidth = 13;
summary.getRange("F:F").format.columnWidth = 13;
summary.getRange("G:G").format.columnWidth = 15;
summary.getRange("H:H").format.columnWidth = 15;
summary.freezePanes.freezeRows(2);

// Workbook verification before export.
const detailCheck = await workbook.inspect({
  kind: "table",
  range: "Detailed Estimate!A5:H21",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 8,
});
console.log(detailCheck.ndjson);

const errorCheck = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errorCheck.ndjson);

for (const sheetName of ["Summary", "Detailed Estimate", "Auto Layers Update", "Assumptions"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}${sheetName.replaceAll(" ", "_")}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED:${outputPath}`);
