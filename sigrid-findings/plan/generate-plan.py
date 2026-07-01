"""Generate grouped Sigrid remediation plan CSVs and markdown (code + devops split)."""
import csv
import os
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FINDINGS = os.path.join(ROOT, "sigrid-findings")
# Latest Sigrid export folder (override with SIGRID_EXPORT_DIR env var)
EXPORT_DIR = os.environ.get(
    "SIGRID_EXPORT_DIR",
    os.path.join(FINDINGS, "exported-findings-4"),
)
PLAN = os.path.join(FINDINGS, "plan")
DEVOPS = os.path.join(PLAN, "devops")
MAINT_ARCH = os.path.join(PLAN, "Maintainability-Architecture")

EXPORT_CSV_NAMES = [
    "Security findings.csv",
    "Reliability findings.csv",
    "Unit size findings.csv",
    "Unit complexity findings.csv",
    "Unit interfacing findings.csv",
    "Module coupling findings.csv",
    "Component independence findings.csv",
    "Component entanglement findings.csv",
    "Duplication findings.csv",
    "Duplicates.csv",
    "AI Generated findings.csv",
]

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
    path = os.path.join(EXPORT_DIR, name)
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

# Work packages cleared for security/reliability (duplication may still have residual findings)
COMPLETED_CODE_WPS = frozenset(
    {"WP-01", "WP-02", "WP-05", "WP-06", "WP-08", "WP-09"}
)
PARTIAL_CODE_WPS = frozenset({"DUP-02", "DUP-04", "DUP-05", "DUP-06", "DUP-07", "DUP-08"})


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

maint_arch_work_packages: list[dict] = []

maint_arch_clusters = [
    (
        "MAINT-01",
        "5 - Maintainability",
        "Backend routes and services",
        "backend/ routes, services, query helpers (createFinishedPlan cplx 72, devices-updates/db, arcgis.ts)",
        "One route or service cluster per PR; extract validators and query builders.",
        "API contract regressions",
        "DUP phase stable",
        "Backend build + route tests",
    ),
    (
        "MAINT-02",
        "5 - Maintainability",
        "Nabewerking flows",
        "EditPointCoordinates, generatePdfReport, Waarnemingen steps",
        "Split large components; extract PDF/coords helpers; one screen per PR.",
        "PDF layout and coordinate edit regressions",
        "DUP-08 partial",
        "Nabewerking smoke test",
    ),
    (
        "MAINT-03",
        "5 - Maintainability",
        "Voorbereiding wizards",
        "SelectFromSource, ImportVluchtPlan, AddToPlan, DrawingTool (overlaps DUP-01/02/07)",
        "Finish duplication first; then split remaining oversized units.",
        "Wizard UI regressions",
        "DUP-01",
        "Voorbereiding wizard smoke",
    ),
    (
        "MAINT-04",
        "5 - Maintainability",
        "Map shell UI",
        "nnederlandLayers (385 LOC), MapComp (cplx 37), Head/constants.ts",
        "Extract layer config tables and map init steps; dedicated map QA pass.",
        "Map rendering and legend regressions",
        "MAINT-05",
        "Map manual QA",
    ),
    (
        "MAINT-05",
        "5 - Maintainability",
        "ArcGIS helpers",
        "src/helpers/ArcGISHelpers/, src/helpers/arcgis/",
        "Split graphic builders and geometry utilities; keep pure functions testable.",
        "Visual map graphic regressions",
        "MAINT-04",
        "Map smoke + unit tests on pure helpers",
    ),
    (
        "MAINT-06",
        "5 - Maintainability",
        "Admin standalone pages",
        "DevicesUpdatesPage, InstallationsPage",
        "Extract subcomponents and data hooks per page.",
        "Low",
        "Independent",
        "Page-level smoke",
    ),
    (
        "MAINT-07",
        "5 - Maintainability",
        "Timeslider feature",
        "TimesliderItemDetailPage, useTimesliderImagePageData, timeslider helpers",
        "Reduce component complexity; extract data hooks.",
        "Timeslider navigation regressions",
        "Independent",
        "Timeslider page smoke",
    ),
    (
        "MAINT-08",
        "5 - Maintainability",
        "Frontend catch-all",
        "Tools, Bottom lists, Common UI, hooks (non god), api-hooks, utils — slice per sub-area",
        "One sub-area per PR: Tools, Bottom, hooks, Common (see MAINT-ARCH-PLAN.md).",
        "Wide but localized if sliced",
        "DUP-08 for Bottom lists",
        "Targeted smoke per slice",
    ),
    (
        "ARCH-01",
        "6 - Architecture",
        "High fan-in hooks",
        "useContent.ts (fan-in 142), useLogAction.ts (fan-in 116)",
        "Only with dedicated initiative; split logging vs content if needed.",
        "Very wide blast radius",
        "MAINT-03 stable",
        "Full regression pass",
    ),
    (
        "ARCH-02",
        "6 - Architecture",
        "Module coupling",
        "fetchApi, classNames, routeResponses, shared utils with high fan-in",
        "Accept some fan-in on true infrastructure; avoid fake splits.",
        "Import churn",
        "Independent",
        "Build only",
    ),
    (
        "ARCH-03",
        "6 - Architecture",
        "Component independence",
        "Hook and api-hook interface modules (hover-click-handlers, features, api-hooks)",
        "Introduce feature-scoped hooks; thin wrappers over time.",
        "Temporary architecture score dip when adding modules",
        "Related MAINT slice",
        "Incremental",
    ),
    (
        "ARCH-04",
        "6 - Architecture",
        "Component entanglement",
        "HomePage ↔ hooks density; Timeslider transitive deps",
        "Long-term boundary work; not a single PR.",
        "Structural refactor",
        "ARCH-03",
        "Re-scan after major boundaries",
    ),
]

for cluster in maint_arch_clusters:
    wp(maint_arch_work_packages, *cluster)

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


def assign_maint_arch_wp(file: str, cat: str) -> str:
    """Map maintainability/architecture finding to MAINT-* or ARCH-* work package."""
    f = norm_file(file)
    fl = f.lower()
    if "sendemail" in fl:
        return "WP-06"
    if "usefilterplans" in fl:
        return "DUP-03"
    if "pointsbuffer" in fl:
        return "DUP-04"
    if cat == "Component entanglement":
        return "ARCH-04"
    if cat == "Module coupling":
        return "ARCH-02"
    if cat == "Component independence":
        return "ARCH-03"
    if f in ("src/hooks/useContent.ts", "src/hooks/useLogAction.ts"):
        return "ARCH-01"
    if fl.startswith("backend/"):
        return "MAINT-01"
    if "nabewerking" in fl:
        return "MAINT-02"
    if "voorbereiding" in fl:
        return "MAINT-03"
    if "nnederlandlayers" in fl or "mapcomp.tsx" in fl or f.endswith("HomePage/Head/constants.ts"):
        return "MAINT-04"
    if "/arcgishelpers/" in fl or fl.startswith("src/helpers/arcgis/"):
        return "MAINT-05"
    if "devicesupdatespage" in fl or "installationspage" in fl:
        return "MAINT-06"
    if "timeslider" in fl:
        return "MAINT-07"
    return "MAINT-08"


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
            if devops_only:
                fl = f.lower()
                wp_id = "DO-03" if "dockerfile" in fl else "DO-00"
            else:
                wp_id = assign_maint_arch_wp(f, cat)
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
                    "WorkPackageID": "ARCH-04",
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
            "flightPlanFormFields",
        )
    ):
        return "DUP-07"
    if "PointsList" in locs or "sortPointsWithSelectionOrder" in locs:
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
        "Reason": "res.redirect() uses only getFixedPostLoginRedirectUrl() (config URL). User return path stored as pendingClientPath and applied client-side via /auth/me + PostLoginRedirect. safeReturnPath() rejects //, ://, backslashes.",
        "Action": "Add Sigrid remark — scanner does not trace fixed-redirect + SPA handoff",
    },
    {
        "WorkPackageID": "WP-02",
        "File": "package-lock.json",
        "Finding": "xlsx CWE-1321",
        "Reason": "Resolved in export 3 — direct @e965/xlsx@0.20.3 dependency",
        "Action": "DONE — no action",
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


def raw_count_by_wp(mapping: list[dict]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for m in mapping:
        if m["Status"] != "RAW":
            continue
        wp_id = m.get("WorkPackageID") or ""
        counts[wp_id] = counts.get(wp_id, 0) + 1
    return counts


def dup_raw_count_by_wp(dup_rows: list[dict]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for r in dup_rows:
        if r.get("Status") != "RAW":
            continue
        wp_id = r.get("WorkPackageID") or ""
        counts[wp_id] = counts.get(wp_id, 0) + 1
    return counts


def package_status(wp_id: str, sec_raw: dict[str, int], dup_raw: dict[str, int]) -> str:
    if wp_id.startswith("DUP-"):
        n = dup_raw.get(wp_id, 0)
        if n == 0:
            return "DONE"
        if wp_id in PARTIAL_CODE_WPS or n < 10:
            return "PARTIAL"
        return "OPEN"
    if sec_raw.get(wp_id, 0) > 0:
        return "OPEN"
    if wp_id in COMPLETED_CODE_WPS:
        return "DONE"
    return "OPEN"


def enrich_packages(packages: list[dict], sec_raw: dict[str, int], dup_raw: dict[str, int]) -> list[dict]:
    enriched = []
    for w in packages:
        wp_id = w["WorkPackageID"]
        status = package_status(wp_id, sec_raw, dup_raw)
        open_sec = sec_raw.get(wp_id, 0)
        open_dup = dup_raw.get(wp_id, 0)
        enriched.append(
            {
                **w,
                "Status": status,
                "OpenSecRelRAW": open_sec,
                "OpenDuplicationRAW": open_dup,
            }
        )
    return enriched


def enrich_maint_arch_packages(packages: list[dict], mapping: list[dict]) -> list[dict]:
    raw_by_wp = raw_count_by_wp(mapping)
    enriched = []
    for w in packages:
        wp_id = w["WorkPackageID"]
        open_raw = raw_by_wp.get(wp_id, 0)
        enriched.append(
            {
                **w,
                "Status": "OPEN" if open_raw > 0 else "DONE",
                "OpenMaintainabilityRAW": open_raw,
            }
        )
    return enriched


def maint_arch_high_priority(mapping: list[dict]) -> list[dict]:
    """HIGH severity RAW findings for sprint picking."""
    rows = []
    for m in mapping:
        if m.get("Status") != "RAW" or m.get("Severity") != "HIGH":
            continue
        wp_row = next((w for w in maint_arch_work_packages if w["WorkPackageID"] == m["WorkPackageID"]), {})
        rows.append(
            {
                **m,
                "WorkPackageName": wp_row.get("Name", ""),
                "Phase": wp_row.get("Phase", ""),
            }
        )
    rows.sort(
        key=lambda r: (
            -int(r.get("Complexity") or 0),
            -int(r.get("LOC") or 0),
            r.get("File", ""),
        )
    )
    return rows


def build_maint_arch_markdown(
    packages: list[dict],
    mapping: list[dict],
    high_priority: list[dict],
    export_label: str,
    today: str,
    maint_raw: int,
) -> str:
    raw_by_wp = raw_count_by_wp(mapping)
    cat_by_wp: dict[str, dict[str, int]] = {}
    for m in mapping:
        if m.get("Status") != "RAW":
            continue
        wp_id = m["WorkPackageID"]
        cat = m.get("Category", "")
        cat_by_wp.setdefault(wp_id, {})
        cat_by_wp[wp_id][cat] = cat_by_wp[wp_id].get(cat, 0) + 1

    md = f"""# Maintainability & Architecture Plan

**Source:** `{export_label}` · **Generated:** {today}

Split from the former single **DEFER** bucket ({maint_raw} RAW maintainability + architecture findings in `{export_label}`).

> **Before picking work, read [STRATEGY.md](./STRATEGY.md) and [ANALYSIS-export-3-to-4.md](./ANALYSIS-export-3-to-4.md).** Naive extract-to-helper refactors *increased* findings in export 4 — follow the Sigrid thresholds.

**Related:** duplication work (DUP-01…) clears overlapping units in Voorbereiding/Nabewerking — do duplication first where noted.

## Finding counts (code only)

| Category | RAW |
|----------|----:|
| Unit size | {sum(1 for m in mapping if m.get('Status')=='RAW' and m.get('Category')=='Unit size')} |
| Unit complexity | {sum(1 for m in mapping if m.get('Status')=='RAW' and m.get('Category')=='Unit complexity')} |
| Unit interfacing | {sum(1 for m in mapping if m.get('Status')=='RAW' and m.get('Category')=='Unit interfacing')} |
| Module coupling | {sum(1 for m in mapping if m.get('Status')=='RAW' and m.get('Category')=='Module coupling')} |
| Component independence | {sum(1 for m in mapping if m.get('Status')=='RAW' and m.get('Category')=='Component independence')} |
| Component entanglement | {sum(1 for m in mapping if m.get('Status')=='RAW' and m.get('Category')=='Component entanglement')} |
| **Total in this plan** | **{maint_raw}** |

## Recommended order

```
1. Finish DUP-01 / DUP-02 / DUP-07 / DUP-08  (overlap with MAINT-02/03/08)
2. MAINT-01  Backend heavy routes
3. MAINT-02  Nabewerking monsters
4. MAINT-03  Voorbereiding (remaining after DUP)
5. MAINT-06  Admin pages (low risk)
6. MAINT-07  Timeslider
7. MAINT-04 + MAINT-05  Map shell + ArcGIS (pair with map QA)
8. MAINT-08  Frontend catch-all — one sub-slice per PR (see below)
9. ARCH-01–04  Incremental / long-term
```

## Work packages

| ID | Phase | Name | Open RAW | Categories (RAW) |
|----|-------|------|----------:|------------------|
"""
    for w in packages:
        wp_id = w["WorkPackageID"]
        n = raw_by_wp.get(wp_id, 0)
        cats = cat_by_wp.get(wp_id, {})
        cat_str = ", ".join(f"{k} {v}" for k, v in sorted(cats.items())) if cats else "—"
        md += f"| {wp_id} | {w['Phase']} | {w['Name']} | {n} | {cat_str} |\n"

    md += """
## MAINT-08 sub-slices (one PR each)

| Slice | Area | ~RAW | Paths |
|-------|------|-----:|-------|
| MAINT-08a | Tools | ~37 | `HomePage/Body/Left/Tools/` |
| MAINT-08b | Bottom lists | ~32 | `HomePage/Body/Bottom/`, overlaps DUP-08 |
| MAINT-08c | Map interaction hooks | ~77 | `src/hooks/hover-click-handlers/`, `src/hooks/features/` |
| MAINT-08d | Common UI + misc | ~146 | `HomePage/Body/Left/Common/`, `api-hooks/`, `utils/` |

## Top HIGH-priority units (start here within each package)

| WP | Severity | LOC | Cplx | File | Unit |
|----|----------|----:|-----:|------|------|
"""
    for m in high_priority[:25]:
        md += (
            f"| {m['WorkPackageID']} | {m['Severity']} | {m.get('LOC','')} | "
            f"{m.get('Complexity','')} | `{m['File']}` | {(m.get('Unit') or '')[:50]} |\n"
        )

    md += """
## Principles

1. **One PR = one file cluster or MAINT-08 sub-slice** — not the whole package at once.
2. **Prioritize files with both size and complexity** findings (see mapping CSV).
3. **Architecture (ARCH-*)** — expect slower dashboard movement; entanglement needs boundary work.
4. **Re-export Sigrid** after each phase → `python sigrid-findings/plan/generate-plan.py`

## Files

| File | Contents |
|------|----------|
| `maint-arch-00-work-packages.csv` | MAINT-01…08 and ARCH-01…04 definitions |
| `maint-arch-01-findings-mapping.csv` | Every finding mapped to a work package |
| `maint-arch-MASTER-action-items.csv` | HIGH severity RAW — sprint shortlist |
| `../plan-02-maintainability-mapping.csv` | Same mappings (includes DUP/WP-06 overlaps) |
"""
    return md


os.makedirs(PLAN, exist_ok=True)
os.makedirs(DEVOPS, exist_ok=True)
os.makedirs(MAINT_ARCH, exist_ok=True)

code_sec_raw = raw_count_by_wp(code_mapping)
dup_raw = dup_raw_count_by_wp(dup_detail)
code_packages = enrich_packages(code_work_packages, code_sec_raw, dup_raw)

code_mapping_open = [m for m in code_mapping if m["Status"] == "RAW"]
code_mapping_cleared = [m for m in code_mapping if m["Status"] == "FIXED"]

write_csv(PLAN, "plan-00-work-packages.csv", code_packages)
write_csv(PLAN, "plan-01-security-reliability-mapping.csv", code_mapping_open)
write_csv(PLAN, "plan-01-cleared-security-reliability.csv", code_mapping_cleared)
write_csv(PLAN, "plan-02-maintainability-mapping.csv", code_maint)
write_csv(PLAN, "plan-03-duplication-mapping.csv", dup_detail)
write_csv(PLAN, "plan-04-false-positives-remarks.csv", code_remarks)
write_csv(PLAN, "plan-MASTER-action-items.csv", build_master(code_mapping, code_work_packages))

maint_arch_mapping = [
    m for m in code_maint if (m.get("WorkPackageID") or "").startswith(("MAINT-", "ARCH-"))
]
maint_arch_raw = sum(1 for m in maint_arch_mapping if m.get("Status") == "RAW")
maint_arch_packages = enrich_maint_arch_packages(maint_arch_work_packages, maint_arch_mapping)
maint_arch_master = maint_arch_high_priority(maint_arch_mapping)

write_csv(MAINT_ARCH, "maint-arch-00-work-packages.csv", maint_arch_packages)
write_csv(MAINT_ARCH, "maint-arch-01-findings-mapping.csv", maint_arch_mapping)
write_csv(MAINT_ARCH, "maint-arch-MASTER-action-items.csv", maint_arch_master)

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
maint_raw = sum(1 for r in code_maint if r.get("Status") == "RAW")
dup_raw_total = sum(1 for r in dup_detail if r.get("Status") == "RAW")
export_label = os.path.basename(EXPORT_DIR.rstrip("/\\"))
today = date.today().isoformat()

code_md = f"""# Sigrid Remediation Plan — Code only

**Source:** `{export_label}` · **Generated:** {today}

Application code, dependencies, and maintainability. **DevOps (Docker) is in [`devops/`](./devops/) — out of scope for code sprints.**

## Current state (`{export_label}`)

| Metric | Value |
|--------|------:|
| Security + Reliability (code) RAW | **{code_raw}** |
| Security + Reliability FIXED (code) | {code_fixed} |
| Maintainability RAW | {maint_raw} |
| Duplication RAW | {dup_raw_total} |

**Dashboard (export 4):** Security 4.3 · Reliability 5.5 · OSS Health 4.7 · Maintainability 2.9 · Architecture 2.2
_(export 3 → 4: Security 3.8 → 4.3; Maintainability and Architecture unchanged — see analysis below.)_

## Completed (no open code security/reliability RAW)

| ID | Name |
|----|------|
| WP-01 | Backend deps (multer, undici, nodemailer) |
| WP-02 | Frontend xlsx → `@e965/xlsx` (FIXED in Sigrid) |
| WP-05 | verify-regio-apis SQL injection |
| WP-06 | sendEmail refactor |
| WP-08 | renderDownloadPage HTML |
| WP-09 | fileDownload verify FIXED |
| DUP-03 | useFilterPlans shared |
| DUP-04 | PointsBuffer (partial — 1 dup finding left) |
| DUP-05 | PeriodFilter panel (partial) |
| DUP-06 | Dashboard user forms (partial) |

## Principles

1. **One work package = one PR** (unless explicitly noted).
2. **Re-export Sigrid CSVs** after each phase → `python sigrid-findings/plan/generate-plan.py`
3. **Do not re-edit FIXED files** unless regression (sendEmail, renderDownloadPage, xlsx).
4. **WP-07** — code fix deployed; remaining step is **Sigrid remark** (scanner false positive).

## What’s next (recommended order)

```
1. WP-07  → Sigrid remark on callbackHandler (2 MEDIUM RAW → 0)
2. DUP-01 → Wizard button clusters (largest open duplication)
3. DUP-02 → Flight plan form fields (partial — continue shared components)
4. DUP-07 → Zustand plan state (partial — view/duplicate stores done)
5. DUP-08 → PointsList variants (partial — Voorbereiding lists done)
6. **[Maintainability-Architecture/](./Maintainability-Architecture/)** — MAINT-01…08 + ARCH-01…04 (after duplication)
```

## Open security/reliability ({code_raw} RAW)

| WP | Severity | File | Issue |
|----|----------|------|-------|
"""

for m in sorted(
    [x for x in code_mapping if x["Status"] == "RAW"],
    key=lambda x: (0 if x["Severity"] == "CRITICAL" else 1 if x["Severity"] == "HIGH" else 2, x["File"]),
):
    code_md += f"| {m['WorkPackageID']} | {m['Severity']} | `{m['File']}` | {m['Type'][:80]} |\n"

if code_raw == 0:
    code_md += "| — | — | — | No open code security/reliability findings |\n"

code_md += f"""
## Work packages (status)

| ID | Status | Phase | Name | Open sec/reliability | Open duplication |
|----|--------|-------|------|---------------------:|-----------------:|
"""

for w in code_packages:
    code_md += (
        f"| {w['WorkPackageID']} | {w['Status']} | {w['Phase']} | {w['Name']} "
        f"| {w['OpenSecRelRAW'] or '—'} | {w['OpenDuplicationRAW'] or '—'} |\n"
    )

code_md += f"""
## Duplication clusters (open RAW per cluster)

| ID | Open RAW | Notes |
|----|----------:|-------|
"""

for dup_id, _, scope in dup_clusters:
    n = dup_raw.get(dup_id, 0)
    status = package_status(dup_id, {}, dup_raw)
    code_md += f"| {dup_id} | {n} | {scope[:55]} ({status}) |\n"

code_md += """
## Suggested next sprint (code only)

1. **WP-07** — Add Sigrid remark (fixed redirect + `pendingClientPath` via `/auth/me`)
2. **DUP-01** — One wizard button sub-cluster per PR
3. **DUP-02** — Extend `usePopulateFlightPlanFormEffect` to remaining Step1/Form views

## Files

| File | Contents |
|------|----------|
| `plan-MASTER-action-items.csv` | Open security/reliability actions only |
| `plan-01-security-reliability-mapping.csv` | Open (RAW) sec/reliability only |
| `plan-01-cleared-security-reliability.csv` | FIXED sec/reliability (archive) |
| `plan-03-duplication-mapping.csv` | All duplication findings |
| `plan-04-false-positives-remarks.csv` | Remark text for WP-07 |
| [`Maintainability-Architecture/`](./Maintainability-Architecture/) | MAINT + ARCH work packages ({maint_arch_raw} RAW) |
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

maint_arch_md = build_maint_arch_markdown(
    maint_arch_packages,
    maint_arch_mapping,
    maint_arch_master,
    export_label,
    today,
    maint_arch_raw,
)
with open(os.path.join(MAINT_ARCH, "MAINT-ARCH-PLAN.md"), "w", encoding="utf-8") as f:
    f.write(maint_arch_md)

maint_arch_readme = f"""# Maintainability & Architecture

**{maint_arch_raw} RAW** findings split into **MAINT-01…08** (refactor) and **ARCH-01…04** (structure).

## Read these first
1. **[ANALYSIS-export-3-to-4.md](./ANALYSIS-export-3-to-4.md)** — why export 3→4 showed no movement (and how to avoid repeating it)
2. **[STRATEGY.md](./STRATEGY.md)** — Sigrid thresholds + pattern-based plan to actually move both stars

## Work breakdown
3. **[MAINT-ARCH-PLAN.md](./MAINT-ARCH-PLAN.md)** — order, package table, MAINT-08 sub-slices
4. **`maint-arch-MASTER-action-items.csv`** — HIGH severity shortlist for sprints
5. **`maint-arch-01-findings-mapping.csv`** — full finding → work package map

> Note: `ANALYSIS-*.md` and `STRATEGY.md` are hand-maintained; the generator does not overwrite them.
> `MAINT-ARCH-PLAN.md`, `README.md`, and the CSVs are regenerated.

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
```
"""

with open(os.path.join(MAINT_ARCH, "README.md"), "w", encoding="utf-8") as f:
    f.write(maint_arch_readme)

with open(os.path.join(DEVOPS, "DEVOPS-PLAN.md"), "w", encoding="utf-8") as f:
    f.write(devops_md)

plan_readme = f"""# Sigrid remediation plan — Code focus

**Source:** `{export_label}` · Open code security RAW: **{code_raw}** (WP-07 remark only)

## Start here

1. **[REMEDIATION-PLAN.md](./REMEDIATION-PLAN.md)** — current plan (what's done + what's next)
2. **`plan-MASTER-action-items.csv`** — open code security/reliability only (2 items)
3. **`plan-01-cleared-security-reliability.csv`** — FIXED items (removed from active plan)
4. **[devops/](./devops/)** — Docker only (deferred)
5. **[Maintainability-Architecture/](./Maintainability-Architecture/)** — MAINT + ARCH ({maint_arch_raw} RAW)

## Layout

| Path | Contents |
|------|----------|
| `plan-MASTER-action-items.csv` | Open sec/reliability RAW only |
| `plan-01-security-reliability-mapping.csv` | Open sec/reliability RAW only |
| `plan-01-cleared-security-reliability.csv` | FIXED sec/reliability (archive) |
| `plan-02-maintainability-mapping.csv` | All maintainability findings (MAINT/ARCH/DUP overlaps) |
| `plan-03-duplication-mapping.csv` | Duplication findings |
| `plan-04-false-positives-remarks.csv` | Sigrid remark drafts |
| `Maintainability-Architecture/` | Split MAINT-01…08 + ARCH-01…04 plan |
| `devops/` | Infrastructure (out of code scope) |

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
```

Uses `sigrid-findings/{export_label}/` by default. Override: `SIGRID_EXPORT_DIR=path/to/export`.
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

parent_readme = f"""# Sigrid findings — Otg-lis

## Layout

| Location | Contents |
|----------|----------|
| **`{export_label}/`** | **Raw Sigrid CSV exports** (current scan) |
| **`plan/`** | **Remediation plan** — [start here](./plan/README.md) |
| `plan/Maintainability-Architecture/` | MAINT + ARCH split plan |
| `plan/devops/` | Docker/K8s (deferred) |

Raw findings live **only** inside export folders (e.g. `{export_label}/`).  
After a new Sigrid export, add a folder `exported-findings-5/` and run the generator.

## Quick start

Open **[plan/REMEDIATION-PLAN.md](./plan/REMEDIATION-PLAN.md)** or **`plan/plan-MASTER-action-items.csv`**.

```bash
python sigrid-findings/plan/generate-plan.py
```

Default source: `{export_label}/`. Override: `SIGRID_EXPORT_DIR=path/to/folder`.
"""

with open(os.path.join(FINDINGS, "README.md"), "w", encoding="utf-8") as f:
    f.write(parent_readme)

print("Generated code plan in", PLAN)
print(f"  Source: {EXPORT_DIR}")
print(f"  Code Security+Reliability: {len(code_mapping)} total, {code_raw} RAW, {code_fixed} FIXED")
print(f"  Code maintainability: {len(code_maint)} ({maint_raw} RAW)")
print(f"  Maintainability-Architecture: {len(maint_arch_mapping)} mapped ({maint_arch_raw} RAW)")
print(f"  Duplication: {len(dup_detail)} ({dup_raw_total} RAW)")
print(f"  Code master action items: {len(code_master)}")
print("Generated devops plan in", DEVOPS)
print(f"  DevOps Security+Reliability: {len(devops_mapping)} ({devops_raw} RAW)")
print(f"  DevOps master action items: {len(build_master(devops_mapping, devops_work_packages))}")
