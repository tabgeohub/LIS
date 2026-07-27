# Sigrid Accept list — export `20260727`

Use for a **Sigrid UI Accept** pass. Do not rewrite these unless responsibilities start mixing.
**No Dockerfile or Nginx edits.**

Source:
- [`component-independence-findings-rijkswaterstaat-otg-lis-20260727.csv`](./component-independence-findings-rijkswaterstaat-otg-lis-20260727.csv)
- [`module-coupling-findings-rijkswaterstaat-otg-lis-20260727.csv`](./module-coupling-findings-rijkswaterstaat-otg-lis-20260727.csv)
- Duplication pack: [`duplication-findings-rijkswaterstaat-otg-lis-20260727/`](./duplication-findings-rijkswaterstaat-otg-lis-20260727/)

Checklist: [`SIGRID-20260727-ACCEPT-CHECKLIST.md`](./SIGRID-20260727-ACCEPT-CHECKLIST.md)

## Architecture — Component independence HIGH (Accept — intentional façades)

| Module | Why |
| --- | --- |
| `src/api-hooks/templateFlights/useTemplateFlights.ts` | Domain React Query façade |
| `src/api-hooks/finishedPlans/usePlanPointAttachments.ts` | Domain React Query façade |
| `src/api-hooks/points/usePointLookupQueries.ts` | Domain React Query façade |
| `src/hooks/useLogAction.ts` | App-wide logging façade |
| `src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts` | Domain React Query façade |
| `src/hooks/consts/useConstSelectOptions.ts` | Const lookup façade |
| `src/hooks/useGetFlightTimesDistance.ts` | Thin query wrapper |
| `src/api-hooks/consts/useLookupQuery.ts` | Shared lookup façade |
| `src/helpers/refreshToken.ts` | Auth helper entry |
| `src/api-hooks/emails/useEmailsList.ts` | Domain React Query façade |

## Architecture — Independence MEDIUM (Accept — 134 items)

Façade-only splits did not move Architecture stars. Accept all MEDIUM independence rows. **Do not re-split for score.**

## Architecture — Module coupling (Accept — 23 items)

| Module | Why |
| --- | --- |
| `src/hooks/useLogAction.ts` | HIGH fan-in by design |
| `src/hooks/useContent.ts` | HIGH fan-in i18n hub |
| `nnederlandLayerBuilders.ts` | Layer catalogue builder hub |
| `useUpdateDataCore.ts` | Shared mutation helper |
| `routeResponses.ts` | Shared HTTP helpers |
| `nnederlandIconPrimitives.tsx` | Layer icon primitives hub |
| `useWizardButtons.ts` | Cohesive wizard hook |
| `useConstSelectOptions.ts` | Const lookup façade |
| `useResetFeatures.ts` | Feature reset hook |
| EditGeometry `coords.ts` | Tiny shared utility |
| `validateMapView.ts` | Tiny map guard |
| Remaining LOW coupling rows | Shared infrastructure |

## Maintainability — Duplication (code-fixed in 20260727 wave)

| Clone family | Status |
| --- | --- |
| FlightPlan ↔ TemplateFlight Step2 Buttons | **Code-fixed** via `buildWizardStep2Selection` |
| FE↔BE `keycloakUser`, `devices`, `installer` | **Code-fixed** via `backend/src/shared/` |
| FE↔BE `pointCoreColumns` / identity keys / PointDetailsFieldsList | **Code-fixed** via shared keys |
| FE↔BE flight-plan persistence fields | **Code-fixed** via `shared/flightPlanFields` |
| FE↔BE geometry form fields | **Code-fixed** via `shared/geometryFormFields` |
| `public/index.html` ↔ root `index.html` | **Deleted** dead CRA `public/index.html` |

Expect Dup HIGH → 0 on next rescan.

## Security (Accept / out of scope if still RAW)

| Finding | Why |
| --- | --- |
| Docker CWE-266 | Out of scope unless non-root containers required |

## Expected post-Accept

Architecture actionable independence/coupling drops after Accept of ~167 items. Duplication cleared by code.
