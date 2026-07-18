# Sigrid Accept list — Jul 18 pack (intentional / out of scope)

Use this list for a **Sigrid UI Accept** pass. Do not re-open with code splits unless responsibilities start mixing.

Source pack: [`all-findings-rijkswaterstaat-otg-lis-20260718`](./all-findings-rijkswaterstaat-otg-lis-20260718/)

## Unit size (Accept)

| Unit | Why |
| --- | --- |
| `backend/dockerfile` | Deployment; out of scope for score |
| `verify-regio-apis.ts.testResolveRegioFilter` | Backend verification script; cohesive test table |

Ignore Unit size LOW (753) — not a score lever.

## Security (Accept / out of scope)

| Finding | Why |
| --- | --- |
| Missing User Instruction (CWE-266) on `dockerfile` / `backend/dockerfile` | Out of scope unless product wants non-root `USER` |
| CSV XSS (CWE-79) on `csvExport.ts` | Mitigated via `escapeCsvCell` + nosemgrep; CSV not HTML |

CRITICAL SQLi and Reliability dep findings already FIXED in export.

## Component independence (Accept)

Thin intentional façades / lookup hooks (HIGH examples):

- `src/hooks/useLogAction.ts`
- `src/hooks/useContent.ts` (also Coupling HIGH hub)
- `src/hooks/consts/useConstSelectOptions.ts`
- `src/hooks/useGetFlightTimesDistance.ts`
- `src/helpers/refreshToken.ts`
- `src/api-hooks/templateFlights/useTemplateFlights.ts`
- `src/api-hooks/points/usePointLookupQueries.ts`
- `src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts`
- `src/api-hooks/finishedPlans/usePlanPointAttachments.ts`
- `src/api-hooks/consts/useLookupQuery.ts`
- `src/api-hooks/emails/useEmailsList.ts`

Plus remaining Independence MEDIUM thin api-hooks wrappers unless a module starts bundling unrelated concerns.

## Module coupling (Accept)

| Module | Why |
| --- | --- |
| `useLogAction` / `useContent` | App-wide hubs (high fan-in by design) |
| `classNames`, `validateMapView`, `coords.ts` | Tiny shared utilities |
| `useWizardButtons`, `useConstSelectOptions`, `useResetFeatures` | Cohesive hooks |
| `nnederlandLayerBuilders` / icon primitives | Layer catalogue builders |
| `useUpdateData`, `routeResponses`, `authSecurityLog` | Shared HTTP/mutation helpers |

## Component entanglement (Accept)

| Finding | Why |
| --- | --- |
| High density on `src/api-hooks` | Expected React Query façade layer |
| Moderate density on helpers/hooks/HomePage/Timeslider | Normal for this app shape |

## After Accept

Re-export from Sigrid and compare Maintainability stars + HIGH/MEDIUM counts — not raw 1.3K total.
