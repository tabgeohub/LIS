# Phase 2 notes

Phase 2 refactors executable HIGH unit-size and component-independence findings behind compatible façades. No deployment, database, HTTP-contract, or public import changes are intended.

## Accepted findings from the July 13 export

- `nnederlandLayerSpecsPart1.ts`, `nnederlandLayerSpecsPart2.ts`, and `nnederlandLayerSpecsPart3.ts`: declarative ArcGIS layer data. Splitting these arrays would reduce the metric without reducing executable complexity and would make the regional catalogue harder to review.
- `voorbereidingTabs.ts`: declarative tab configuration without meaningful branching. It remains one catalogue so labels, ordering, and permissions can be reviewed together.
- Small hover/click, lookup, token-refresh, and attachment URL modules that are flagged only by fan-in: these modules already have one responsibility and provide a stable supported import boundary.
- Compatibility façades such as `useFlightPlanQuery.ts`, `useEntityQuery.ts`, and `useLogAction.ts`: their implementations have been moved into domain helpers, while the façade remains intentionally stable for consumers.

The acceptance list must be reconciled with a fresh Sigrid export; IDs are not recorded here because the supplied export does not expose stable IDs for unit-size or component-independence findings.
