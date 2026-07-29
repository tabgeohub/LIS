# NEXT-FOCUS-STATUS — Architecture 3.6 recovery

## What the latest scan shows

Quality Overview: **Maintainability 4.3** / **Architecture 3.6** (down from ~3.8 / ~4.6 peaks).

Post-split findings pack: `sigrid-findings/all-findings-rijkswaterstaat-otg-lis-20260730/`.
Architecture detail CSVs in git are still the **pre-split** baseline (system **3.88**, HomePage ~44k LOC) — OneDrive no longer has them on disk; re-export after next deploy.

### Why Architecture dropped

P4 split extracted features but left **bidirectional** and **layer-bypass** edges:

1. **HIGH cycle:** `HomePage` ↔ `Voorbereiding/ViewPlan` (HomePage imported `createQuadrantGraphic` from ViewPlan; ViewPlan still imports HomePage UI/hooks heavily)
2. HomePage + hooks still **VERY HIGH** communication density
3. Many new **MEDIUM** density findings on split features (ViewPlan, FlightPlan, VluchtenZoeken, CreateReport, …)
4. Flood of **LAYER_BYPASSING_DEPENDENCY** (features → `hooks` / helpers) — expected after split without a shared leaf layer
5. `useContent` Module coupling still **HIGH / RAW** (fan-in 126) — Accept in UI

LOC now: HomePage ~20k, Voorbereiding ~12.5k, Nabewerking ~7.9k, HomePageTools ~4.5k.

## Done this session (cycle break)

- Moved `createQuadrantGraphic` → `helpers/ArcGISHelpers/` (HomePage + ViewPlan both import leaf helper)
- Shared list skeleton → `Components/Common/FlightPlanListLoading` (removed Nabewerking → ViewPlan edge)

## Accept in Sigrid UI (do now)

| Finding | Status |
| --- | --- |
| `src/hooks/useContent.ts` fan-in 126 | **Risk accepted** |
| `src/hooks/useLogAction.ts` | already ACCEPTED |
| Intentional hubs / large repos | keep ACCEPTED |
| Independence `*Core` interface modules | **do not rewrite**; Accept if needed — no new façades |

## Next Architecture wave (ordered)

1. **No more HomePage stuffing / mega-moves**
2. After deploy+rescan: export Architecture summary + adjacency + coupling (must include Voorbereiding / Nabewerking / HomePageTools rows)
3. Reduce **HomePage → feature** surface only via composition at `Left/index` (already OK); avoid feature→feature edges
4. Move **shared wizard/UI leaves** that many features import from HomePage into `Components/Common` or `src/hooks` **only when** they remove a HIGH/MEDIUM density edge — measure first
5. Do **not** grind Unit size / more SQL / Dockerfile / Independence Core games

## Success criteria

| Metric | Target |
| --- | --- |
| Architecture | ≥ **4.0** (first stop the bleed: clear HIGH cycle) |
| Data coupling | stay ~**3.5** |
| HomePage | stay ~20k; do not grow back to 40k+ |
