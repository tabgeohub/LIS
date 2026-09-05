# Sigrid Accept list (Wave 0 — do in UI)

These are intentional hubs. Set status to **Risk accepted** in Maintainability → Findings (pen → status). Do not rewrite.

## Architecture Utility roles (also in `sigrid.yaml`)

Mark / keep these as **Utility** so Coupling + Adjacency are N/A for intentional shared layers:

| Component | Why |
| --- | --- |
| `src/hooks` | Shared Zustand / filter / hover / auth hooks |
| `src/api-hooks` | Shared React Query mutation/query layer |
| `src/helpers/ArcGISHelpers` | Map graphic helper hub |
| `src/helpers/http`, `src/helpers/arcgis`, `src/helpers/geo` | Shared leaf helpers |
| `src/helpers/points`, `src/helpers/plans` | Shared point/plan payload helpers |
| `src/Components/Common` | Shared UI leaves extracted from HomePage |

Do **not** mark `HomePage` / feature folders (`Voorbereiding/*`, `Nabewerking/*`, `HomePageTools/*`) as Utility.

## Module coupling

| File | Why |
| --- | --- |
| `src/hooks/useContent.ts` | i18n content hub (fan-in ~126) — **still RAW, accept now** |
| `src/hooks/useLogAction.ts` | logging hub — already ACCEPTED |
| `src/api-hooks/mutations/useUpdateDataCore.ts` | mutation core — ACCEPTED |
| Large repos (`flightPlansRepo`, `pointsRepo`) | data access hubs — Accept if RAW |

## Component entanglement (density)

| Component | Status |
| --- | --- |
| `src/api-hooks` | ACCEPTED |
| `src/helpers/ArcGISHelpers` | ACCEPTED |
| `src/helpers/http`, `src/helpers/arcgis` | ACCEPTED |
| `src/hooks` | ACCEPTED after store evacuation to `src/hooks/filters` + Utility role |
| `src/Components/HomePage` | leave RAW while features compose through shell; re-check after rescan |

## Independence

Accept RAW `*Core` interface-module findings. **Do not** add new Independence façades.
