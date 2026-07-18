# Sigrid Accept list — export `20260718(2)` (huge fix wave)

Use for a **Sigrid UI Accept** pass. Do not rewrite these unless responsibilities start mixing.

Source: [`all-findings-rijkswaterstaat-otg-lis-20260718(2)`](./all-findings-rijkswaterstaat-otg-lis-20260718(2)/)

## Maintainability — Unit size (Accept)

| Module | Why |
| --- | --- |
| `backend/dockerfile` | Deployment artifact |
| `backend/scripts/verify-regio-apis.ts` | Verification script |

## Maintainability — Duplication (Accept / out of scope)

| Clone family | Why |
| --- | --- |
| FE↔BE `keycloakUser`, `devices`, `installer` types | Needs shared package; skip |
| FE↔BE `pointCoreColumns` ↔ FE identity keys | Cross-layer twin |
| FE↔BE flight-plan persistence field lists | Cross-layer twin |
| `public/index.html` ↔ root `index.html` | CRA (`%PUBLIC_URL%`) vs Vite (`/src/index.tsx`) entry shells — not safe to merge |

## Architecture — Component independence HIGH (Accept — intentional façades)

| Module | Why |
| --- | --- |
| `src/hooks/useLogAction.ts` | App-wide logging façade |
| `src/hooks/useContent.ts` | App-wide i18n/content hub (also Coupling HIGH) |
| `src/hooks/consts/useConstSelectOptions.ts` | Const lookup façade |
| `src/hooks/useGetFlightTimesDistance.ts` | Thin query wrapper |
| `src/helpers/refreshToken.ts` | Auth helper entry |
| `src/api-hooks/templateFlights/useTemplateFlights.ts` | Domain React Query façade |
| `src/api-hooks/points/usePointLookupQueries.ts` | Domain React Query façade |
| `src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts` | Domain React Query façade |
| `src/api-hooks/finishedPlans/usePlanPointAttachments.ts` | Domain React Query façade |
| `src/api-hooks/consts/useLookupQuery.ts` | Shared lookup façade |
| `src/api-hooks/emails/useEmailsList.ts` | Domain React Query façade |

`planHoverClickHandlers.ts` was thinned to a re-export barrel (code fix) — re-check after next scan before Accepting.

## Architecture — Component independence MEDIUM (Accept — intentional shared layer)

Accept remaining Independence MEDIUM on shared `hooks/`, `helpers/`, `api-hooks/` (including existing `*Core` / `*Internal` bodies). Façade-only splits did **not** move Architecture stars; do **not** add more Core churn for score.

## Architecture — Module coupling (Accept)

| Module | Why |
| --- | --- |
| `useLogAction` / `useContent` | HIGH fan-in by design |
| `validateMapView`, EditGeometry `coords.ts` | Tiny shared utilities |
| `useWizardButtons`, `useConstSelectOptions`, `useResetFeatures` | Cohesive hooks |
| `nnederlandLayerBuilders` / icon primitives | Layer catalogue builders |
| `useUpdateDataCore`, `routeResponses`, `authSecurityLog` | Shared HTTP helpers |

## Architecture — Component entanglement (Accept)

| Finding | Why |
| --- | --- |
| High density on `src/api-hooks` | Intentional React Query façade layer |

## Security (Accept / out of scope)

| Finding | Why |
| --- | --- |
| Docker CWE-266 (`dockerfile`, `backend/dockerfile`) | Out of scope unless non-root containers required |

## Do NOT Accept without product decision

- Security findings already fixed in code (CRITICAL SQL path, Puppeteer SSRF, deps, open redirect, XSS/HTML) — prefer FIXED status on rescan, not Accept
