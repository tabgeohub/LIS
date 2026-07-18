# Next focus status — Architecture wave (`20260718(1)`)

Dashboard baseline: Maintainability **4.1** · Architecture **3.3** (yellow) · OSH 4.7 · Security 4.3 · Reliability 5.5.

## Done this wave

### Wave A — Accept ledger
- Recreated [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) for intentional Independence HIGH façades, Coupling hubs, api-hooks entanglement, Docker/Unit size Accept, CSV XSS mitigated.

### Wave B — Independence consolidation (main lever)
Thinned fat Independence MEDIUM interface modules to ≤~10 LOC re-export façades; bodies in Core/internal siblings imported only by those façades.

ArcGISHelpers: `centerAndZoomMath`, `geometryMapGraphicFactories`, `pointMapGraphicActions`, `geometryMapGraphicActions`, `bufferPointsOnLayer`, `planBoundingBoxGeometry`, `createGeometryGraphicCore`.

Other: `flightPlanPointExcel`, `sortPointsWithSelectionOrder`, shapefile/csv/xlsx exports, `useCreateData` / `useUpdateData`, `flightPlanFormSetters`, plus Unit size leftovers (`applyDeletePointCoordinatePatch`, LegendSection*, `pointCoreFieldKeys`).

### Wave C — api-hooks entanglement follow-up
- Moved `appendRegioQuery` to `src/api-hooks/shared/regioQuery.ts`.
- Removed `useTemplateFlights` re-export from `api-hooks/flightPlans` (consumers use `api-hooks/templateFlights`).
- Extended `scripts/check-architecture.mjs` to forbid cross-domain api-hooks imports (allow `shared` / `mutations` / `consts`).

### Wave D — Maintainability polish
- Thinned Complexity MEDIUM: `mergeFlightPlanPersistenceFields`, `populateFormFromPlan`, `buildSelectedPathPoint` (key-list / coalesce helpers).
- Cleared priority within-layer Duplication HIGH clones; skipped FE↔BE twins (`keycloakUser`, `devices`).

### Wave B2 — next-tier Independence MEDIUM (pre-deploy)
Thinned remaining ~31–47 LOC interface modules to thin façades + Core:
- ArcGIS/helpers: `planStarGraphics`, `bufferFlightPlansOnLayer`, `pointMapGraphicFactories`, `pointGraphicFactory`, `finishedPlanCentroidMarkers`, `buildPlanBoundingBoxGraphic`, `centerAndZoomFromPlan`, `syncBluePointGraphics`, `geoJsonExport`, `buildCoordinateSyncPatch`
- Hooks/mutations: `useDeleteData`, `useResizableSidebar`, `useDrawPath`, `useWizardPointsFilterHeader`, `useTimeRange`, result-tab hooks, hover-click handlers, `buildFlightPlanCreateAttributes`, `flightPlanFormLabels`, `useFilteredSortedPlans`, …
- Extra within-layer dup polish (EditPointDetails submit helper, template name helper, verifyRegio pool query, filter bind helper).

## Verification
- `npm run check:architecture` — pass
- `npm run test:architecture-helpers` — pass

## Before deploy (manual)
1. Apply Accept list in Sigrid UI (Wave A).
2. Smoke-test map graphics / wizard points / exports / mutations (façade paths unchanged).
3. Re-export Sigrid after deploy for Architecture rebaseline.

## Next Sigrid export expectations
- Architecture trending up from 3.3 (Independence MEDIUM façades thinner across Wave B + B2).
- Coupling HIGH hubs remain Accept (OK).
- Maintainability holds ≥ 4.1; Complexity MEDIUM → 0; Duplication HIGH trending down.
- Do **not** chase remaining Independence LOW / tiny intentional hubs.
