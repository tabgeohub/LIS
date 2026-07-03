"""Compare Sigrid export 5 vs export 6."""
import csv
import os
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
E5 = os.path.join(BASE, "exported-findings-5")
E6 = os.path.join(BASE, "exported-findings-6")

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
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def raw(rows):
    return [r for r in rows if r.get("Status") == "RAW"]


def norm_file(p):
    return (p or "").split("#")[0].replace("\\", "/")


def unit_key(r):
    return (norm_file(r.get("File", "")), r.get("Unit", ""), (r.get("Description") or "")[:80])


print("=" * 72)
print(f"{'Category':<28}{'E5 RAW':>8}{'E6 RAW':>8}{'Delta':>8}")
print("=" * 72)
total5 = total6 = 0
maint5 = maint6 = 0
for cat in CATS:
    r5 = raw(load(E5, cat))
    r6 = raw(load(E6, cat))
    total5 += len(r5)
    total6 += len(r6)
    if cat in MAINT:
        maint5 += len(r5)
        maint6 += len(r6)
    delta = len(r6) - len(r5)
    mark = "" if delta == 0 else ("  UP" if delta > 0 else "  DOWN")
    print(f"{cat.replace(' findings.csv', ''):<28}{len(r5):>8}{len(r6):>8}{delta:>+8}{mark}")
print("=" * 72)
print(f"{'TOTAL':<28}{total5:>8}{total6:>8}{total6 - total5:>+8}")
print(f"{'MAINT+ARCH subtotal':<28}{maint5:>8}{maint6:>8}{maint6 - maint5:>+8}")

all5 = []
all6 = []
for cat in MAINT:
    all5.extend(raw(load(E5, cat)))
    all6.extend(raw(load(E6, cat)))
k5 = {unit_key(r) for r in all5}
k6 = {unit_key(r) for r in all6}
print(f"\nUnique maint+arch cleared: {len(k5 - k6)}")
print(f"Unique maint+arch new:     {len(k6 - k5)}")
print(f"Unchanged overlap:         {len(k5 & k6)}")

sev5 = Counter(r.get("Severity") for r in all5)
sev6 = Counter(r.get("Severity") for r in all6)
print("\nSeverity (maint+arch):")
for sev in ("HIGH", "MEDIUM", "LOW"):
    print(f"  {sev:<8} E5={sev5.get(sev, 0):>4}  E6={sev6.get(sev, 0):>4}  delta={sev6.get(sev, 0) - sev5.get(sev, 0):+d}")

for cat in MAINT:
    r5 = {unit_key(r): r for r in raw(load(E5, cat))}
    r6 = {unit_key(r): r for r in raw(load(E6, cat))}
    cleared = set(r5) - set(r6)
    new = set(r6) - set(r5)
    if cleared or new:
        print(
            f"\n--- {cat.replace(' findings.csv', '')}: cleared {len(cleared)}, "
            f"new {len(new)}, net {len(new) - len(cleared):+d} ---"
        )
        if cleared:
            fc = Counter(norm_file(r5[k].get("File", "")) for k in cleared)
            print("  Top cleared:")
            for f, n in fc.most_common(8):
                print(f"    -{n}  {f}")
        if new:
            fn = Counter(norm_file(r6[k].get("File", "")) for k in new)
            print("  Top new:")
            for f, n in fn.most_common(8):
                print(f"    +{n}  {f}")
