# Otg-lis Duplication Findings

**Source:** `Duplication findings.csv` + `Duplicates.csv`  
**Sigrid pillar:** Maintainability (code duplication)  
**Scan date:** 2026-06-10 (post-deploy)  

---

## Summary

| Metric | Value |
|--------|-------|
| **Duplicate clusters** | **73** |
| **Severity** | All **HIGH** |
| **Total redundant lines** | **895** |
| **File locations affected** | **184** |

**Progress vs original scan (2026-06-04):** 398 clusters → **73** (−82%) · 1,038 file locations → **184** (−82%)

---

## By application area

| Area | File locations | Notes |
|------|----------------|-------|
| **backend** | 155 | Routes, query helpers, validation |
| **HomePage** | 13 | Residual Tools edit-point + small UI hits |
| **Types** | 12 | `backend/Types` ↔ `src/Types` mirrors |
| **DevicesUpdatesPage** | 2 | Types mirror with backend |
| **helpers** | 1 | Zustand users management types |
| **InstallationsPage** | 1 | Types mirror with backend |

---

## Grouped by theme (recommended reading order)

Clusters grouped by **what is duplicated**. **Redundant lines** = total copy-paste cost for that cluster.

---

### 1. Route validation & error responses (cross-stack)

**4 clusters · ~162 redundant lines**

Shared validation/error-response patterns across backend CRUD routes and Tools edit-point UI. Partially introduced by the shared `routeResponses` / `validateBody` refactor — Sigrid still counts the repeated pattern as duplication.

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 12 lines | 6× | 60 | backend/…/routes/finished_plans/createFinishedPlan.ts, backend/…/routes/geometries/createGeometry.ts, backend/…/routes/points/createPoint.ts (+2 more) |
| 6 lines | 9× | 48 | backend/…/routes/finished_plans/createFinishedPlan.ts, backend/…/routes/geometries/createGeometry.ts, backend/…/routes/points/createPoint.ts (+3 more) |
| 7 lines | 7× | 42 | backend/…/routes/finished_plans/createFinishedPlan.ts, backend/…/routes/geometries/createGeometry.ts, backend/…/routes/points/createPoint.ts (+3 more) |
| 6 lines | 3× | 12 | backend/…/routes/points/editPoint.ts, …/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Buttons.tsx, …/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Form.tsx |

<details>
<summary>File locations (4 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `backend/…/routes/finished_plans/createFinishedPlan.ts` | L46–57 | 7.5% |
| `backend/…/routes/geometries/createGeometry.ts` | L66–77 | 14.6% |
| `backend/…/routes/points/createPoint.ts` | L36–47 | 22.2% |
| `backend/…/routes/points/createPoint.ts` | L57–68 | 22.2% |
| `backend/…/routes/points/editPoint.ts` | L8–19 | 19.0% |
| `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step2/index.tsx` | L26–37 | 17.1% |
| `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Buttons.tsx` | L44–49 | 8.5% |
| `backend/…/routes/finished_plans/createFinishedPlan.ts` | L46–51 | 3.8% |
| `backend/…/routes/geometries/createGeometry.ts` | L66–71 | 7.3% |
| `backend/…/routes/points/createPoint.ts` | L36–41 | 11.1% |
| `backend/…/routes/points/createPoint.ts` | L57–62 | 11.1% |
| `backend/…/routes/points/editPoint.ts` | L8–13 | 9.5% |
| `backend/…/routes/points/editPoint.ts` | L48–53 | 9.5% |
| `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step2/index.tsx` | L26–31 | 8.6% |
| `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step2/index.tsx` | L48–53 | 8.6% |
| `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Buttons.tsx` | L44–50 | 9.9% |
| `backend/…/routes/finished_plans/createFinishedPlan.ts` | L46–52 | 4.4% |
| `backend/…/routes/geometries/createGeometry.ts` | L66–72 | 8.5% |
| `backend/…/routes/points/createPoint.ts` | L36–42 | 13.0% |
| `backend/…/routes/points/createPoint.ts` | L57–63 | 13.0% |
| `backend/…/routes/points/editPoint.ts` | L8–14 | 11.1% |
| `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step2/index.tsx` | L48–54 | 10.0% |
| `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Buttons.tsx` | L23–28 | 8.5% |
| `backend/…/routes/points/editPoint.ts` | L54–59 | 9.5% |
| `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Form.tsx` | L20–25 | 10.3% |

</details>

---

### 2. Flight plan routes

**13 clusters · ~153 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 10 lines | 4× | 30 | backend/…/routes/flightPlans/createFlightPlan.ts, backend/…/routes/flightPlans/updateVluchtPlan.ts |
| 8 lines | 3× | 16 | backend/…/routes/flightPlans/getFullPreparedFlightPlans.ts, backend/…/routes/flightPlans/getSearchedFlightPlans.ts, backend/…/routes/flightPlans/getUnPreparedPlans.ts |
| 14 lines | 2× | 14 | backend/…/routes/flightPlans/createFlightPlan.ts |
| 7 lines | 3× | 14 | backend/…/routes/flightPlans/updateVluchtPlan.ts, backend/…/routes/flightPlans/updateVluchtPlanPoints.ts, backend/…/routes/points/editPoint.ts |
| 12 lines | 2× | 12 | backend/…/routes/flightPlans/getFullPreparedFlightPlans.ts, backend/…/routes/flightPlans/getUnPreparedPlans.ts |
| 12 lines | 2× | 12 | backend/…/routes/flightPlans/createFlightPlan.ts, backend/…/routes/flightPlans/updateVluchtPlan.ts |
| 11 lines | 2× | 11 | backend/…/routes/flightPlans/updateVluchtPlan.ts |
| 9 lines | 2× | 9 | backend/…/routes/flightPlans/updateFlightPlanStatus.ts, backend/…/routes/points/editPointStatus.ts |
| 8 lines | 2× | 8 | backend/…/routes/flightPlans/updateVluchtPlan.ts, backend/…/routes/points/editPoint.ts |
| 8 lines | 2× | 8 | backend/…/routes/flightPlans/updateVluchtPlan.ts, backend/…/routes/points/editPoint.ts |
| 7 lines | 2× | 7 | backend/…/routes/flightPlans/getPrepreparedFlightPlans.ts, backend/…/routes/flightPlans/getUnPreparedPlans.ts |
| 6 lines | 2× | 6 | backend/…/routes/flightPlans/getAllFlightPlans.ts, backend/…/routes/flightPlans/getSearchedFlightPlans.ts |
| 6 lines | 2× | 6 | backend/…/routes/flightPlans/getFullPreparedFlightPlans.ts, backend/…/routes/flightPlans/getPrepreparedFlightPlans.ts |

<details>
<summary>File locations (6 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `backend/…/routes/flightPlans/createFlightPlan.ts` | L47–56 | 16.4% |
| `backend/…/routes/flightPlans/createFlightPlan.ts` | L73–82 | 16.4% |
| `backend/…/routes/flightPlans/updateVluchtPlan.ts` | L11–20 | 14.9% |
| `backend/…/routes/flightPlans/updateVluchtPlan.ts` | L52–61 | 14.9% |
| `backend/…/routes/flightPlans/getFullPreparedFlightPlans.ts` | L21–29 | 36.4% |
| `backend/…/routes/flightPlans/getSearchedFlightPlans.ts` | L25–34 | 30.8% |
| `backend/…/routes/flightPlans/getUnPreparedPlans.ts` | L21–30 | 36.4% |
| `backend/…/routes/flightPlans/createFlightPlan.ts` | L47–60 | 23.0% |
| `backend/…/routes/flightPlans/createFlightPlan.ts` | L73–86 | 23.0% |
| `backend/…/routes/points/editPoint.ts` | L64–72 | 11.1% |
| `backend/…/routes/flightPlans/updateVluchtPlan.ts` | L68–76 | 10.4% |
| `backend/…/routes/flightPlans/updateVluchtPlanPoints.ts` | L23–31 | 29.2% |
| `backend/…/routes/flightPlans/getFullPreparedFlightPlans.ts` | L17–31 | 54.5% |
| `backend/…/routes/flightPlans/getUnPreparedPlans.ts` | L17–32 | 54.5% |
| `backend/…/routes/flightPlans/createFlightPlan.ts` | L70–82 | 19.7% |
| `backend/…/routes/flightPlans/updateVluchtPlan.ts` | L49–61 | 17.9% |

</details>

---

### 3. Shared types (backend ↔ frontend)

**10 clusters · ~132 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 28 lines | 2× | 28 | backend/…/Types/index.ts, src/Types/index.ts |
| 7 lines | 4× | 21 | backend/…/Types/index.ts, backend/…/routes/geometries/updateGeometry.ts, src/Types/finished_plans.ts (+1 more) |
| 14 lines | 2× | 14 | backend/…/Types/index.ts, src/Types/index.ts |
| 14 lines | 2× | 14 | backend/…/Types/index.ts, src/Types/index.ts |
| 12 lines | 2× | 12 | backend/…/Types/index.ts, src/Types/index.ts |
| 11 lines | 2× | 11 | backend/…/routes/keycloak/management/users/types.ts, src/helpers/ZustandStates/usersManagementState.ts |
| 11 lines | 2× | 11 | backend/…/Types/index.ts, src/Types/index.ts |
| 8 lines | 2× | 8 | backend/…/Types/index.ts, src/Types/index.ts |
| 7 lines | 2× | 7 | backend/…/Types/index.ts, src/Types/index.ts |
| 6 lines | 2× | 6 | backend/…/Types/index.ts, src/Types/index.ts |

<details>
<summary>File locations (5 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `backend/…/Types/index.ts` | L57–88 | 25.7% |
| `src/Types/index.ts` | L93–124 | 20.1% |
| `src/Types/finished_plans.ts` | L30–36 | 12.3% |
| `backend/…/Types/index.ts` | L2–8 | 6.4% |
| `src/Types/index.ts` | L4–10 | 5.0% |
| `backend/…/routes/geometries/updateGeometry.ts` | L5–11 | 5.5% |
| `backend/…/Types/index.ts` | L1–14 | 12.8% |
| `src/Types/index.ts` | L3–16 | 10.1% |
| `backend/…/Types/index.ts` | L101–118 | 12.8% |
| `src/Types/index.ts` | L139–156 | 10.1% |
| `backend/…/Types/index.ts` | L24–35 | 11.0% |
| `src/Types/index.ts` | L29–40 | 8.6% |

</details>

---

### 4. Query helpers (internal duplication)

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

### 5. HomePage — other UI

**4 clusters · ~51 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 6 lines | 5× | 24 | backend/…/Types/index.ts, backend/…/routes/geometries/updateGeometry.ts, src/Types/finished_plans.ts (+2 more) |
| 6 lines | 3× | 12 | backend/…/routes/points/createPointFromImport.ts, …/Bottom/PointsView/PointsTable/index.tsx, …/Left/Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx |
| 9 lines | 2× | 9 | backend/…/helpers/queries/pointJson.ts, …/Bottom/PointsView/PointsTable/index.tsx |
| 6 lines | 2× | 6 | backend/…/helpers/queries/pointJson.ts, …/Left/Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx |

<details>
<summary>File locations (2 clusters ≥ 12 redundant lines)</summary>

| File | Lines | Dup % |
|------|-------|-------|
| `src/Types/finished_plans.ts` | L31–36 | 10.5% |
| `…/Left/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx` | L14–19 | 3.6% |
| `backend/…/Types/index.ts` | L3–8 | 5.5% |
| `src/Types/index.ts` | L5–10 | 4.3% |
| `backend/…/routes/geometries/updateGeometry.ts` | L6–11 | 4.7% |
| `backend/…/routes/points/createPointFromImport.ts` | L115–120 | 3.4% |
| `…/Bottom/PointsView/PointsTable/index.tsx` | L16–21 | 13.6% |
| `…/Left/Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx` | L32–37 | 8.1% |

</details>

---

### 6. Template flight routes

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

### 7. Keycloak / user management

**5 clusters · ~36 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 11 lines | 2× | 11 | backend/…/routes/keycloak/management/users/getAvailableRoles.ts, backend/…/routes/keycloak/management/users/helpers.ts |
| 7 lines | 2× | 7 | backend/…/routes/keycloak/management/users/deleteUser.ts, backend/…/routes/keycloak/management/users/getAllUsers.ts |
| 6 lines | 2× | 6 | backend/…/routes/keycloak/management/users/createUser.ts, backend/…/routes/keycloak/management/users/resetPassword.ts |
| 6 lines | 2× | 6 | backend/…/routes/keycloak/management/users/getAllUsers.ts, backend/…/routes/keycloak/management/users/getUserById.ts |
| 6 lines | 2× | 6 | backend/…/services/getKeycloakAdminToken.ts |

---

### 8. Devices updates

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

### 9. Miscellaneous backend

**5 clusters · ~35 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 11 lines | 2× | 11 | backend/…/routes/logs/createLogs.ts |
| 6 lines | 2× | 6 | backend/scripts/verify-regio-apis.ts |
| 6 lines | 2× | 6 | backend/…/routes/logs/createLogs.ts, backend/…/routes/logs/podLogs.ts |
| 6 lines | 2× | 6 | backend/…/routes/fileDownload.ts |
| 6 lines | 2× | 6 | backend/scripts/verify-regio-apis.js |

---

### 10. Timeslider routes

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

### 11. Constants routes

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

### 12. Point & geometry routes

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

### 13. Finished plans routes

**3 clusters · ~20 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 7 lines | 2× | 7 | backend/…/routes/finished_plans/getPartialFinishedPlans.ts, backend/…/routes/finished_plans/getSingleFinishedFlightPlan.ts |
| 7 lines | 2× | 7 | backend/…/routes/finished_plans/updateFinishedPointAttachments.ts, backend/…/routes/points/editPoint.ts |
| 6 lines | 2× | 6 | backend/…/routes/finished_plans/createAttachment.ts, backend/…/routes/template_plans/createTemplateName.ts |

---

### 14. Installations

**1 cluster · ~7 redundant lines**

| Block | Occurrences | Redundant | Key files |
|-------|-------------|-----------|-----------|
| 7 lines | 2× | 7 | backend/…/routes/installers.ts, …/InstallationsPage/index.tsx |

---

## Cross-stack duplication (backend ↔ frontend)

Clusters that span both backend and frontend:

| Redundant lines | Description | Locations |
|-----------------|-------------|-----------|
| 60 | 12 lines occurring 6 times in 5 files | `backend/…/routes/finished_plans/createFinishedPlan.ts` L46–57, `backend/…/routes/geometries/createGeometry.ts` L66–77, `backend/…/routes/points/createPoint.ts` L36–47, `backend/…/routes/points/createPoint.ts` L57–68 (+2) |
| 48 | 6 lines occurring 9 times in 6 files | `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Buttons.tsx` L44–49, `backend/…/routes/finished_plans/createFinishedPlan.ts` L46–51, `backend/…/routes/geometries/createGeometry.ts` L66–71, `backend/…/routes/points/createPoint.ts` L36–41 (+5) |
| 42 | 7 lines occurring 7 times in 6 files | `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Buttons.tsx` L44–50, `backend/…/routes/finished_plans/createFinishedPlan.ts` L46–52, `backend/…/routes/geometries/createGeometry.ts` L66–72, `backend/…/routes/points/createPoint.ts` L36–42 (+3) |
| 28 | 28 lines occurring 2 times in 2 files | `backend/…/Types/index.ts` L57–88, `src/Types/index.ts` L93–124 |
| 24 | 6 lines occurring 5 times in 5 files | `src/Types/finished_plans.ts` L31–36, `…/Left/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx` L14–19, `backend/…/Types/index.ts` L3–8, `src/Types/index.ts` L5–10 (+1) |
| 21 | 7 lines occurring 4 times in 4 files | `src/Types/finished_plans.ts` L30–36, `backend/…/Types/index.ts` L2–8, `src/Types/index.ts` L4–10, `backend/…/routes/geometries/updateGeometry.ts` L5–11 |
| 14 | 14 lines occurring 2 times in 2 files | `backend/…/Types/index.ts` L1–14, `src/Types/index.ts` L3–16 |
| 14 | 14 lines occurring 2 times in 2 files | `backend/…/Types/index.ts` L101–118, `src/Types/index.ts` L139–156 |
| 12 | 12 lines occurring 2 times in 2 files | `backend/…/Types/index.ts` L24–35, `src/Types/index.ts` L29–40 |
| 12 | 6 lines occurring 3 times in 3 files | `backend/…/routes/points/createPointFromImport.ts` L115–120, `…/Bottom/PointsView/PointsTable/index.tsx` L16–21, `…/Left/Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx` L32–37 |
| 12 | 6 lines occurring 3 times in 3 files | `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Buttons.tsx` L23–28, `backend/…/routes/points/editPoint.ts` L54–59, `…/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Form.tsx` L20–25 |
| 11 | 11 lines occurring 2 times in 2 files | `backend/…/routes/keycloak/management/users/types.ts` L1–11, `src/helpers/ZustandStates/usersManagementState.ts` L3–13 |
| 11 | 11 lines occurring 2 times in 2 files | `backend/…/Types/index.ts` L36–46, `src/Types/index.ts` L42–52 |
| 9 | 9 lines occurring 2 times in 2 files | `…/Bottom/PointsView/PointsTable/index.tsx` L18–26, `backend/…/helpers/queries/pointJson.ts` L74–82 |
| 8 | 8 lines occurring 2 times in 2 files | `backend/…/Types/index.ts` L91–98, `src/Types/index.ts` L128–135 |

---

## Recommended fix priority

| Phase | Theme | Est. redundant lines | Effort |
|-------|-------|---------------------|--------|
| **A** | Route validation & error responses (cross-stack) | ~162 | 1–2 h |
| **B** | Shared types (backend ↔ frontend) | ~132 | 2–3 h |
| **C** | Query helpers (pointJson, formatPlanGeometries) | ~124 | 2–3 h |
| **D** | Flight plan routes | ~153 | 2–3 h |
| **E** | Remaining (timeslider, keycloak, consts, misc) | ~324 | opportunistic |

---

## Quick reference — top clusters by redundant lines

| Rank | Redundant | Block | Main locations |
|------|-----------|-------|----------------|
| 1 | 60 | 12 lines occurring 6 times in 5 files | backend/…/routes/finished_plans/createFinishedPlan.ts, backend/…/routes/geometries/createGeometry.ts (+4) |
| 2 | 48 | 6 lines occurring 9 times in 6 files | …/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Buttons.tsx, backend/…/routes/finished_plans/createFinishedPlan.ts (+7) |
| 3 | 42 | 7 lines occurring 7 times in 6 files | …/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step1/Buttons.tsx, backend/…/routes/finished_plans/createFinishedPlan.ts (+5) |
| 4 | 30 | 10 lines occurring 4 times in 2 files | backend/…/routes/flightPlans/createFlightPlan.ts, backend/…/routes/flightPlans/createFlightPlan.ts (+2) |
| 5 | 28 | 28 lines occurring 2 times in 2 files | backend/…/Types/index.ts, src/Types/index.ts |
| 6 | 24 | 6 lines occurring 5 times in 5 files | backend/…/routes/flightPlans/getAllFlightPlans.ts, backend/…/routes/flightPlans/getFullPreparedFlightPlans.ts (+3) |
| 7 | 24 | 6 lines occurring 5 times | backend/…/helpers/queries/pointJson.ts, backend/…/helpers/queries/pointJson.ts (+3) |
| 8 | 24 | 6 lines occurring 5 times in 5 files | src/Types/finished_plans.ts, …/Left/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx (+3) |
| 9 | 21 | 7 lines occurring 4 times | backend/…/helpers/queries/pointJson.ts, backend/…/helpers/queries/pointJson.ts (+2) |
| 10 | 21 | 7 lines occurring 4 times in 4 files | src/Types/finished_plans.ts, backend/…/Types/index.ts (+2) |
| 11 | 18 | 18 lines occurring 2 times in 2 files | backend/…/routes/timeslider/getGeometryPlanImages.ts, backend/…/routes/timeslider/getPointPlanImages.ts |
| 12 | 18 | 6 lines occurring 4 times in 4 files | backend/…/routes/consts/getActiviteiten.ts, backend/…/routes/consts/getLuchtvaartuig.ts (+2) |
| 13 | 16 | 8 lines occurring 3 times in 3 files | backend/…/routes/flightPlans/getFullPreparedFlightPlans.ts, backend/…/routes/flightPlans/getSearchedFlightPlans.ts (+1) |
| 14 | 14 | 14 lines occurring 2 times | backend/…/routes/flightPlans/createFlightPlan.ts, backend/…/routes/flightPlans/createFlightPlan.ts |
| 15 | 14 | 14 lines occurring 2 times in 2 files | backend/…/Types/index.ts, src/Types/index.ts |

---

## Files in this folder

| File | Contents |
|------|----------|
| `Duplication findings.csv` | 73 duplicate clusters — one row per cluster |
| `Duplicates.csv` | 184 rows — one row per file location per cluster |
| `Duplication-findings.md` | **This document** — grouped cluster status |
