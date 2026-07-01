"""Compare Sigrid export 3 vs export 4 to see what actually changed."""
import csv
import os
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
E3 = os.path.join(BASE, "exported-findings-3")
E4 = os.path.join(BASE, "exported-findings-4")

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


def load(folder, name):
    path = os.path.join(folder, name)
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def norm_file(p):
    return (p or "").split("#")[0].replace("\\", "/")


def raw(rows):
    return [r for r in rows if r.get("Status") == "RAW"]


def finding_key(r):
    return (
        norm_file(r.get("File", "")),
        r.get("Unit", ""),
        (r.get("Description", "") or "")[:60],
    )


print("=" * 70)
print(f"{'Category':<28}{'E3 RAW':>8}{'E4 RAW':>8}{'Delta':>8}")
print("=" * 70)
total3 = total4 = 0
for cat in CATS:
    r3 = raw(load(E3, cat))
    r4 = raw(load(E4, cat))
    total3 += len(r3)
    total4 += len(r4)
    delta = len(r4) - len(r3)
    mark = "" if delta == 0 else ("  <-- UP" if delta > 0 else "  <-- DOWN")
    print(f"{cat.replace(' findings.csv',''):<28}{len(r3):>8}{len(r4):>8}{delta:>+8}{mark}")
print("=" * 70)
print(f"{'TOTAL':<28}{total3:>8}{total4:>8}{total4-total3:>+8}")

# Maintainability-only subtotal
MAINT = CATS[:6]
m3 = sum(len(raw(load(E3, c))) for c in MAINT)
m4 = sum(len(raw(load(E4, c))) for c in MAINT)
print(f"{'MAINT+ARCH subtotal':<28}{m3:>8}{m4:>8}{m4-m3:>+8}")

# Per-file changes for the files we refactored
print("\n" + "=" * 70)
print("FILES WE REFACTORED — finding counts E3 -> E4")
print("=" * 70)
targets = [
    "createFinishedPlan.ts",
    "createFinishedPlanDb.ts",
    "createPointFromImport.ts",
    "createPointFromImportDb.ts",
    "importPointRowNormalization.ts",
    "arcgis.ts",
    "arcgisTokenConfig.ts",
    "meHandler.ts",
    "buildMeResponse.ts",
    "pointFields.ts",
    "normalizePointCoreFields.ts",
    "pointCoreColumns.ts",
    "pointSqlBuilders.ts",
]

def count_for(folder, needle):
    n = 0
    for cat in MAINT:
        for r in raw(load(folder, cat)):
            if needle in norm_file(r.get("File", "")):
                n += 1
    return n

for t in targets:
    c3 = count_for(E3, t)
    c4 = count_for(E4, t)
    flag = "" if c3 == c4 else "   *"
    print(f"  {t:<34}{c3:>4} -> {c4:<4}{flag}")

# New RAW findings appearing in E4 (regressions / new files)
print("\n" + "=" * 70)
print("NEW maintainability RAW in E4 (not in E3) — top files")
print("=" * 70)
new_counter = Counter()
fixed_counter = Counter()
for cat in MAINT:
    s3 = {finding_key(r) for r in raw(load(E3, cat))}
    s4 = {finding_key(r) for r in raw(load(E4, cat))}
    for k in s4 - s3:
        new_counter[k[0]] += 1
    for k in s3 - s4:
        fixed_counter[k[0]] += 1

print("\n-- NEW (added in E4):")
for f, n in new_counter.most_common(15):
    print(f"  +{n:<3} {f}")
print(f"  total new: {sum(new_counter.values())}")

print("\n-- FIXED (gone in E4):")
for f, n in fixed_counter.most_common(15):
    print(f"  -{n:<3} {f}")
print(f"  total fixed: {sum(fixed_counter.values())}")
