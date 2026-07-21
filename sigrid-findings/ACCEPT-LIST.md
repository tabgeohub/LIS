# Sigrid Accept list — export `20260721`

Use for a **Sigrid UI Accept** pass. No Dockerfile or Nginx edits.

Source: [`security-findings-rijkswaterstaat-otg-lis-20260721.csv`](./security-findings-rijkswaterstaat-otg-lis-20260721.csv)

## Security — Docker CWE-266 (Accept only)

| Finding | Why |
| --- | --- |
| `dockerfile#L22` — Missing USER instruction | Deployment; out of scope unless ops requires non-root |
| `backend/dockerfile#L4` — Missing USER instruction | Same |

**No changes** to Dockerfiles or Nginx configs.

## Maintainability — Duplication (Accept / out of scope)

| Clone family | Why |
| --- | --- |
| FE↔BE `keycloakUser`, `devices`, `installer` types | Needs shared package |
| FE↔BE `pointCoreColumns` ↔ FE identity keys | Cross-layer twin |
| FE↔BE flight-plan persistence field lists | Cross-layer twin |
| `public/index.html` ↔ root `index.html` | CRA vs Vite entry shells |

## Architecture — Independence / Coupling / Entanglement

Accept intentional hubs (`useLogAction`, `useContent`, api-hooks façades), Coupling MEDIUM utils, entanglement on `api-hooks`, and Independence MEDIUM on shared `*Core` bodies — do not re-split for score.

## Code fixes applied (Jul21 recovery — expect FIXED on rescan)

| Finding | Fix |
| --- | --- |
| axios HIGH (Security + Reliability) | Bumped to `^1.18.1` in `package.json` / lockfile |
| `csvExportCore.ts` MEDIUM XSS | `buildCsvHeaderLine` + Semgrep nosemgrep on escaped CSV header |
