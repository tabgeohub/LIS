# Next focus status — Huge fix wave (`20260718(2)`)

Dashboard baseline: Maintainability **4.1** · Architecture **3.3**.

## Cleared / addressed this wave

| Area | Action |
| --- | --- |
| LegendSection | `useLegendSectionModel` ≤30 LOC + parent-state options; shared `legendSectionLayoutProps` |
| Duplication HIGH same-component (~34) | Finished remaining clones; FE↔BE + dual `index.html` Accepted |
| Interfacing 4-param (14) | Collapsed to options (10 code; 4 already options) |
| Complexity McCabe ≥8 (~48) | Thinned 47/48 (1 type artifact skipped) |
| Security CRITICAL | Stale `.js` path; TS/scripts parameterized + column allowlist |
| Security HIGH | Puppeteer SSRF blocked; multer/undici/nodemailer/@e965/xlsx bumped |
| Security MEDIUM | Open redirect allowlist; HTML/CSV escape |
| Reliability HIGH | Same multer/undici bumps |
| Independence HIGH | `planHoverClickHandlers` → thin re-export barrel + siblings |
| Accept ledger | Bulk hubs / Core MEDIUM / Docker / FE↔BE documented |

## Explicit non-goals (held)

- No more Independence `*Core` façades
- No Dockerfile edits (CWE-266 Accept)
- No rewriting `useLogAction` / `useContent`

## Verification

- `npm run check:architecture`
- `npm run test:architecture-helpers`

## Before next Sigrid export

1. Apply [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) in Sigrid UI (Architecture hubs + Docker + FE↔BE Dup).
2. Smoke-test: email PDF, Keycloak callback redirect, map plan hover/click, CSV export, uploads.
3. Expect Maintainability volume drop; Architecture may stay 3.3 until Accept lands.
