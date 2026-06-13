# Otg-lis Duplication Findings

**Source:** `Duplication findings.csv` + `Duplicates.csv`  
**Sigrid pillar:** Maintainability (code duplication)  
**Scan date:** 2026-06-10 (post-deploy) · **Last fixes:** point payload cross-stack ✓ · flight plan routes ✓ · backend shared types trim ✓ (tested)

---

## Summary

| Metric | Value |
|--------|-------|
| **Duplicate clusters** | **~46** remaining (est.) |
| **Severity** | All **HIGH** |
| **Total redundant lines** | **~460** remaining (est.) |
| **File locations affected** | **~108** remaining (est.) |

**Progress vs original scan (2026-06-04):** 398 clusters → **~46** (−88%) · 1,038 file locations → **~108** (−90%)

---

## By application area

| Area | File locations | Notes |
|------|----------------|-------|
| **backend** | ~95 | Query helpers, residual routes |
| **HomePage** | ~4 | Residual small UI hits |
| **Types** | 2 | Residual cross-stack (`KeycloakUser` only) |
| **DevicesUpdatesPage** | 2 | Types mirror with backend |
| **helpers** | 1 | Zustand users management types |
| **InstallationsPage** | 1 | Types mirror with backend |

---

## Grouped by theme (recommended reading order)

Clusters grouped by **what is duplicated**. **Redundant lines** = total copy-paste cost for that cluster.

---

### 1. Query helpers (internal duplication)

**11 clusters · ~124 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 6 lines | 5× | 24 | backend/…/helpers/queries/pointJson.ts |
| 7 lines | 4× | 21 | backend/…/helpers/queries/pointJson.ts |
| 13 lines | 2× | 13 | backend/…/helpers/queries/formatPlanGeometries.ts, backend/…/routes/geometries/getGeometries.ts |
| 6 lines | 3× | 12 | backend/…/helpers/queries/flightPlanColumns.ts |
| 10 lines | 2× | 10 | backend/…/helpers/queries/pointJson.ts |
| 8 lines | 2× | 8 | backend/…/helpers/queries/formatPlanGeometries.ts |
| 8 lines | 2× | 8 | backend/…/helpers/queries/formatPlanGeometries.ts |
| 8 lines | 2× | 8 | backend/…/helpers/queries/formatPlanGeometries.ts |
| 7 lines | 2× | 7 | backend/…/helpers/queries/pointJson.ts |
| 7 lines | 2× | 7 | backend/…/helpers/queries/flightPlanColumns.ts |
| 6 lines | 2× | 6 | backend/…/helpers/queries/formatPlanGeometries.ts |

<details>
<summary>File locations (4 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `backend/…/helpers/queries/pointJson.ts` | L31–36 | 3.2% |
| `backend/…/helpers/queries/pointJson.ts` | L44–49 | 3.2% |
| `backend/…/helpers/queries/pointJson.ts` | L53–58 | 3.2% |
| `backend/…/helpers/queries/pointJson.ts` | L72–77 | 3.2% |
| `backend/…/helpers/queries/pointJson.ts` | L88–93 | 3.2% |
| `backend/…/helpers/queries/pointJson.ts` | L31–37 | 3.8% |
| `backend/…/helpers/queries/pointJson.ts` | L44–50 | 3.8% |
| `backend/…/helpers/queries/pointJson.ts` | L53–59 | 3.8% |
| `backend/…/helpers/queries/pointJson.ts` | L88–94 | 3.8% |
| `backend/…/helpers/queries/formatPlanGeometries.ts` | L94–106 | 8.2% |
| `backend/…/routes/geometries/getGeometries.ts` | L10–22 | 25.5% |
| `backend/…/helpers/queries/flightPlanColumns.ts` | L27–32 | 10.7% |
| `backend/…/helpers/queries/flightPlanColumns.ts` | L35–40 | 10.7% |
| `backend/…/helpers/queries/flightPlanColumns.ts` | L44–49 | 10.7% |

</details>

---

### 2. HomePage — other UI

**4 clusters · ~51 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 6 lines | 5× | 24 | `src/Types/finished_plans.ts`, `…/Left/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx`, `src/Types/index.ts` (+2 more) |
| 6 lines | 3× | 12 | backend/…/routes/points/createPointFromImport.ts, …/Bottom/PointsView/PointsTable/index.tsx, …/Left/Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx |
| 9 lines | 2× | 9 | backend/…/helpers/queries/pointJson.ts, …/Bottom/PointsView/PointsTable/index.tsx |
| 6 lines | 2× | 6 | backend/…/helpers/queries/pointJson.ts, …/Left/Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx |

<details>
<summary>File locations (2 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `src/Types/finished_plans.ts` | L31–36 | 10.5% |
| `…/Left/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx` | L14–19 | 3.6% |
| `src/Types/index.ts` | L5–10 | 4.3% |
| `backend/…/routes/points/createPointFromImport.ts` | L115–120 | 3.4% |
| `…/Bottom/PointsView/PointsTable/index.tsx` | L16–21 | 13.6% |
| `…/Left/Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx` | L32–37 | 8.1% |

</details>

---

### 3. Template flight routes

**4 clusters · ~49 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 6 lines | 5× | 24 | backend/…/routes/flightPlans/getAllFlightPlans.ts, backend/…/routes/flightPlans/getFullPreparedFlightPlans.ts, backend/…/routes/flightPlans/getPrepreparedFlightPlans.ts (+2 more) |
| 9 lines | 2× | 9 | backend/…/routes/template_plans/createTemplateFlightPlan.ts, backend/…/routes/template_plans/createTemplateName.ts |
| 8 lines | 2× | 8 | backend/…/routes/flightPlans/createFlightPlan.ts, backend/…/routes/template_plans/createTemplateFlightPlan.ts |
| 8 lines | 2× | 8 | backend/…/routes/template_plans/createTemplateFlightPlan.ts, backend/…/routes/template_plans/createTemplateName.ts |

<details>
<summary>File locations (1 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `backend/…/routes/flightPlans/getAllFlightPlans.ts` | L8–14 | 24.0% |
| `backend/…/routes/flightPlans/getFullPreparedFlightPlans.ts` | L7–13 | 27.3% |
| `backend/…/routes/flightPlans/getPrepreparedFlightPlans.ts` | L7–13 | 26.1% |
| `backend/…/routes/template_plans/getTemplateFlightPlans.ts` | L12–18 | 19.4% |
| `backend/…/routes/flightPlans/getUnPreparedPlans.ts` | L7–13 | 27.3% |

</details>

---

### 4. Keycloak / user management

**5 clusters · ~36 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 11 lines | 2× | 11 | backend/…/routes/keycloak/management/users/getAvailableRoles.ts, backend/…/routes/keycloak/management/users/helpers.ts |
| 7 lines | 2× | 7 | backend/…/routes/keycloak/management/users/deleteUser.ts, backend/…/routes/keycloak/management/users/getAllUsers.ts |
| 6 lines | 2× | 6 | backend/…/routes/keycloak/management/users/createUser.ts, backend/…/routes/keycloak/management/users/resetPassword.ts |
| 6 lines | 2× | 6 | backend/…/routes/keycloak/management/users/getAllUsers.ts, backend/…/routes/keycloak/management/users/getUserById.ts |
| 6 lines | 2× | 6 | backend/…/services/getKeycloakAdminToken.ts |

---

### 5. Devices updates

**4 clusters · ~35 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 12 lines | 2× | 12 | backend/…/routes/devices-updates/checkDeviceStatus.ts, backend/…/routes/devices-updates/triggerDeviceUpdate.ts |
| 9 lines | 2× | 9 | backend/…/routes/devices-updates/db.ts |
| 7 lines | 2× | 7 | backend/…/routes/devices-updates/types.ts, …/DevicesUpdatesPage/index.tsx |
| 7 lines | 2× | 7 | backend/…/routes/devices-updates/types.ts, …/DevicesUpdatesPage/index.tsx |

<details>
<summary>File locations (1 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `backend/…/routes/devices-updates/checkDeviceStatus.ts` | L5–22 | 41.4% |
| `backend/…/routes/devices-updates/triggerDeviceUpdate.ts` | L5–22 | 66.7% |

</details>

---

### 6. Miscellaneous backend

**5 clusters · ~35 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 11 lines | 2× | 11 | backend/…/routes/logs/createLogs.ts |
| 6 lines | 2× | 6 | backend/scripts/verify-regio-apis.ts |
| 6 lines | 2× | 6 | backend/…/routes/logs/createLogs.ts, backend/…/routes/logs/podLogs.ts |
| 6 lines | 2× | 6 | backend/…/routes/fileDownload.ts |
| 6 lines | 2× | 6 | backend/scripts/verify-regio-apis.js |

---

### 7. Timeslider routes

**2 clusters · ~26 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 18 lines | 2× | 18 | backend/…/routes/timeslider/getGeometryPlanImages.ts, backend/…/routes/timeslider/getPointPlanImages.ts |
| 8 lines | 2× | 8 | backend/…/routes/timeslider/getGeometryPlanImages.ts, backend/…/routes/timeslider/getPointPlanImages.ts |

<details>
<summary>File locations (1 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `backend/…/routes/timeslider/getGeometryPlanImages.ts` | L53–72 | 25.7% |
| `backend/…/routes/timeslider/getPointPlanImages.ts` | L51–70 | 26.9% |

</details>

---

### 8. Constants routes

**2 clusters · ~25 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 6 lines | 4× | 18 | backend/…/routes/consts/getActiviteiten.ts, backend/…/routes/consts/getLuchtvaartuig.ts, backend/…/routes/consts/getOrganisaties.ts (+1 more) |
| 7 lines | 2× | 7 | backend/…/routes/consts/getLuchtvaartuig.ts, backend/…/routes/consts/getOrganisaties.ts |

<details>
<summary>File locations (1 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `backend/…/routes/consts/getActiviteiten.ts` | L5–10 | 40.0% |
| `backend/…/routes/consts/getLuchtvaartuig.ts` | L5–10 | 42.9% |
| `backend/…/routes/consts/getOrganisaties.ts` | L5–10 | 40.0% |
| `backend/…/routes/consts/getWaarnemers.ts` | L5–10 | 42.9% |

</details>

---

### 9. Point & geometry routes

**5 clusters · ~34 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 13 lines | 2× | 13 | backend/…/routes/geometries/createGeometry.ts, backend/…/routes/points/createPoint.ts |
| 8 lines | 2× | 8 | backend/…/routes/geometries/updateGeometry.ts, backend/…/routes/points/editPoint.ts |
| 7 lines | 2× | 7 | backend/…/routes/geometries/deleteGeometry.ts, backend/…/routes/points/deletePoint.ts |
| 6 lines | 2× | 6 | backend/…/routes/geometries/getGeometries.ts, backend/…/routes/points/getPoints.ts |
| 6 lines | 2× | 6 | backend/…/routes/geometries/createGeometry.ts, backend/…/routes/geometries/updateGeometry.ts |

<details>
<summary>File locations (1 cluster ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `backend/…/routes/geometries/createGeometry.ts` | L65–77 | 15.9% |
| `backend/…/routes/points/createPoint.ts` | L35–47 | 24.1% |

</details>

---

### 10. Finished plans routes

**3 clusters · ~20 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 7 lines | 2× | 7 | backend/…/routes/finished_plans/getPartialFinishedPlans.ts, backend/…/routes/finished_plans/getSingleFinishedFlightPlan.ts |
| 7 lines | 2× | 7 | backend/…/routes/finished_plans/updateFinishedPointAttachments.ts, backend/…/routes/points/editPoint.ts |
| 6 lines | 2× | 6 | backend/…/routes/finished_plans/createAttachment.ts, backend/…/routes/template_plans/createTemplateName.ts |

---

### 11. Installations

**1 cluster · ~7 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 7 lines | 2× | 7 | backend/…/routes/installers.ts, …/InstallationsPage/index.tsx |

---

## Cross-stack duplication (backend ↔ frontend)

Clusters that span both backend and frontend:

| Redundant lines | Description | Locations |
|-----------------|-------------|-----------|
| 18 | 6 lines occurring 4 times in 4 files | `src/Types/finished_plans.ts` L31–36, `…/Left/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx` L14–19, `src/Types/index.ts` L5–10 (+1) |
| 12 | 6 lines occurring 3 times in 3 files | `backend/…/routes/points/createPointFromImport.ts` L115–120, `…/Bottom/PointsView/PointsTable/index.tsx` L16–21, `…/Left/Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx` L32–37 |
| 11 | 11 lines occurring 2 times in 2 files | `backend/…/routes/keycloak/management/users/types.ts` L1–11, `src/helpers/ZustandStates/usersManagementState.ts` L3–13 |
| 9 | 9 lines occurring 2 times in 2 files | `…/Bottom/PointsView/PointsTable/index.tsx` L18–26, `backend/…/helpers/queries/pointJson.ts` L74–82 |
| 7 | 7 lines occurring 2 times in 2 files | `backend/…/routes/devices-updates/types.ts`, `…/DevicesUpdatesPage/index.tsx` |
| 7 | 7 lines occurring 2 times in 2 files | `backend/…/routes/installers.ts`, `…/InstallationsPage/index.tsx` |

**Resolved (2026-06-10, tested ✓):** Removed `backend/src/Types/index.ts` — backend now uses API-only types colocated with validators (`finishedPlan.ts`) and `pointFields.ts` for point payloads. Frontend `src/Types/*` unchanged. `KeycloakUser` mirror (~11 lines) left intentional.

---

## Recommended fix priority

| Phase | Theme | Est. redundant lines | Effort |
|-------|-------|---------------------|--------|
| **A** | Query helpers (pointJson, formatPlanGeometries) | ~124 | 2–3 h |
| **B** | Remaining (timeslider, keycloak, consts, misc) | ~336 | opportunistic |

---

## Quick reference — top clusters by redundant lines

| Rank | Redundant | Block | Main locations |
|------|-----------|-------|----------------|
| 1 | 24 | 6 lines occurring 5 times | `backend/…/helpers/queries/pointJson.ts` (+4) |
| 2 | 18 | 6 lines occurring 4 times in 4 files | `src/Types/finished_plans.ts`, `…/ImportVluchtPlan.tsx` (+2) |
| 3 | 21 | 7 lines occurring 4 times | `backend/…/helpers/queries/pointJson.ts` (+3) |
| 4 | 18 | 18 lines occurring 2 times in 2 files | `backend/…/routes/timeslider/getGeometryPlanImages.ts`, `backend/…/routes/timeslider/getPointPlanImages.ts` |
| 5 | 18 | 6 lines occurring 4 times in 4 files | `backend/…/routes/consts/getActiviteiten.ts`, `backend/…/routes/consts/getLuchtvaartuig.ts` (+2) |
| 6 | 13 | 13 lines occurring 2 times in 2 files | `backend/…/helpers/queries/formatPlanGeometries.ts`, `backend/…/routes/geometries/getGeometries.ts` |
| 7 | 12 | 6 lines occurring 3 times in 3 files | `createPointFromImport.ts`, `PointsTable/index.tsx`, `SinglePlan.tsx` |
| 8 | 11 | 11 lines occurring 2 times in 2 files | `keycloak/…/users/types.ts`, `usersManagementState.ts` |

---

## Files in this folder

| File | Contents |
|------|----------|
| `Duplication findings.csv` | ~46 duplicate clusters — one row per cluster (rescan to confirm) |
| `Duplicates.csv` | ~108 rows — one row per file location per cluster (rescan to confirm) |
| `Duplication-findings.md` | **This document** — grouped cluster status |
