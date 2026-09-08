# Batch 0 — Verification Plan

> **For agentic workers:** this batch produces **no code**. It answers five
> questions, two of which change the content of a later plan. Record every
> answer in the "Findings" section at the bottom of this file and commit it.

**Goal:** Establish the five environmental facts that the remediation plans
assume, before any code is written.

**Architecture:** Five independent investigations. Two are gates — Batch 4 Task 4
and Batch 5 Task 2 must not start until Q1 and Q4 are answered.

**Tech Stack:** `psql` (or any Postgres client), Keycloak admin console, Windows
Explorer / PowerShell on a field device.

**Spec:** `../../lis-upload-weaknesses.html`

## Global Constraints

- Read-only. No schema changes, no config changes, no code.
- Q1 must be run against the **production** database — a dev database may have
  drifted from it.
- Record the exact output, not a summary. "No unique index" and "I didn't find
  one" are different claims.

---

### Task 1: Q1 — Does a unique constraint already prevent duplicate rows?

**Gates:** Batch 4, Task 4.

**Why it matters:** W-03 assumes a retried upload silently duplicates rows. If a
unique index already exists, the retry instead fails with a constraint violation
— a visible error, not silent corruption — and the fix becomes *handle the
error* rather than *add an `upload_id`*.

**Files:**
- Modify: `LIS/planning/batch-0-verification.md` (Findings section)

- [ ] **Step 1: List constraints and indexes on the three insert targets**

Run against production:

```sql
SELECT
  c.relname            AS table_name,
  i.relname            AS index_name,
  ix.indisunique       AS is_unique,
  pg_get_indexdef(i.oid) AS definition
FROM pg_class c
JOIN pg_index ix    ON ix.indrelid = c.oid
JOIN pg_class i     ON i.oid = ix.indexrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'lis'
  AND c.relname IN ('finished_plans', 'attachments', 'finished_plans_path')
ORDER BY c.relname, i.relname;
```

- [ ] **Step 2: Check whether duplicates already exist in the wild**

This tells you whether the bug has already fired in production.

```sql
-- duplicate (plan, point) rows in finished_plans
SELECT plan_id, point_id, COUNT(*) AS copies
FROM lis.finished_plans
GROUP BY plan_id, point_id
HAVING COUNT(*) > 1
ORDER BY copies DESC
LIMIT 50;

-- more than one GPS track for a single plan
SELECT planid, COUNT(*) AS paths
FROM lis.finished_plans_path
GROUP BY planid
HAVING COUNT(*) > 1
ORDER BY paths DESC
LIMIT 50;
```

- [ ] **Step 3: Record the verdict**

Write into Findings below, verbatim:
- the index list from Step 1
- the row counts from Step 2
- **Verdict:** `NO_CONSTRAINT` (proceed with Batch 4 Task 4 as written) or
  `CONSTRAINT_EXISTS` (rewrite Batch 4 Task 4 — see the note in that task)

- [ ] **Step 4: Commit**

```bash
git add planning/batch-0-verification.md
git commit -m "planning: record Q1 database constraint findings"
```

---

### Task 2: Q2 — Is `Pictures\Lis` OneDrive-backed on field devices?

**Why it matters:** W-01 severity. If the camera folder is OneDrive-synced with
Files On-Demand, photos can become cloud-only placeholders and be unreadable
*precisely while the device is offline*, which makes W-01 near-certain rather
than merely possible.

**Files:**
- Modify: `LIS/planning/batch-0-verification.md` (Findings section)

- [ ] **Step 1: Resolve the real camera folder on a field device**

The app uses Electron's `app.getPath("pictures")`. On the device, in PowerShell:

```powershell
[Environment]::GetFolderPath('MyPictures')
```

- [ ] **Step 2: Check whether that path is inside a OneDrive root**

```powershell
$p = [Environment]::GetFolderPath('MyPictures')
"Pictures resolves to: $p"
"Inside OneDrive:      " + ($p -like "*OneDrive*")
$env:OneDrive
$env:OneDriveCommercial
```

- [ ] **Step 3: Check for dehydrated (cloud-only) files**

A file with the `Offline` / reparse attributes is a placeholder — its bytes are
not on disk.

```powershell
Get-ChildItem (Join-Path ([Environment]::GetFolderPath('MyPictures')) 'Lis') -File |
  Select-Object Name, Length, Attributes |
  Format-Table -AutoSize
```

Look for `Offline`, `ReparsePoint`, or `RecallOnDataAccess` in `Attributes`.

- [ ] **Step 4: Check Storage Sense, which can delete these files automatically**

```powershell
Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\StorageSense\Parameters\StoragePolicy" -ErrorAction SilentlyContinue
```

- [ ] **Step 5: Record the verdict**

**Verdict:** `ONEDRIVE_BACKED` (raise W-01 to blocking, and note that Batch 3
must copy to a path *outside* any synced folder) or `LOCAL_ONLY` (W-01 stays as
scoped).

- [ ] **Step 6: Commit**

```bash
git add planning/batch-0-verification.md
git commit -m "planning: record Q2 Pictures folder findings"
```

---

### Task 3: Q3 — What are the Keycloak token lifetimes?

**Why it matters:** W-06 severity. The desktop makes **no** backend calls during
the ArcGIS attachment phase, so nothing refreshes the session. If Keycloak's SSO
Session Max is shorter than a worst-case upload, the final POST can 401 after
every photo has already been uploaded.

**Files:**
- Modify: `LIS/planning/batch-0-verification.md` (Findings section)

- [ ] **Step 1: Read the realm settings**

In the Keycloak admin console, for **both** realms (the `public` and `intranet`
profiles from `backend/src/routes/auth/oidcProfiles.ts`):

Realm settings → Sessions:
- SSO Session Idle
- SSO Session Max

Realm settings → Tokens:
- Access Token Lifespan
- Refresh Token Max Reuse / Client Session Idle / Client Session Max

- [ ] **Step 2: Read the backend's own window**

```bash
# on the backend host
echo "SESSION_COOKIE_MAX_AGE_MS=$SESSION_COOKIE_MAX_AGE_MS"   # default 28800000 (8h)
echo "SESSION_ROLLING=$SESSION_ROLLING"                        # default true
echo "AUTH_REFRESH_THRESHOLD_SEC=$AUTH_REFRESH_THRESHOLD_SEC"  # default 60
```

- [ ] **Step 3: Estimate the worst-case upload duration**

```sql
-- photos per plan, to size the worst case
SELECT fp.plan_id,
       COUNT(a.id) AS attachments,
       SUM(1)      AS rows
FROM lis.finished_plans fp
LEFT JOIN lis.attachments a ON a.point_id = fp.point_id
GROUP BY fp.plan_id
ORDER BY attachments DESC
LIMIT 20;
```

Multiply the worst count by a pessimistic per-photo time (compression + upload +
the deliberate 200 ms inter-photo delay in `useUploadAttachmentsForPoint.ts`) on
a slow tethered link.

- [ ] **Step 4: Record the verdict**

**Verdict:** `AT_RISK` (shortest lifetime < worst-case upload — W-06 becomes
High, do Batch 4 Task 3 before Task 1) or `HEADROOM_OK` (W-06 stays Medium).

- [ ] **Step 5: Commit**

```bash
git add planning/batch-0-verification.md
git commit -m "planning: record Q3 Keycloak lifetime findings"
```

---

### Task 4: Q4 — Is the forced re-login at Verstuur a real requirement?

**Gates:** Batch 5, Task 2.

**Why it matters:** the two possible fixes are opposites. Either enforce the
logout properly (clear the Electron cookie jar, queue the revoke for when the
device reconnects) or delete it — today it costs an extra login in the workflow
while delivering the guarantee only when the device happened to be online, which
at Verstuur it never is.

**Files:**
- Modify: `LIS/planning/batch-0-verification.md` (Findings section)

- [ ] **Step 1: Find the origin of the requirement**

The behaviour is documented as intentional in
`LIS-Desktop/docs/SYSTEM-DESIGN.md` (lines ~269 and ~565, listed as a tradeoff)
and implemented at
`LIS-Desktop/src/Components/Main/Left/Actions/OfflineAreas/Buttons/SaveButton.tsx:113-121`.

```bash
cd ../../LIS-Desktop
git log -S "logoutAuthenticatedUser" --oneline -- src/Components/Main/Left/Actions/OfflineAreas/
git log --oneline --all --grep="logout" --grep="Verstuur" -i
```

- [ ] **Step 2: Ask the product owner one question**

> "After Verstuur, must the operator re-authenticate before the flight can be
> uploaded to the database — is that a security or audit requirement, or was it
> a convenience/technical decision?"

- [ ] **Step 3: Record the verdict**

**Verdict:** `REQUIRED` (implement Batch 5 Task 2 as written) or `NOT_REQUIRED`
(replace Batch 5 Task 2 with the removal variant documented in that task).

- [ ] **Step 4: Commit**

```bash
git add planning/batch-0-verification.md
git commit -m "planning: record Q4 forced re-login policy"
```

---

### Task 5: Q5 — Do real `vluchtnummer` values contain unsafe characters?

**Why it matters:** W-05 priority. The write path sanitises the flight number
into the folder name, the read path looks it up raw. It only bites when the value
contains whitespace or one of `<>:"/\|?*`.

**Files:**
- Modify: `LIS/planning/batch-0-verification.md` (Findings section)

- [ ] **Step 1: Query for values that would be rewritten by `sanitizeName`**

`sanitizeName` in `electron/helpers/saveJSON.js` trims, then replaces runs of
`[<>:"/\|?*\s]` with `-`.

```sql
SELECT id, vluchtnummer, status, created_at
FROM lis.flightplans
WHERE vluchtnummer ~ '[<>:"/\\|?*[:space:]]'
ORDER BY created_at DESC;
```

- [ ] **Step 2: Count how many are still uploadable**

A plan in `prepared` or `in-progress` with an unsafe name is one an operator
could hit today.

```sql
SELECT status, COUNT(*)
FROM lis.flightplans
WHERE vluchtnummer ~ '[<>:"/\\|?*[:space:]]'
GROUP BY status;
```

- [ ] **Step 3: Check field devices for already-orphaned folders**

Any folder whose name differs from its plan's `vluchtnummer` is unreachable by
the read path today.

```powershell
Get-ChildItem C:\lis-temp-data -Directory | Select-Object Name, LastWriteTime
```

- [ ] **Step 4: Record the verdict**

**Verdict:** `AFFECTED` (W-05 is live — do Batch 2 before Batch 3, and the
folder-migration step in Batch 2 Task 5 is mandatory) or `THEORETICAL` (W-05
stays as scoped; the migration step is still worth doing but is not urgent).

- [ ] **Step 5: Commit**

```bash
git add planning/batch-0-verification.md
git commit -m "planning: record Q5 vluchtnummer character findings"
```

---

## Findings

Fill this in as you go. Leave the verdict lines exactly as named — later plans
refer to these strings.

### Q1 — database constraints
- **Verdict:** _(NO_CONSTRAINT | CONSTRAINT_EXISTS)_
- Indexes found:
- Existing duplicate rows (`finished_plans`):
- Existing duplicate rows (`finished_plans_path`):

### Q2 — Pictures folder
- **Verdict:** _(ONEDRIVE_BACKED | LOCAL_ONLY)_
- Resolved path:
- Dehydrated files observed:
- Storage Sense enabled:

### Q3 — Keycloak lifetimes
- **Verdict:** _(AT_RISK | HEADROOM_OK)_
- SSO Session Max (public / intranet):
- Access token lifespan:
- `SESSION_COOKIE_MAX_AGE_MS` / `SESSION_ROLLING`:
- Worst observed attachment count / estimated upload duration:

### Q4 — forced re-login
- **Verdict:** _(REQUIRED | NOT_REQUIRED)_
- Decision owner and date:
- Rationale:

### Q5 — vluchtnummer characters
- **Verdict:** _(AFFECTED | THEORETICAL)_
- Count of affected plans:
- Of which still `prepared` / `in-progress`:
- Orphaned folders observed on devices:
