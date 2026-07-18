# Sigrid Accept list — export `20260718(1)` (Architecture wave)

Use for a **Sigrid UI Accept** pass. Do not rewrite these unless responsibilities start mixing.

Source: [`all-findings-rijkswaterstaat-otg-lis-20260718(1)`](./all-findings-rijkswaterstaat-otg-lis-20260718(1)/)

## Component independence HIGH (Accept — intentional façades)

| Module | Why |
| --- | --- |
| `src/hooks/useLogAction.ts` | App-wide logging façade |
| `src/hooks/useContent.ts` | App-wide i18n/content hub |
| `src/hooks/consts/useConstSelectOptions.ts` | Const lookup façade |
| `src/hooks/useGetFlightTimesDistance.ts` | Thin query wrapper |
| `src/helpers/refreshToken.ts` | Auth helper entry |
| `src/api-hooks/templateFlights/useTemplateFlights.ts` | Domain React Query façade |
| `src/api-hooks/points/usePointLookupQueries.ts` | Domain React Query façade |
| `src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts` | Domain React Query façade |
| `src/api-hooks/finishedPlans/usePlanPointAttachments.ts` | Domain React Query façade |
| `src/api-hooks/consts/useLookupQuery.ts` | Shared lookup façade |
| `src/api-hooks/emails/useEmailsList.ts` | Domain React Query façade |

## Module coupling (Accept — hubs / tiny utils)

| Module | Why |
| --- | --- |
| `useLogAction` / `useContent` | HIGH fan-in by design |
| `validateMapView`, EditGeometry `coords.ts` | Tiny shared utilities |
| `useWizardButtons`, `useConstSelectOptions`, `useResetFeatures` | Cohesive hooks |
| `nnederlandLayerBuilders` / icon primitives | Layer catalogue builders |
| `useUpdateData`, `routeResponses`, `authSecurityLog` | Shared HTTP helpers |

## Component entanglement (Accept)

| Finding | Why |
| --- | --- |
| High density on `src/api-hooks` | Intentional React Query façade layer |
| Moderate density on helpers/hooks/HomePage/Timeslider | Normal app shape |

## Unit size / Security (Accept / out of scope)

| Finding | Why |
| --- | --- |
| `backend/dockerfile` | Deployment |
| `verify-regio-apis.ts.testResolveRegioFilter` | Verification script |
| Docker CWE-266 (USER instruction) | Out of scope unless non-root containers required |
| CSV XSS on `csvExport.ts` | Mitigated via `escapeCsvCell` |

## Do NOT Accept without code (Wave B targets)

Fat Independence MEDIUM “interface modules” under ArcGISHelpers / exports / mutations — consolidate behind façades in code first (see ARCHITECTURE wave B).
