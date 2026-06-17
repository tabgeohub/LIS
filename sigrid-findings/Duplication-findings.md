# Otg-lis Duplication Findings

**Source:** `Duplication findings.csv` + `Duplicates.csv`  
**Sigrid pillar:** Maintainability (code duplication)  
**Scan date:** 2026-06-10 (post-deploy) · **Last fixes:** themes 1–10 batch refactor ✓ (pending test)

---

## Summary

| Metric | Value |
|--------|-------|
| **Duplicate clusters** | **~0–5** remaining (est., rescan to confirm) |
| **Severity** | — |
| **Total redundant lines** | **~0–20** remaining (est.) |
| **File locations affected** | **~0–10** remaining (est.) |

**Progress vs original scan (2026-06-04):** 398 clusters → **~0–5** (−99%) · 1,038 file locations → **~0–10** (−99%)

---

## Resolved themes (2026-06-10 batch)

| Theme | Fix summary |
|-------|-------------|
| **1 HomePage UI** | `src/helpers/points/pointColumnKeys.ts` — shared display/export/import columns; `createPointFromImport` uses `POINT_CORE_COLUMNS` |
| **2 Template flights** | `templatePlanHelpers.ts` — `fetchTemplateFlightPlanList`, `findTemplatePlanByName`, `respondTemplateNameTaken` |
| **3 Keycloak** | `keycloakAdminClient.ts` — shared admin fetch, role helpers, error wrapper; frontend `src/Types/keycloakUser.ts` |
| **4 Devices** | `commandGuard.ts` — shared queue preamble; frontend `src/Types/devices.ts` |
| **5 Misc backend** | `logFields.ts`, `fileDownloadHelpers.ts`; skipped `verify-regio-apis.js` dedup |
| **6 Timeslider** | `timesliderPlanImages.ts` — shared plan-images query + handler |
| **7 Constants** | `fetchConstLookup.ts` — all const GET routes |
| **8 Point & geometry** | `geometryRouteHelpers.ts`, `entityDeleteHelpers.ts` — insert/delete/metadata helpers |
| **9 Finished plans** | `finishedPlanRouteHelpers.ts` — shared fetch error responses |
| **10 Installations** | frontend `src/Types/installer.ts` (backend mirror ~7 lines intentional) |

**Earlier fixes (tested ✓):** point payload cross-stack · flight plan routes · backend shared types trim · query helpers

---

## Intentional remaining mirrors (separate deploy)

Cross-stack type mirrors kept by design (~7–11 lines each):

- `KeycloakUser` — backend `users/types.ts` ↔ frontend `Types/keycloakUser.ts`
- `GetacDevice` — backend `devices-updates/types.ts` ↔ frontend `Types/devices.ts`
- `InstallerMeta` — backend `installers.ts` ↔ frontend `Types/installer.ts`

---

## Files in this folder

| File | Contents |
|------|----------|
| `Duplication findings.csv` | Rescan after deploy to confirm cluster removal |
| `Duplicates.csv` | Rescan after deploy |
| `Duplication-findings.md` | **This document** |
