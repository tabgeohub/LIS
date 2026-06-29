"""Generate grouped Sigrid remediation plan CSVs and markdown (code + devops split)."""
import csv
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FINDINGS = os.path.join(ROOT, "sigrid-findings")
PLAN = os.path.join(FINDINGS, "plan")
DEVOPS = os.path.join(PLAN, "devops")

DEVOPS_FILE_PREFIXES = ("k8s/",)
DEVOPS_FILES = frozenset(
    {
        "dockerfile",
        "backend/dockerfile",
        "nginx.conf",
        ".gitlab-ci.yml",
    }
)


def norm_file(path: str) -> str:
    if not path:
        return ""
    return path.split("#")[0].replace("\\", "/")


def is_devops_path(file_path: str) -> bool:
    f = norm_file(file_path).lower()
    if not f:
        return False
    if f in DEVOPS_FILES:
        return True
    if any(f.startswith(p) for p in DEVOPS_FILE_PREFIXES):
        return True
    if "dockerfile" in f:
        return True
    if "nginx" in f and f.endswith(".conf"):
        return True
    return False


def is_devops_security_row(row: dict) -> bool:
    f = row.get("File") or row.get("Locations", "")
    if is_devops_path(f):
        return True
    origin = (row.get("Origin") or "").upper()
    desc = (row.get("Description") or row.get("Type") or "").lower()
    if origin == "KICS" and is_devops_path(f):
        return True
    if "kubernetes" in desc and is_devops_path(f):
        return True
    return False


def is_devops_maint_row(row: dict) -> bool:
    f = norm_file(row.get("File") or "")
    return is_devops_path(f)


def load_csv(name: str) -> list[dict]:
    path = os.path.join(FINDINGS, name)
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


categories = {
    "Security": "Security findings.csv",
    "Reliability": "Reliability findings.csv",
    "Unit size": "Unit size findings.csv",
    "Unit complexity": "Unit complexity findings.csv",
    "Unit interfacing": "Unit interfacing findings.csv",
    "Module coupling": "Module coupling findings.csv",
    "Component independence": "Component independence findings.csv",
    "Component entanglement": "Component entanglement findings.csv",
    "Duplication": "Duplication findings.csv",
    "Duplicates": "Duplicates.csv",
}

data = {k: load_csv(v) for k, v in categories.items()}

code_work_packages: list[dict] = []
devops_work_packages: list[dict] = []


def wp(target: list, id_: str, phase: str, name: str, scope: str, approach: str, risks: str, depends_on: str, verify: str, remark: str = "") -> None:
    target.append(
        {
            "WorkPackageID": id_,
            "Phase": phase,
            "Name": name,
            "Scope": scope,
            "Approach": approach,
            "RisksIfDoneWrong": risks,
            "DependsOn": depends_on,
            "Verification": verify,
            "SigridRemarkStrategy": remark,
        }
    )


# --- Code work packages ---
wp(
    code_work_packages,
    "WP-00",
    "0 - Prep",
    "Baseline and process",
    "Code findings only (see devops/ for K8s, Docker, nginx).",
    "One work package per PR; re-export Sigrid after each phase.",
    "Mixing infra and app changes in one PR",
    "",
    "Sigrid code findings improve per phase",
)

wp(
    code_work_packages,
    "WP-01",
    "1 - Dependencies",
    "Backend npm dependency upgrades",
    "multer, undici, nodemailer in backend/package.json + package-lock.json",
    "Run npm audit in backend/; upgrade targeted packages; smoke-test file upload and API flows.",
    "Breaking changes in multer/nodemailer; lockfile drift if partial updates",
    "WP-00",
    "Clears 2 Reliability RAW + 3 Security RAW",
    "Single lockfile regeneration in one PR",
)

wp(
    code_work_packages,
    "WP-02",
    "1 - Dependencies",
    "Frontend xlsx dependency",
    "xlsx alias npm:@e965/xlsx in root package.json",
    "Confirm lockfile uses patched fork; bump fork if needed; test Excel export/import.",
    "Excel export regressions in report flows",
    "WP-00",
    "Clears xlsx Security RAW",
)

wp(
    code_work_packages,
    "WP-05",
    "2 - Dev tooling",
    "verify-regio-apis SQL injection",
    "backend/scripts/verify-regio-apis.js + .ts",
    "Fix parameterized queries in .ts; delete stale .js; OR exclude backend/scripts/ from scan.",
    "Breaking local verify script; Sigrid still flags .js if not removed",
    "WP-00",
    "Clears 2 CRITICAL RAW; npm run verify:regio-apis passes",
    "Dev-only script — not production attack surface",
)

send_email_file = "backend/src/routes/emails/sendEmail.ts"
sec_raw = [r for r in data["Security"] if send_email_file in (r.get("File") or "") and r.get("Status") == "RAW"]
sec_all = [r for r in data["Security"] if send_email_file in (r.get("File") or "")]
maint_count = sum(
    1
    for cat in ("Unit size", "Unit complexity", "Unit interfacing")
    for r in data[cat]
    if send_email_file in (r.get("File") or "")
)

wp(
    code_work_packages,
    "WP-06",
    "3 - sendEmail cluster",
    "sendEmail.ts single refactor",
    f"{send_email_file} — {len(sec_raw)} Security RAW, {len(sec_all)} Security total, {maint_count} maintainability",
    "One PR: extract HTML builders, puppeteer PDF service (keep request blocking), mail sender; thin route handler.",
    "PDF layout/email regressions; double-touch if done before WP-01",
    "WP-01",
    "Manual spoedrapport test; clears multiple Security + maintainability findings",
    "Do not split security and refactor into separate PRs on same file",
)

wp(
    code_work_packages,
    "WP-07",
    "3 - Auth/HTML",
    "Keycloak callback open redirect",
    "backend/src/routes/auth/authKeycloak/callbackHandler.ts",
    "Confirm safeReturnPath(); add unit tests; Sigrid remark if satisfied.",
    "Breaking post-login deep links",
    "WP-00",
    "Malicious redirect tests pass",
    "Likely false positive — do not remove validation",
)

wp(
    code_work_packages,
    "WP-08",
    "3 - Auth/HTML",
    "renderDownloadPage HTML template",
    "backend/src/helpers/renderDownloadPage.ts",
    "Escape all interpolated data; share HTML utilities with WP-06.",
    "XSS on download page",
    "WP-06",
    "Clears CWE-116 RAW",
)

wp(
    code_work_packages,
    "WP-09",
    "3 - Auth/HTML",
    "fileDownload.ts verify FIXED",
    "backend/src/routes/fileDownload.ts",
    "Regression check only when touching download flow.",
    "Re-opening XSS",
    "WP-08",
    "Sigrid stays FIXED",
)

dup_clusters = [
    ("DUP-01", "Flight plan Buttons pattern", "Shared 9-10 line button blocks across Voorbereiding wizard steps"),
    ("DUP-02", "Flight plan FormElements", "FormElements / FormInputs / Step1 shared form blocks"),
    ("DUP-03", "useFilterPlans duplicate", "src/hooks/filters/useFilterPlans.ts + Nabewerking copy (86% dup)"),
    ("DUP-04", "PointsBuffer internal dup", "PointsBuffer.tsx internal duplication"),
    ("DUP-05", "PeriodFilter components", "Three PeriodFilter copies"),
    ("DUP-06", "Dashboard user forms", "AllRoles / AddUser / EditUser"),
    ("DUP-07", "Zustand plan state", "Finished/reuse/view/duplicate plan state hooks"),
    ("DUP-08", "PointsList variants", "PointsList.tsx / PointsListEdit.tsx"),
]

for dup_id, name, scope in dup_clusters:
    wp(
        code_work_packages,
        dup_id,
        "4 - Duplication",
        name,
        scope,
        "Extract shared component/hook; one PR per cluster; UI smoke on affected flows.",
        "Wizard UI regressions; merge conflicts if clusters combined",
        "Independent unless same file as WP-06",
        "Duplication count drops for cluster",
        "One cluster per PR",
    )

wp(
    code_work_packages,
    "WP-10",
    "5 - Defer",
    "High fan-in hooks",
    "useContent.ts (fan-in 144), useLogAction.ts (fan-in 115)",
    "Defer until architecture/logging work.",
    "Wide blast radius",
    "Duplication phase stable",
    "Only with dedicated QA",
)

wp(
    code_work_packages,
    "WP-11",
    "5 - Defer",
    "Large map/ArcGIS units",
    "nnederlandLayers, MapComp, EditPointCoordinates, SelectFromSource",
    "Defer; split only during feature work.",
    "Map rendering regressions",
    "Duplication phase stable",
    "Map QA",
)

wp(
    code_work_packages,
    "WP-12",
    "5 - Defer",
    "Architecture coupling",
    "Component entanglement, module coupling, component independence",
    "Long-term layering initiative.",
    "Import graph breakage",
    "WP-10",
    "Incremental",
)

# --- DevOps work packages ---
wp(
    devops_work_packages,
    "DO-00",
    "0 - Prep",
    "DevOps baseline",
    "K8s, Docker, nginx, ingress — separate from application code plan.",
    "Changing K8s and app code in same PR",
    "",
    "Infra findings tracked independently",
    "",
)

wp(
    devops_work_packages,
    "DO-01",
    "1 - Docker",
    "Docker non-root USER",
    "dockerfile (nginx frontend), backend/dockerfile",
    "Add USER (nginx for frontend image, node for backend); verify container startup.",
    "Permission errors on ports/volumes",
    "DO-00",
    "Clears Missing User Instruction (2 HIGH RAW)",
)

wp(
    devops_work_packages,
    "DO-02",
    "2 - Kubernetes",
    "K8s manifests verify FIXED",
    "k8s/lis-backend-dep.yaml, k8s/lis-frontend-dep.yaml, k8s/Lis_ingressFront.yaml",
    "Verify repo matches FIXED status; no rework unless regression.",
    "Re-introducing missing limits/security context",
    "DO-00",
    "Sigrid remains FIXED; kubectl dry-run",
    "34+ findings already FIXED — verify only",
)

wp(
    devops_work_packages,
    "DO-03",
    "3 - Defer",
    "Dockerfile unit size",
    "backend/dockerfile maintainability (59 LOC)",
    "Defer unless editing Dockerfiles for DO-01.",
    "None",
    "DO-01",
    "Address with DO-01 if touching dockerfile",
)


def assign_code_wp(file: str, desc: str) -> str:
    f = norm_file(file)
    d = (desc or "").lower()
    if is_devops_path(f):
        return ""
    if "package-lock" in f and "backend/" in f:
        return "WP-01"
    if f == "package-lock.json" or ("xlsx" in d and "package-lock" in f):
        return "WP-02"
    if "verify-regio-apis" in f:
        return "WP-05"
    if "sendemail" in f.lower():
        return "WP-06"
    if "callbackhandler" in f.lower():
        return "WP-07"
    if "renderdownloadpage" in f.lower():
        return "WP-08"
    if "filedownload" in f.lower():
        return "WP-09"
    return ""


def assign_devops_wp(file: str) -> str:
    f = norm_file(file)
    if f in ("dockerfile", "backend/dockerfile") or "dockerfile" in f:
        return "DO-01"
    if f.startswith("k8s/"):
        return "DO-02"
    return "DO-00"


def build_sec_rel_mapping(assign_fn, devops_filter: bool) -> list[dict]:
    rows = []
    for cat in ("Security", "Reliability"):
        for r in data[cat]:
            f = r.get("File") or r.get("Locations", "")
            is_devops = is_devops_security_row(r)
            if devops_filter and not is_devops:
                continue
            if not devops_filter and is_devops:
                continue
            wp_id = assign_fn(f, r.get("Description", "")) if not devops_filter else assign_devops_wp(f)
            rows.append(
                {
                    "WorkPackageID": wp_id,
                    "Category": cat,
                    "Status": r.get("Status", ""),
                    "Severity": r.get("Severity", ""),
                    "Type": (r.get("Type") or r.get("Description", ""))[:120],
                    "Weakness": r.get("Weakness", ""),
                    "File": norm_file(f),
                    "Line": f.split("#L")[1] if "#L" in f else "",
                    "Origin": r.get("Origin", ""),
                    "FirstSeen": r.get("First Seen", ""),
                    "IssueAge": r.get("Issue age", ""),
                }
            )
    return rows


code_mapping = build_sec_rel_mapping(assign_code_wp, devops_filter=False)
devops_mapping = build_sec_rel_mapping(assign_devops_wp, devops_filter=True)


def build_maint_rows(devops_only: bool) -> list[dict]:
    rows = []
    for cat in (
        "Unit size",
        "Unit complexity",
        "Unit interfacing",
        "Module coupling",
        "Component independence",
    ):
        for r in data[cat]:
            f = norm_file(r.get("File") or "")
            is_devops = is_devops_maint_row(r)
            if devops_only != is_devops:
                continue
            fl = f.lower()
            if devops_only:
                wp_id = "DO-03" if "dockerfile" in fl else "DO-00"
            elif "sendemail" in fl:
                wp_id = "WP-06"
            elif "usefilterplans" in fl:
                wp_id = "DUP-03"
            elif "pointsbuffer" in fl:
                wp_id = "DUP-04"
            elif f in ("src/hooks/useContent.ts", "src/hooks/useLogAction.ts"):
                wp_id = "WP-10"
            elif "nnederlandlayers" in fl or "mapcomp" in fl:
                wp_id = "WP-11"
            elif cat in ("Module coupling", "Component independence"):
                wp_id = "WP-12"
            else:
                wp_id = "DEFER"
            rows.append(
                {
                    "WorkPackageID": wp_id,
                    "Category": cat,
                    "Status": r.get("Status", "RAW"),
                    "Severity": r.get("Severity", ""),
                    "Description": (r.get("Description") or "")[:150],
                    "File": f,
                    "Unit": r.get("Unit", ""),
                    "LOC": r.get("Lines of code", ""),
                    "Complexity": r.get("McCabe complexity", ""),
                    "Parameters": r.get("Number of parameters", ""),
                    "FanIn": r.get("Fan-in", ""),
                }
            )

    if not devops_only:
        for r in data["Component entanglement"]:
            rows.append(
                {
                    "WorkPackageID": "WP-12",
                    "Category": "Component entanglement",
                    "Status": r.get("Status", "RAW"),
                    "Severity": r.get("Severity", ""),
                    "Description": (r.get("Description") or "")[:150],
                    "File": r.get("Source component", "") + " -> " + r.get("Target component", ""),
                    "Unit": r.get("Type", ""),
                    "LOC": "",
                    "Complexity": "",
                    "Parameters": "",
                    "FanIn": "",
                }
            )
    return rows


code_maint = build_maint_rows(devops_only=False)
devops_maint = build_maint_rows(devops_only=True)


def dup_wp(locs: str) -> str:
    if "FormElements" in locs or "FormInputs" in locs:
        return "DUP-02"
    if "useFilterPlans" in locs:
        return "DUP-03"
    if "PointsBuffer" in locs:
        return "DUP-04"
    if "PeriodFilter" in locs:
        return "DUP-05"
    if "DashboardPage" in locs:
        return "DUP-06"
    if any(
        x in locs
        for x in (
            "useFinishedPlansState",
            "useViewPlanState",
            "useReuseFlightPlan",
            "usePlanDuplicateState",
        )
    ):
        return "DUP-07"
    if "PointsList" in locs:
        return "DUP-08"
    return "DUP-01"


dup_detail = []
for r in data["Duplication"]:
    locs = r.get("Locations", "")
    dup_detail.append(
        {
            "WorkPackageID": dup_wp(locs),
            "Status": r.get("Status", ""),
            "Severity": r.get("Severity", ""),
            "Description": r.get("Description", ""),
            "Occurrences": r.get("Occurrences", ""),
            "RedundantLOC": r.get("Redundant lines of code", ""),
            "Locations": locs[:400],
        }
    )

code_remarks = [
    {
        "WorkPackageID": "WP-07",
        "File": "callbackHandler.ts",
        "Finding": "Open redirect CWE-601",
        "Reason": "safeReturnPath() rejects //, ://, absolute URLs",
        "Action": "Add tests + Sigrid remark",
    },
    {
        "WorkPackageID": "WP-06",
        "File": "sendEmail.ts",
        "Finding": "Puppeteer SSRF CWE-918",
        "Reason": "blockExternalPuppeteerRequests before setContent",
        "Action": "Keep interceptor; remark if still flagged after refactor",
    },
    {
        "WorkPackageID": "WP-06",
        "File": "sendEmail.ts",
        "Finding": "HTML injection CWE-79",
        "Reason": "User fields use escapeHtml()",
        "Action": "Use explicit HTML builder; remark if template literal still flagged",
    },
    {
        "WorkPackageID": "WP-05",
        "File": "verify-regio-apis.js",
        "Finding": "SQL injection CRITICAL",
        "Reason": "Dev-only script",
        "Action": "Fix or exclude — lower priority than production",
    },
]

devops_remarks = [
    {
        "WorkPackageID": "DO-02",
        "File": "k8s/*.yaml",
        "Finding": "KICS findings FIXED",
        "Reason": "Already remediated in repo",
        "Action": "Verify only — no rework unless regression",
    },
]


def write_csv(folder: str, name: str, rows: list[dict]) -> None:
    if not rows:
        return
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, name)
    fieldnames = list(rows[0].keys())
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)


def build_master(mapping: list[dict], packages: list[dict]) -> list[dict]:
    master = []
    for m in mapping:
        if m["Status"] != "RAW":
            continue
        wp_row = next((w for w in packages if w["WorkPackageID"] == m["WorkPackageID"]), {})
        master.append(
            {
                **m,
                "WorkPackageName": wp_row.get("Name", ""),
                "Phase": wp_row.get("Phase", ""),
                "DependsOn": wp_row.get("DependsOn", ""),
            }
        )
    return master


os.makedirs(PLAN, exist_ok=True)
os.makedirs(DEVOPS, exist_ok=True)

write_csv(PLAN, "plan-00-work-packages.csv", code_work_packages)
write_csv(PLAN, "plan-01-security-reliability-mapping.csv", code_mapping)
write_csv(PLAN, "plan-02-maintainability-mapping.csv", code_maint)
write_csv(PLAN, "plan-03-duplication-mapping.csv", dup_detail)
write_csv(PLAN, "plan-04-false-positives-remarks.csv", code_remarks)
write_csv(PLAN, "plan-MASTER-action-items.csv", build_master(code_mapping, code_work_packages))

write_csv(DEVOPS, "devops-00-work-packages.csv", devops_work_packages)
write_csv(DEVOPS, "devops-01-security-reliability-mapping.csv", devops_mapping)
write_csv(DEVOPS, "devops-02-maintainability-mapping.csv", devops_maint)
write_csv(DEVOPS, "devops-03-false-positives-remarks.csv", devops_remarks)
write_csv(DEVOPS, "devops-MASTER-action-items.csv", build_master(devops_mapping, devops_work_packages))

code_raw = sum(1 for m in code_mapping if m["Status"] == "RAW")
code_fixed = sum(1 for m in code_mapping if m["Status"] == "FIXED")
devops_raw = sum(1 for m in devops_mapping if m["Status"] == "RAW")
devops_fixed = sum(1 for m in devops_mapping if m["Status"] == "FIXED")
code_master = build_master(code_mapping, code_work_packages)

code_md = f"""# Sigrid Remediation Plan — Code only

Application code, dependencies, and maintainability. **DevOps findings (K8s, Docker, nginx) are in [`devops/`](./devops/).**

## Principles

1. **One work package = one PR** (unless explicitly noted).
2. **Fix dependencies before code that uses them** (e.g. nodemailer before sendEmail refactor).
3. **Do not split sendEmail** into separate security + refactor PRs — same file, one pass.
4. **Verify FIXED items** before re-editing (fileDownload, axios, jspdf).
5. **Re-export Sigrid CSVs** after each phase and run `generate-plan.py`.

## Finding counts (code scope)

| Area | Count | Open (RAW) |
|------|------:|-----------:|
| Security + Reliability (code) | {len(code_mapping)} | {code_raw} |
| Security + Reliability FIXED | {code_fixed} | — |
| Maintainability (code) | {len(code_maint)} | all RAW |
| Duplication findings | {len(dup_detail)} | all RAW |

> DevOps: {len(devops_mapping)} security/reliability findings ({devops_raw} RAW) — see `devops/DEVOPS-PLAN.md`

## Phase order

```
Phase 0: Prep (WP-00)
    ↓
Phase 1: Dependencies (WP-01, WP-02) — parallel OK
    ↓
Phase 2: Dev scripts (WP-05)
    ↓
Phase 3: sendEmail (WP-06) → WP-08; WP-07 parallel; WP-09 verify only
    ↓
Phase 4: Duplication (DUP-01 … DUP-08) — one PR each
    ↓
Phase 5: Deferred maintainability (WP-10, WP-11, WP-12)
```

## Work packages

| ID | Phase | Name | Depends on | Open findings cleared |
|----|-------|------|------------|----------------------|
"""

for w in code_work_packages:
    cleared = sum(1 for m in code_mapping if m["WorkPackageID"] == w["WorkPackageID"] and m["Status"] == "RAW")
    code_md += f"| {w['WorkPackageID']} | {w['Phase']} | {w['Name']} | {w['DependsOn'] or '—'} | {cleared or '—'} |\n"

code_md += f"""
## Open security/reliability items ({code_raw} RAW)

| WP | Severity | File | Issue |
|----|----------|------|-------|
"""

for m in sorted(
    [x for x in code_mapping if x["Status"] == "RAW"],
    key=lambda x: (0 if x["Severity"] == "CRITICAL" else 1 if x["Severity"] == "HIGH" else 2, x["File"]),
):
    code_md += f"| {m['WorkPackageID']} | {m['Severity']} | `{m['File']}` | {m['Type'][:80]} |\n"

code_md += """
## File collision map

| File | Work packages | Risk |
|------|---------------|------|
| `backend/package-lock.json` | WP-01 only | Lockfile conflicts |
| `backend/src/routes/emails/sendEmail.ts` | WP-06 only | Security + size + complexity |
| `backend/src/helpers/renderDownloadPage.ts` | WP-08 (after WP-06) | Shared HTML utils |
| `backend/scripts/verify-regio-apis.*` | WP-05 only | Delete .js after .ts fix |
| Voorbereiding wizard folders | DUP-01, DUP-02 sequential | UI merge conflicts |

## Suggested first sprint (code only)

1. **WP-01** — backend deps (multer, undici, nodemailer)
2. **WP-02** — xlsx lockfile verify
3. **WP-05** — verify-regio-apis dev script
4. **WP-07** — callback tests + remark
5. **WP-06** — sendEmail single refactor

Defer duplication (Phase 4) until code security/reliability RAW = 0.
"""

devops_md = f"""# Sigrid Remediation Plan — DevOps

Kubernetes, Docker, nginx/ingress findings — **deferred from the main code plan**.

## Finding counts

| Area | Count | Open (RAW) |
|------|------:|-----------:|
| Security + Reliability (devops) | {len(devops_mapping)} | {devops_raw} |
| FIXED (verify only) | {devops_fixed} | — |
| Maintainability (dockerfile) | {len(devops_maint)} | — |

## Work packages

| ID | Phase | Name | Open RAW |
|----|-------|------|----------|
"""

for w in devops_work_packages:
    cleared = sum(1 for m in devops_mapping if m["WorkPackageID"] == w["WorkPackageID"] and m["Status"] == "RAW")
    devops_md += f"| {w['WorkPackageID']} | {w['Phase']} | {w['Name']} | {cleared or '—'} |\n"

devops_md += f"""
## Open items ({devops_raw} RAW)

| DO | Severity | File | Issue |
|----|----------|------|-------|
"""

for m in sorted(
    [x for x in devops_mapping if x["Status"] == "RAW"],
    key=lambda x: (0 if x["Severity"] == "CRITICAL" else 1 if x["Severity"] == "HIGH" else 2, x["File"]),
):
    devops_md += f"| {m['WorkPackageID']} | {m['Severity']} | `{m['File']}` | {m['Type'][:80]} |\n"

devops_md += """
## Scope

- `dockerfile` — frontend nginx image
- `backend/dockerfile` — backend Node image
- `k8s/lis-backend-dep.yaml`, `k8s/lis-frontend-dep.yaml`
- `k8s/Lis_ingressFront.yaml`

## Suggested order (when you pick up DevOps)

1. **DO-01** — Docker USER directives (2 open HIGH)
2. **DO-02** — Verify K8s FIXED findings (no rework unless regression)

## Files

| File | Purpose |
|------|---------|
| `devops-MASTER-action-items.csv` | Open DevOps action items |
| `devops-00-work-packages.csv` | Work package definitions |
| `devops-01-security-reliability-mapping.csv` | All DevOps security/reliability findings |
"""

with open(os.path.join(PLAN, "REMEDIATION-PLAN.md"), "w", encoding="utf-8") as f:
    f.write(code_md)

with open(os.path.join(DEVOPS, "DEVOPS-PLAN.md"), "w", encoding="utf-8") as f:
    f.write(devops_md)

plan_readme = """# Sigrid remediation plan — Code focus

## Start here

1. **[REMEDIATION-PLAN.md](./REMEDIATION-PLAN.md)** — application code plan
2. **`plan-MASTER-action-items.csv`** — open code Security/Reliability items (Excel)
3. **[devops/](./devops/)** — K8s, Docker, nginx (deferred)

## Layout

| Path | Contents |
|------|----------|
| `plan-*.csv` | Code findings only |
| `devops/` | Infrastructure / DevOps findings |

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
```
"""

devops_readme = """# DevOps findings (deferred)

Kubernetes, Docker, and ingress/nginx items separated from the main code plan.

- **[DEVOPS-PLAN.md](./DEVOPS-PLAN.md)**
- **`devops-MASTER-action-items.csv`** — 2 open Docker findings
"""

with open(os.path.join(PLAN, "README.md"), "w", encoding="utf-8") as f:
    f.write(plan_readme)

with open(os.path.join(DEVOPS, "README.md"), "w", encoding="utf-8") as f:
    f.write(devops_readme)

parent_readme = """# Sigrid findings — Otg-lis

## Layout

| Location | Contents |
|----------|----------|
| **`plan/`** | **Code remediation plan** — [start here](./plan/README.md) |
| `plan/devops/` | K8s, Docker, nginx (deferred) |
| `* findings.csv` | Raw Sigrid exports |

## Quick start (code)

Open **[plan/REMEDIATION-PLAN.md](./plan/REMEDIATION-PLAN.md)** or **`plan/plan-MASTER-action-items.csv`**.

DevOps items: **[plan/devops/DEVOPS-PLAN.md](./plan/devops/DEVOPS-PLAN.md)**

```bash
python sigrid-findings/plan/generate-plan.py
```
"""

with open(os.path.join(FINDINGS, "README.md"), "w", encoding="utf-8") as f:
    f.write(parent_readme)

print("Generated code plan in", PLAN)
print(f"  Code Security+Reliability: {len(code_mapping)} ({code_raw} RAW)")
print(f"  Code maintainability: {len(code_maint)}")
print(f"  Code master action items: {len(code_master)}")
print("Generated devops plan in", DEVOPS)
print(f"  DevOps Security+Reliability: {len(devops_mapping)} ({devops_raw} RAW)")
print(f"  DevOps master action items: {len(build_master(devops_mapping, devops_work_packages))}")
