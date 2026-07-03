"""Compare Sigrid export 4 vs export 5."""
import csv
import os
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
E4 = os.path.join(BASE, "exported-findings-4")
E5 = os.path.join(BASE, "exported-findings-5")

CATS = [
    "Unit size findings.csv",
    "Unit complexity findings.csv",
    "Unit interfacing findings.csv",
    "Module coupling findings.csv",
    "Component independence findings.csv",
    "Component entanglement findings.csv",
    "Duplication findings.csv",
    "Security findings.csv",
    "Reliability findings.csv",
]

MAINT = CATS[:6]


def load(folder, name):
    path = os.path.join(folder, name)
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def raw(rows):
    return [r for r in rows if r.get("Status") == "RAW"]


def norm_file(p):
    return (p or "").split("#")[0].replace("\\", "/")


def unit_key(r):
    return (norm_file(r.get("File", "")), r.get("Unit", ""))


print("=" * 72)
print(f"{'Category':<28}{'E4 RAW':>8}{'E5 RAW':>8}{'Delta':>8}")
print("=" * 72)
total4 = total5 = 0
maint4 = maint5 = 0
for cat in CATS:
    r4 = raw(load(E4, cat))
    r5 = raw(load(E5, cat))
    total4 += len(r4)
    total5 += len(r5)
    if cat in MAINT:
        maint4 += len(r4)
        maint5 += len(r5)
    delta = len(r5) - len(r4)
    mark = "" if delta == 0 else ("  UP" if delta > 0 else "  DOWN")
    print(f"{cat.replace(' findings.csv', ''):<28}{len(r4):>8}{len(r5):>8}{delta:>+8}{mark}")
print("=" * 72)
print(f"{'TOTAL':<28}{total4:>8}{total5:>8}{total5 - total4:>+8}")
print(f"{'MAINT+ARCH subtotal':<28}{maint4:>8}{maint5:>8}{maint5 - maint4:>+8}")

for cat in MAINT:
    r4 = {unit_key(r): r for r in raw(load(E4, cat))}
    r5 = {unit_key(r): r for r in raw(load(E5, cat))}
    cleared = set(r4) - set(r5)
    new = set(r5) - set(r4)
    if cleared or new:
        print(f"\n--- {cat.replace(' findings.csv', '')}: cleared {len(cleared)}, new {len(new)}, net {len(new)-len(cleared):+d} ---")
        if cleared:
            fc = Counter(norm_file(r4[k].get("File", "")) for k in cleared)
            print("  Top cleared:")
            for f, n in fc.most_common(10):
                print(f"    -{n}  {f}")
        if new:
            fn = Counter(norm_file(r5[k].get("File", "")) for k in new)
            print("  Top new:")
            for f, n in fn.most_common(10):
                print(f"    +{n}  {f}")

print("\n" + "=" * 72)
print("TOUCHED FILES (A1 refactor targets) — interfacing E4 -> E5")
print("=" * 72)
targets = [
    "routeResponses",
    "runReturningUpdate",
    "regioFilter",
    "resolveRegioFilter",
    "fetchConstLookup",
    "fetchFlightPlanList",
    "commandGuard",
    "finishedPlan",
    "geometryRouteHelpers",
    "createFinishedPlanDb",
    "createPointFromImportDb",
    "fileDownloadHelpers",
    "oidc.ts",
    "keycloakAdminClient",
    "buildReusePlanPointIds",
    "buildUpdatedPlanFromForm",
    "verify-regio-apis",
]
r4i = raw(load(E4, "Unit interfacing findings.csv"))
r5i = raw(load(E5, "Unit interfacing findings.csv"))
for t in targets:
    c4 = sum(1 for r in r4i if t in norm_file(r.get("File", "")))
    c5 = sum(1 for r in r5i if t in norm_file(r.get("File", "")))
    if c4 or c5:
        print(f"  {t:<32} {c4:>3} -> {c5:>3}  ({c5-c4:+d})")

print("\n" + "=" * 72)
print("SECURITY RAW")
print("=" * 72)
for label, folder in (("E4", E4), ("E5", E5)):
    for r in raw(load(folder, "Security findings.csv")):
        print(f"  [{label}] {norm_file(r.get('File',''))} | {(r.get('Description') or '')[:80]}")
