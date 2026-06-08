# Duplication fixes — regression test checklist

**Purpose:** After each duplication refactor, run the matching section here before merge.  
**Companion:** `Duplication-findings.md` (what to fix) · `Duplicates.csv` (file-level detail)  
**Last updated:** 2026-06-05  

---

## How to use this document

1. Finish a duplication refactor (see themes in `Duplication-findings.md`).
2. Find the matching section below — **Fixed** or **Pending**.
3. Run every checkbox in that section on **all surfaces** that used the old duplicated code.
4. Mark the section **Tested ✓** with date and tester initials.
5. Add a new section when starting a theme not listed yet (copy the template at the bottom).

### Always run (every duplication fix)

- [ ] App builds without TypeScript errors (`npm run build` or CI).
- [ ] No new console errors on the pages touched by the refactor.
- [ ] Behaviour on **each former copy** of the code still works (if code was merged from A ↔ B, test both A and B flows).
- [ ] No visual/layout regression on affected panels (spacing, scroll, loading overlay, buttons).
- [ ] Zustand / list state updates correctly after create, edit, delete (where applicable).
- [ ] Map interactions still work if the refactor touched map code (pan, zoom, graphics, click handlers).

---

## Fixed — tested

### Foto / attachments — point vs geometry

**Fixed:** 2026-06-05  
**Shared code:** `…/Waarnemingen/common/Foto/`  
**Wrappers:** `EditPointDetails/Actions/Foto/` · `EditGeometryDetails/Actions/Foto/`  
**Tested:** ☐ *(fill in when QA complete)*

**Navigate:** Nabewerking → Vluchten zoeken → Step 2 → Waarnemingen → open a **point** or **geometry** → Foto action.

#### Point — EditPointDetails

- [ ] Open foto panel for a point **with** attachments — grid shows numbered thumbnails.
- [ ] Open foto panel for a point **without** attachments — empty state + “Vorige” returns to form.
- [ ] Click thumbnail — full-screen `ImageGallery` opens at correct index.
- [ ] Gallery: next / previous image works.
- [ ] Gallery: delete image — ArcGIS + API succeed; thumbnail removed; gallery index sane (last item / empty closes gallery).
- [ ] Gallery: show location — map pans to coordinates; temporary red marker appears ~5s.
- [ ] Thumbnail hover: location button — same pan/marker behaviour.
- [ ] **Add image** — file picker → loading overlay → new thumbnail appears; plan + point state updated (refresh / re-open still shows image).
- [ ] Attachments with `location` — numbered blue markers on map; click marker opens gallery at correct image.
- [ ] Multiple images same location — markers offset (not stacked on one spot).
- [ ] “Vorige” — returns to point form without breaking selection.

#### Geometry — EditGeometryDetails

- [ ] Same checklist as point, but via geometry detail → foto (uses **first point** of geometry for attachments).
- [ ] After upload/delete — geometry selection, plan `geometries`, and `points_data` stay in sync.
- [ ] Empty geometry / point without attachments — empty state (not a crash).

#### Cross-check (regression from merge)

- [ ] Point and geometry foto flows both use `foto-images-point` vs `foto-images-geometry` inputs (no id clash if both panels could mount).
- [ ] Upload failure (e.g. cancel / bad file) — loading state clears; no stuck overlay.

---

### Flight plan map & list UI

**Fixed:** 2026-06-05  
**Shared code:** `createPlanBoundingBoxGraphic.ts`, `computeFlightPlanCentroid.ts`, `finishedPlanMapGraphics.ts`, `usePlanClick`, `usePlanHover`, `usePlanStarGraphic`, `useFinishedPlanMapHighlight`  
**Tested:** ☐ *(fill in when QA complete)*

**Surfaces:** Search tab, bottom panel, `FlightPlansList`, `FlightPlansTable`, `SinglePlan`, plan hover/click hooks.

- [ ] Search: flight plans list loads and filters.
- [ ] Click plan row — map highlights plan path; selection state correct.
- [ ] Hover plan row — hover graphic appears/disappears.
- [ ] Bottom panel / dropdown plan details — same highlight behaviour.
- [ ] Multiple plan lists (search vs bottom vs voorbereiding if shared) — all still work.
- [ ] Deselect / click elsewhere — graphics cleared.
- [ ] Star / select-all on plans — star graphics on map.

---

### Point list & star/highlight on map

**Fixed:** 2026-06-05  
**Shared code:** `createPointMapGraphics.ts`, `createSymbols.ts` (hover + search outline symbols), `usePointListMapActions.ts`  
**Wired:** `SearchedResultsTab/Points/index`, `Points/DropDown`, `ResultTab/PointsList`, `PointsListEdit`, `ListPointsFunctions`, `PointsTable`, `useMapGraphics` (points tab)  
**Tested:** ☐ *(fill in when QA complete)*

#### Search tab — `SearchedResultsTab/Points`

- [ ] Run search → points list loads with yellow outline rings on map (initial load effect).
- [ ] Yellow marker dots appear on `yellowGraphicsLayer` after list mount.
- [ ] Hover row — location pin on map; leave row — pin clears.
- [ ] Click row — map pans to point.
- [ ] Star / unstar row — blue circle on `graphicsLayer`; icon toggles blue/gray.
- [ ] Header dropdown → Select all — all points starred + blue circles on map.

#### Result tab — `PointsList` and `PointsListEdit`

- [ ] Points list loads from result tab (read and edit variants).
- [ ] Hover, click goTo, star/unstar — same map behaviour as search tab.
- [ ] Dropdown → Select all — stars all + map graphics.
- [ ] Edit variant — action links (edit/delete/view/add to plan) still open correct sidebar tabs.

#### Bottom panel — `PointsTable`

- [ ] Points table view — hover pin, row click goTo, star toggle work.
- [ ] Starred row highlighted (blue background) in table.

#### Layer sync

- [ ] Switch bottom tab to points — yellow markers + starred overlays match list state.
- [ ] No duplicate star graphics when starring from list then opening bottom table.

---

### Drawing tool — map cleanup & lifecycle

**Fixed:** 2026-06-05  
**Shared code:** `DrawingTool/helpers/` (`drawingToolMapCleanup`, `resetSketchSession`, `useDrawingToolLifecycle`, `useOmschrijvingExists`)  
**Form merge:** `Common/AandachtspuntDetailsFields.tsx`  
**Tested:** ✓ 2026-06-05

#### Step 1 — draw

- [x] Open Tekengereedschap tab — Step1 loads.
- [x] Select line/polygon tool — crosshair cursor; draw on map.
- [x] Graphics tagged `currently-drawing`; clear button removes them + resets cursor.
- [x] Confirm with graphics — advances to Step2; graphics persist on map.

#### Step 2 — form & save

- [x] Step2 form fields bind correctly (checkboxes, omschrijving duplicate warning, selects).
- [x] Duplicate omschrijving blocks save.
- [x] Back — graphics removed, returns to Step1, store cleared.
- [x] Cancel — same as back.
- [x] Save — API succeeds, graphics cleared, geometries refetched on map.

#### Tab / lifecycle

- [x] Switch away from Tekengereedschap mid-draw — no leftover graphics or crosshair.
- [x] Re-open tab — fresh Step1 state.

#### EnrichedAddPoint form (shared fields)

- [x] EnrichedAddPoint Step3 — same field layout; point omschrijving API warning still works.

---

## Pending — run when fix is merged

### 1. Shared types — `finished_plans`

**When fixed:** delete or redirect `backend/src/Types/finished_plans.ts`; single source in `src/Types/`.

- [ ] Backend compiles and starts.
- [ ] Nabewerking: load finished flight plan — points + geometries parse correctly.
- [ ] Create report: finished plan data renders.
- [ ] API responses still match frontend expectations (attachments, geometry `points` array).
- [ ] No runtime `undefined` on plan/point/geometry fields used in UI.

---

### 2. Backend — flight plan / point SQL queries

**Surfaces:** search endpoints, template plans, preprepared plans, regio filters.

- [ ] `getAllFlightPlans` / search plans — same result counts as before (spot-check known queries).
- [ ] `getSearchedPoints` — filters (regio, text) unchanged.
- [ ] `getPrepreparedFlightPlans` / template plans — no missing rows.
- [ ] Pagination / limits (if any) still respected.
- [ ] Error cases: invalid params → same HTTP status/messages.

---

### 3. Backend — route validation & CRUD

**Surfaces:** create/edit point, geometry, finished plan, flight plan, email routes + matching frontend forms.

- [ ] Create point — success + validation errors on missing fields.
- [ ] Edit point — update persists.
- [ ] Create geometry / finished plan — same as before.
- [ ] Frontend forms show same validation feedback when required fields empty.
- [ ] Status update routes (`editPointStatus`, `updateFlightPlanStatus`) — still work.

---

### 4. Zustand store — initial state vs `clear()`

**Stores:** `useFinishedPlansState`, `useReuseFlightPlan`, `templateFlightStates`, `flightPlanStates`, etc.

- [ ] Start wizard → fill fields → `clear()` or exit — all fields back to initial values.
- [ ] Re-enter wizard — no stale data from previous session.
- [ ] No duplicate field resets (regression: clear twice in a row safe).

---

### 5. Geometry rendering & handlers · **Tested ✓**

**Surfaces:** `SingleGeometry`, Create report Step 2, bottom Geometries table, geometries tab yellow sync, PDF report map.

#### Phase A — hover

- [x] Vluchten zoeken → Waarnemingen: hover polygon/line — yellow outline on map (shared `useGeometryHover`).
- [x] Create report Step 2: hover geometry row — same yellow hover behaviour.
- [x] Mouse leave — hover graphic clears.

#### Phase B — graphic factory

- [x] Bottom panel → **Geometries** tab: table rows show yellow geometry outlines on map (polygon + line).
- [x] Star a geometry — blue fill/outline on `graphicsLayer`; unstar removes it.
- [x] Hover table row — brighter yellow highlight on `graphicsLayerHover`; clears on mouse leave.
- [x] Click row / go-to — map pans to geometry centroid, zoom ~12.
- [x] Switch away from geometries tab and back — yellow sync redraws correctly.
- [x] Create report zip/PDF: geometry map snapshot still shows **orange** outline (polygon + line).

#### Phase C — table hook

- [x] `GeometriesTable` uses `useGeometryListMapActions` — star / hover / goTo behave as Phase B.
- [x] Star several geometries, switch to Points tab, switch back to Geometries — blue star graphics still on map.

#### Phase D — shared click hook

- [x] Vluchten zoeken → Waarnemingen: click geometry — yellow outline on `yellowGraphicsLayer` (polygon + line); switching selection updates graphic; deselect clears layer.
- [x] Voorbereiding flight plan → geometry checkbox select — yellow on `yellowGeometriesGraphicsLayer`; multi-select; non-selected stay blue on `geometriesGraphicsLayer`.
- [x] Template flight Fase3 — template geometries still render yellow (via `useDrawYellowGeometries` → shared `createSelectionGeometryGraphic`).
- [x] Hover + click together — hover on mapView.graphics, selection on yellow layer; no stale graphics.

---

### 6. Edit point form steps (Tools vs Voorbereiding)

- [ ] Aandachtspunten verwijderen — edit point Step2 sub-forms.
- [ ] Voorbereiding — selected point edit Step2.
- [ ] Field bindings, save, validation identical on both paths.

---

### 8. Map legend / layers

**Surfaces:** KaartLegend → Block1, Overig, NNederland; regio-filtered users + admin.

- [ ] **Block1:** Aandachtspunten + Geometries default on; Regios toggles; Waypoints/tracks parent gates children.
- [ ] **Overig:** parent checkbox gates Section1–4; nested groups (Wegen, Hoogspanningsmasten) expand/toggle.
- [ ] **NNederland:** section hidden when no layers for user regio; parent + layer toggles; `selectedLayers` restore on load.
- [ ] **Admin vs regional user:** each sees correct layer subset per `regio`.
- [ ] Toggle layer on — appears on map; off — removed; disabled parent removes child layers from map.

---

### 9. View plan — add points

- [ ] View plan: add point to plan — points list selection.
- [ ] Add points from another plan — source list works.
- [ ] Coordinate watcher / update button on map.
- [ ] Selected points appear on plan after confirm.

---

### 10. Backend — finished plans queries

- [ ] Timeslider finished plans endpoint.
- [ ] Partial finished plans / single finished flight plan.
- [ ] JSON shape for attachments and geometries unchanged for frontend.

---

### 11. Layout components

- [ ] Left panel layout — scroll, header, tabs.
- [ ] Right panel layout — same shared wrapper behaviour.
- [ ] Responsive / resize — no broken overflow.

---

### 12. Wizard / step buttons

**Surfaces:** Edit flight, reuse/duplicate flight plan, flight plan Step3, view plan Step2, template flights.

- [ ] Cancel — exits wizard, clears graphics where expected.
- [ ] Next — step advance + logging (if applicable).
- [ ] Back — previous step state intact.
- [ ] Each wizard at least smoke-tested once.

---

### 13. Miscellaneous

*Add specific checkboxes when touching a cluster in this bucket — do not block merge on full misc sweep.*

---

## Template — copy for new fixes

```markdown
### [Theme name]

**Fixed:** YYYY-MM-DD  
**Shared code:** `path/to/shared/`  
**Tested:** ☐

**Navigate:** …

- [ ] …
- [ ] …
```

---

## Test log

| Date       | Theme                         | Tester | Result | Notes |
| ---------- | ----------------------------- | ------ | ------ | ----- |
| 2026-06-05 | Foto / attachments            |        |        | Refactor merged; QA pending |
|            |                               |        |        |       |

---

## Files in this folder

| File | Contents |
| ---- | -------- |
| `Duplication-findings.md` | Cluster status & fix priority |
| `Duplication-test-checklist.md` | **This document** — regression tests per fix |
| `Duplicates.md` | File-level duplication detail |
| `Duplication findings.csv` | Sigrid cluster export |
| `Duplicates.csv` | Sigrid file-location export |
