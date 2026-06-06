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

## Pending — run when fix is merged

### 1. Shared types — `finished_plans`

**When fixed:** delete or redirect `backend/src/Types/finished_plans.ts`; single source in `src/Types/`.

- [ ] Backend compiles and starts.
- [ ] Nabewerking: load finished flight plan — points + geometries parse correctly.
- [ ] Create report: finished plan data renders.
- [ ] API responses still match frontend expectations (attachments, geometry `points` array).
- [ ] No runtime `undefined` on plan/point/geometry fields used in UI.

---

### 2. Flight plan map & list UI

**Surfaces:** Search tab, bottom panel, `FlightPlansList`, `FlightPlansTable`, `SinglePlan`, plan hover/click hooks.

- [ ] Search: flight plans list loads and filters.
- [ ] Click plan row — map highlights plan path; selection state correct.
- [ ] Hover plan row — hover graphic appears/disappears.
- [ ] Bottom panel / dropdown plan details — same highlight behaviour.
- [ ] Multiple plan lists (search vs bottom vs voorbereiding if shared) — all still work.
- [ ] Deselect / click elsewhere — graphics cleared.

---

### 3. Point list & star/highlight on map

**Surfaces:** `Points/index`, `PointsList`, `PointsListEdit`, search results, star toggle.

- [ ] Point list loads in search and edit modes.
- [ ] Click point row — map `goTo` + selection.
- [ ] Star toggle — yellow/star graphics on map; state persists in list.
- [ ] Hover point — hover graphic (if applicable).
- [ ] Bulk / filter changes — graphics stay in sync with visible list.

---

### 4. Backend — flight plan / point SQL queries

**Surfaces:** search endpoints, template plans, preprepared plans, regio filters.

- [ ] `getAllFlightPlans` / search plans — same result counts as before (spot-check known queries).
- [ ] `getSearchedPoints` — filters (regio, text) unchanged.
- [ ] `getPrepreparedFlightPlans` / template plans — no missing rows.
- [ ] Pagination / limits (if any) still respected.
- [ ] Error cases: invalid params → same HTTP status/messages.

---

### 5. Backend — route validation & CRUD

**Surfaces:** create/edit point, geometry, finished plan, flight plan, email routes + matching frontend forms.

- [ ] Create point — success + validation errors on missing fields.
- [ ] Edit point — update persists.
- [ ] Create geometry / finished plan — same as before.
- [ ] Frontend forms show same validation feedback when required fields empty.
- [ ] Status update routes (`editPointStatus`, `updateFlightPlanStatus`) — still work.

---

### 6. Drawing tool (Voorbereiding)

- [ ] Open drawing tool wizard — all steps load.
- [ ] Draw / filter / reset between Step1 and Step2 — state clears correctly.
- [ ] Cancel / back — no leftover graphics on map.
- [ ] Complete flow — geometries saved on plan.

---

### 7. Zustand store — initial state vs `clear()`

**Stores:** `useFinishedPlansState`, `useReuseFlightPlan`, `templateFlightStates`, `flightPlanStates`, etc.

- [ ] Start wizard → fill fields → `clear()` or exit — all fields back to initial values.
- [ ] Re-enter wizard — no stale data from previous session.
- [ ] No duplicate field resets (regression: clear twice in a row safe).

---

### 8. Geometry rendering & handlers

**Surfaces:** `SingleGeometry`, Create report geometry handlers, geometries table.

- [ ] Nabewerking: click geometry — renders on map (lines/polygons/points).
- [ ] Create report: geometry selection + map sync.
- [ ] Geometries table row click — same map behaviour as waarnemingen list.

---

### 9. Edit point form steps (Tools vs Voorbereiding)

- [ ] Aandachtspunten verwijderen — edit point Step2 sub-forms.
- [ ] Voorbereiding — selected point edit Step2.
- [ ] Field bindings, save, validation identical on both paths.

---

### 10. Map legend / layers

- [ ] KaartLegend sections toggle layers on/off.
- [ ] Block1 vs Overig sections — no broken toggles after shared component.
- [ ] Layer visibility persists during session as before.

---

### 11. View plan — add points

- [ ] View plan: add point to plan — points list selection.
- [ ] Add points from another plan — source list works.
- [ ] Coordinate watcher / update button on map.
- [ ] Selected points appear on plan after confirm.

---

### 12. Backend — finished plans queries

- [ ] Timeslider finished plans endpoint.
- [ ] Partial finished plans / single finished flight plan.
- [ ] JSON shape for attachments and geometries unchanged for frontend.

---

### 13. Layout components

- [ ] Left panel layout — scroll, header, tabs.
- [ ] Right panel layout — same shared wrapper behaviour.
- [ ] Responsive / resize — no broken overflow.

---

### 14. Wizard / step buttons

**Surfaces:** Edit flight, reuse/duplicate flight plan, flight plan Step3, view plan Step2, template flights.

- [ ] Cancel — exits wizard, clears graphics where expected.
- [ ] Next — step advance + logging (if applicable).
- [ ] Back — previous step state intact.
- [ ] Each wizard at least smoke-tested once.

---

### 15. Miscellaneous

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
