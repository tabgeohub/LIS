# Sigrid Accept list (Wave 0 — do in UI)

These are intentional hubs. Set status to **Risk accepted** in Maintainability → Findings (pen → status). Do not rewrite.

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
| `src/hooks` | leave RAW while evacuating stores; re-check after Wave 3 |
| `src/Components/HomePage` | leave RAW while extracting Common; re-check after Waves 1–3 |

## Independence

Accept RAW `*Core` interface-module findings. **Do not** add new Independence façades.
