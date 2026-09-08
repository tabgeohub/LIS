# Flight plan upload — remediation programme

Sequencing index for the 13 weaknesses documented in
`../../lis-upload-weaknesses.html` (the spec for this programme).

Operating condition that drives all of it: **the device is offline for the whole
flight, the operator presses Verstuur while still offline, and the upload to the
database happens hours later on a different network.**

## Why six batches instead of one plan or thirteen tickets

**Not one plan** — the two repositories do not share a release train. Backend
deploys on your schedule; LIS-Desktop changes require field devices to install a
new build. Batching everything would hold W-02 (a ~30-line change that stops
permanent data loss) hostage to W-01 (a subsystem rewrite).

**Not thirteen tickets** — three fixes each add a field to the on-disk
`flightPlan.json`. Shipped independently they would migrate the on-disk format
three times, on devices that may be holding unuploaded flights *between*
versions. That format is therefore designed once, up front, in
[`SPEC-plan-json-schema.md`](./SPEC-plan-json-schema.md), and landed
incrementally.

## Batches

| # | Plan | Fixes | Repo | Ships |
|---|------|-------|------|-------|
| 0 | [batch-0-verification.md](./batch-0-verification.md) | — | — | No code. Gates 1, 4, 5 |
| 1 | [batch-1-block-partial-uploads.md](./batch-1-block-partial-uploads.md) | W-02 | Desktop | Alone, urgently |
| 2 | [batch-2-filesystem-robustness.md](./batch-2-filesystem-robustness.md) | W-05, W-08, W-09 | Desktop | Independent |
| 3 | [batch-3-image-lifecycle.md](./batch-3-image-lifecycle.md) | W-01, W-12 | Desktop | Independent |
| 4 | [batch-4-upload-resilience.md](./batch-4-upload-resilience.md) | W-04, W-06, W-03 | Desktop + Backend | Coordinated |
| 5 | [batch-5-cleanup.md](./batch-5-cleanup.md) | W-07, W-10, W-11, W-13 | Desktop + Backend | Independent |

## Dependency order

```
Batch 0 (verify)
   │
   ├──► Batch 1 ──────────────────────────────► ship immediately
   │       │ (adds vitest — needed by 2, 3, 4, 5)
   │       ▼
   ├──► Batch 2 ─────► independent, ship when ready
   │       │
   │       ▼ (atomic writes + planFiles.js needed by 3)
   ├──► Batch 3 ─────► carries the v2 schema migration
   │       │
   │       ▼ (persisted attachments build on v2)
   ├──► Batch 4 ─────► backend half may ship ahead of desktop half
   │
   └──► Batch 5 ─────► independent of everything above
```

Hard dependencies only:

- **1 → 2, 3, 4, 5** — Batch 1 Task 1 installs vitest; every later batch uses it.
- **2 → 3** — Batch 3 writes image files next to the plan JSON and relies on the
  atomic write and the shared `planFiles.js` module created in Batch 2.
- **3 → 4** — Batch 4 persists `attachments[]` into the plan JSON, which is a v2
  schema field introduced in Batch 3.

Batch 5 touches none of the above and can be done by a second person in parallel.

## Gates from Batch 0

Two Batch 0 findings change the *content* of a later plan, not just its priority.
Do not start those batches before recording the answers:

| Question | Gates | If the answer is… |
|---|---|---|
| Does a unique index already exist on `lis.finished_plans`? | Batch 4 Task 4 | …yes, a retry raises a hard error rather than duplicating; the fix becomes error handling, not an `upload_id` |
| Is the forced re-login at Verstuur a real policy requirement? | Batch 5 Task 2 | …no, delete the logout entirely instead of repairing it |

## Test conventions (both repos)

Neither repo tests React components or Express handlers. Both test **pure
functions extracted into helper modules**. Every plan below follows that seam:
extract the decision, unit-test the decision, then wire it in.

- **LIS-Desktop `electron/`** — `node:test` + `node:assert/strict`, colocated
  `*.test.mjs`, run with `node --test`. Pattern:
  `electron/helpers/desktopLoginUrl.test.mjs`.
- **LIS-Desktop `src/`** — no runner exists today. Batch 1 Task 1 adds vitest,
  matching the LIS web repo which already uses it.
- **LIS backend** — plain ts-node scripts with a hand-rolled `run()` helper,
  colocated `*.test.ts`, registered as a `test:*` npm script. Pattern:
  `backend/src/routes/auth/authKeycloak/safeReturnPath.test.ts`.

## Conventions for every plan here

- Steps are checkboxes; tick them as you go.
- Each task ends with a commit. Commit messages use the repo's existing informal
  style (`feature:`, `fix:`) — see `git log --oneline`.
- Plans are written for an engineer who does not know this codebase. Every file
  path is exact and every code block is real.
