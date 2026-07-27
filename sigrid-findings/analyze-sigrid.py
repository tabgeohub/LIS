import csv
import os
from collections import defaultdict, Counter

NEW_DIR = r"C:\Users\abeda\OneDrive\Documents\TabGeoHub-GitHub\LIS\sigrid-findings\sigrid-227"
OLD_DIR = r"C:\Users\abeda\OneDrive\Documents\TabGeoHub-GitHub\LIS\sigrid-findings\all-findings-rijkswaterstaat-otg-lis-20260721(1)"

ACCEPT_FILES = {
    "src/hooks/useLogAction.ts",
    "src/hooks/useContent.ts",
    "src/hooks/consts/useConstSelectOptions.ts",
    "src/hooks/useGetFlightTimesDistance.ts",
    "src/hooks/flightPlan/useFlightPlanStandardSelectProps.ts",
    "src/helpers/refreshToken.ts",
    "src/api-hooks/templateFlights/useTemplateFlights.ts",
    "src/api-hooks/points/usePointLookupQueries.ts",
    "src/api-hooks/flightPlans/useFlightPlanLookupQueries.ts",
    "src/api-hooks/finishedPlans/usePlanPointAttachments.ts",
    "src/api-hooks/consts/useLookupQuery.ts",
    "src/api-hooks/emails/useEmailsList.ts",
    "src/Components/HomePage/Body/MapViewComp/hover/showPlanSearchListHover.ts",
    "src/Components/HomePage/Body/MapViewComp/hover/hoverFlightPlanFromOriginalMap.ts",
    "src/Components/HomePage/Body/MapViewComp/hover/clearHoveredFlightPlanFromOriginalMap.ts",
    "src/Components/HomePage/Body/MapViewComp/hover/resolveOriginalPlanGraphic.ts",
    "src/helpers/ArcGISHelpers/validateMapView.ts",
    "src/Components/HomePage/Body/Left/Voorbereiding/EditGeometry/coords.ts",
    "src/hooks/useWizardButtons.ts",
    "src/hooks/useResetFeatures.ts",
    "src/Components/HomePage/Body/Left/Common/KaartLegend/LayersList/NNederland/nnederlandLayerBuilders.ts",
    "src/api-hooks/mutations/useUpdateDataCore.ts",
    "backend/src/helpers/routeResponses.ts",
    "backend/dockerfile",
    "backend/scripts/verify-regio-apis.ts",
}

ACCEPT_DUP_PATTERNS = [
    "keycloakUser",
    "devices.ts",
    "installer",
    "pointCoreColumns",
    "pickFlightPlanPersistenceFields",
    "flightPlanFieldNormalize",
    "createGeometryInsert",
    "index.html",
]

ACCEPT_ENTANGLEMENT = {
    "High communication density on src/api-hooks",
    "Moderate communication density on src/hooks",
    "Moderate communication density on src/helpers",
    "Moderate communication density on src/Components/HomePage",
}


def load_csv(path):
    if not os.path.exists(path) or os.path.getsize(path) < 5:
        return []
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def norm_path(row):
    return (row.get("File") or row.get("Path") or "").replace("\\", "/")


def is_accept(row, category):
    f = norm_path(row)
    desc = row.get("Description", "")
    loc = row.get("Locations", "")

    if category == "Component independence findings":
        if f in ACCEPT_FILES:
            return True
        if "Interface module" in desc and row.get("Severity") == "MEDIUM":
            return True  # Core façade bodies per ACCEPT-LIST
        if "Core" in f or "Internal" in f:
            return True

    if category == "Module coupling findings":
        base = os.path.basename(f)
        if any(x in f for x in ["useLogAction", "useContent", "validateMapView", "coords.ts",
                                 "useWizardButtons", "useConstSelectOptions", "useResetFeatures",
                                 "nnederlandLayerBuilders", "useUpdateDataCore", "routeResponses"]):
            return True

    if category == "Component entanglement findings":
        if desc in ACCEPT_ENTANGLEMENT:
            return True

    if category == "Unit size findings":
        if f in ("backend/dockerfile", "backend/scripts/verify-regio-apis.ts"):
            return True

    if category == "Duplication findings":
        blob = f"{f} {loc} {desc}"
        if any(p in blob for p in ACCEPT_DUP_PATTERNS):
            return True

    if category == "Security findings":
        if "CWE-266" in desc or "dockerfile" in f.lower():
            return True

    return False


def analyze_folder(folder):
    results = {}
    for fname in sorted(os.listdir(folder)):
        if not fname.endswith(".csv"):
            continue
        rows = load_csv(os.path.join(folder, fname))
        cat = fname.replace(".csv", "")
        by_sev_status = defaultdict(lambda: defaultdict(int))
        by_status = Counter()
        by_sev = Counter()
        for r in rows:
            sev = r.get("Severity", "?")
            status = r.get("Status", "?")
            by_sev_status[sev][status] += 1
            by_status[status] += 1
            by_sev[sev] += 1
        results[cat] = {
            "total": len(rows),
            "by_sev_status": {k: dict(v) for k, v in by_sev_status.items()},
            "by_status": dict(by_status),
            "by_sev": dict(by_sev),
            "rows": rows,
        }
    return results


def raw_actionable(rows, category):
    out = []
    for r in rows:
        if r.get("Status") != "RAW":
            continue
        if is_accept(r, category):
            continue
        out.append(r)
    return out


def print_section(title, data):
    print(f"\n{'='*60}")
    print(title)
    print(f"Total: {data['total']}")
    print("By severity x status:")
    for sev in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]:
        if sev in data["by_sev_status"]:
            print(f"  {sev}: {data['by_sev_status'][sev]}")
    other = set(data["by_sev_status"]) - {"CRITICAL", "HIGH", "MEDIUM", "LOW"}
    for sev in sorted(other):
        print(f"  {sev}: {data['by_sev_status'][sev]}")
    print(f"Status totals: {data['by_status']}")


def top_items(rows, category, n=15):
    actionable = raw_actionable(rows, category)
    scored = []
    sev_rank = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    for r in actionable:
        f = norm_path(r)
        sev = r.get("Severity", "LOW")
        scored.append((sev_rank.get(sev, 9), sev, f, r.get("Description", "")[:100]))
    scored.sort()
    return actionable, scored[:n]


new = analyze_folder(NEW_DIR)
old = analyze_folder(OLD_DIR)

# Map categories to dashboard pillars
PILLARS = {
    "Security findings": "Security (4.7)",
    "Reliability findings": "Reliability (5.5)",
    "Component independence findings": "Architecture (3.3)",
    "Module coupling findings": "Architecture (3.3)",
    "Component entanglement findings": "Architecture (3.3)",
    "Unit complexity findings": "Maintainability (4.3)",
    "Unit size findings": "Maintainability (4.3)",
    "Unit interfacing findings": "Maintainability (4.3)",
    "Duplication findings": "Maintainability (4.3)",
    "AI Generated findings": "Maintainability (4.3)",
    "Duplicates": "Maintainability (4.3) - detail",
}

print("SIGRID 227 ANALYSIS")
print("=" * 60)

for cat in sorted(new.keys()):
    pillar = PILLARS.get(cat, cat)
    print_section(f"{cat} [{pillar}]", new[cat])
    actionable, top = top_items(new[cat]["rows"], cat)
    print(f"RAW actionable (excl Accept): {len(actionable)}")
    if top:
        print("Top actionable:")
        for _, sev, f, desc in top:
            print(f"  [{sev}] {f or '(no file)'} — {desc}")

print("\n\n" + "=" * 60)
print("OLD (20260721(1)) vs NEW (sigrid-227) COMPARISON")
print("=" * 60)

all_cats = sorted(set(list(new.keys()) + list(old.keys())))
for cat in all_cats:
    n = new.get(cat, {}).get("total", 0)
    o = old.get(cat, {}).get("total", 0)
    n_raw = new.get(cat, {}).get("by_status", {}).get("RAW", 0)
    o_raw = old.get(cat, {}).get("by_status", {}).get("RAW", 0)
    n_fixed = new.get(cat, {}).get("by_status", {}).get("FIXED", 0)
    o_fixed = old.get(cat, {}).get("by_status", {}).get("FIXED", 0)
    n_act = len(raw_actionable(new.get(cat, {}).get("rows", []), cat)) if cat in new else 0
    o_act = len(raw_actionable(old.get(cat, {}).get("rows", []), cat)) if cat in old else 0
    print(f"\n{cat}:")
    print(f"  total: {o} -> {n} ({n-o:+d})")
    print(f"  RAW: {o_raw} -> {n_raw} ({n_raw-o_raw:+d})")
    print(f"  FIXED: {o_fixed} -> {n_fixed} ({n_fixed-o_fixed:+d})")
    print(f"  actionable RAW: {o_act} -> {n_act} ({n_act-o_act:+d})")

# New finding types in descriptions
print("\n\n" + "=" * 60)
print("NEW FINDING TYPES (descriptions in new not in old)")
print("=" * 60)
for cat in all_cats:
    if cat not in new or cat not in old:
        continue
    old_descs = {r.get("Description", "") for r in old[cat]["rows"]}
    new_only = []
    for r in new[cat]["rows"]:
        d = r.get("Description", "")
        if d and d not in old_descs:
            new_only.append((r.get("Severity"), r.get("Status"), norm_path(r), d[:120]))
    if new_only:
        print(f"\n{cat}: {len(new_only)} new descriptions")
        for item in new_only[:20]:
            print(f"  {item}")

# Gone finding types
print("\n\n" + "=" * 60)
print("RESOLVED / GONE (in old RAW, now FIXED or absent)")
print("=" * 60)
for cat in all_cats:
    if cat not in new or cat not in old:
        continue
    new_by_key = {}
    for r in new[cat]["rows"]:
        key = (r.get("Description"), norm_path(r))
        new_by_key[key] = r.get("Status")
    gone = []
    fixed_now = []
    for r in old[cat]["rows"]:
        if r.get("Status") != "RAW":
            continue
        key = (r.get("Description"), norm_path(r))
        if key not in new_by_key:
            gone.append(key)
        elif new_by_key[key] == "FIXED":
            fixed_now.append(key)
    if gone or fixed_now:
        print(f"\n{cat}: {len(fixed_now)} RAW->FIXED, {len(gone)} absent")
        for k in fixed_now[:10]:
            print(f"  FIXED: {k[1]}")
        for k in gone[:10]:
            print(f"  GONE: {k[1]}")

# Architecture accept pass inventory
print("\n\n" + "=" * 60)
print("ARCHITECTURE ACCEPT PASS INVENTORY (RAW items to Accept)")
print("=" * 60)
for cat in ["Component independence findings", "Module coupling findings", "Component entanglement findings"]:
    if cat not in new:
        continue
    accept_raw = [r for r in new[cat]["rows"] if r.get("Status") == "RAW" and is_accept(r, cat)]
    print(f"\n{cat}: {len(accept_raw)} to Accept")
    for r in accept_raw:
        print(f"  [{r.get('Severity')}] {norm_path(r) or r.get('Description','')[:80]}")

# Aggregate actionable by pillar
print("\n\n" + "=" * 60)
print("ACTIONABLE RAW BY PILLAR (post-Accept)")
print("=" * 60)
pillar_counts = defaultdict(lambda: {"RAW": 0, "actionable": 0, "by_sev": Counter()})
for cat, pillar in PILLARS.items():
    if cat not in new or cat == "Duplicates":
        continue
    p = pillar.split("(")[0].strip()
    for r in new[cat]["rows"]:
        if r.get("Status") != "RAW":
            continue
        pillar_counts[p]["RAW"] += 1
        if not is_accept(r, cat):
            pillar_counts[p]["actionable"] += 1
            pillar_counts[p]["by_sev"][r.get("Severity", "?")] += 1

for p, d in sorted(pillar_counts.items()):
    print(f"{p}: RAW={d['RAW']}, actionable={d['actionable']}, sev={dict(d['by_sev'])}")
