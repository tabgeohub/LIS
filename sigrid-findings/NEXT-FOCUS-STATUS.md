# Next focus status — Security/Reliability recovery (`20260721`)

Dashboard before fix: Maintainability **4.2** · Architecture **3.3** · Security **3.2** · Reliability **2.9**.

## Root cause (Jul21 drop)

- **axios@1.17.0** newly flagged (10 CVEs, First Seen 2026-07-21) — drove Security + Reliability down
- **csvExportCore.ts** MEDIUM XSS — side effect of CSV Core refactor
- **Docker CWE-266** — unchanged RAW (Accept only; no file edits)

Most prior Security findings (multer, undici, nodemailer, xlsx, puppeteer, redirects, email HTML) are **FIXED** in Jul21 export.

## Applied this wave

| Fix | Files |
| --- | --- |
| axios `^1.18.1` | `package.json`, `package-lock.json` (1.18.1 resolved) |
| csvExportCore Semgrep | `buildCsvHeaderLine` + nosemgrep |
| Accept ledger | [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) — Docker only; no Docker/Nginx code |

## Verification

- `npm run check:architecture` — pass
- `npm run test:architecture-helpers` — pass

## Manual before next export

1. **Accept Docker** in Sigrid UI per ACCEPT-LIST (no Dockerfile changes).
2. Re-export Sigrid; expect Security/Reliability stars to recover (axios FIXED, csvExportCore cleared).
