"""Compare Sigrid export 6 vs export 7."""
import csv
import os
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
E6 = os.path.join(BASE, "exported-findings-6")
E7 = os.path.join(BASE, "exported-findings-7")

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
print(f"{'Category':<28}{'E6 RAW':>8}{'E7 RAW':>8}{'Delta':>8}")
print("=" * 72)
total6 = total7 = 0
maint6 = maint7 = 0
for cat in CATS:
    r6 = raw(load(E6, cat))
    r7 = raw(load(E7, cat))
    total6 += len(r6)
    total7 += len(r7)
    if cat in MAINT:
        maint6 += len(r6)
        maint7 += len(r7)
    delta = len(r7) - len(r6)
    mark = "" if delta == 0 else ("  UP" if delta > 0 else "  DOWN")
    print(f"{cat.replace(' findings.csv', ''):<28}{len(r6):>8}{len(r7):>8}{delta:>+8}{mark}")
print("=" * 72)
print(f"{'TOTAL':<28}{total6:>8}{total7:>8}{total7 - total6:>+8}")
print(f"{'MAINT+ARCH subtotal':<28}{maint6:>8}{maint7:>8}{maint7 - maint6:>+8}")

all6 = []
all7 = []
for cat in MAINT:
    all6.extend(raw(load(E6, cat)))
    all7.extend(raw(load(E7, cat)))
k6 = {unit_key(r) for r in all6}
k7 = {unit_key(r) for r in all7}
print(f"\nUnique maint+arch cleared: {len(k6 - k7)}")
print(f"Unique maint+arch new:     {len(k7 - k6)}")
print(f"Unchanged overlap:         {len(k6 & k7)}")

sev6 = Counter(r.get("Severity") for r in all6)
sev7 = Counter(r.get("Severity") for r in all7)
print("\nSeverity (maint+arch):")
for sev in ("HIGH", "MEDIUM", "LOW"):
    print(
        f"  {sev:<8} E6={sev6.get(sev, 0):>4}  E7={sev7.get(sev, 0):>4}  "
        f"delta={sev7.get(sev, 0) - sev6.get(sev, 0):+d}"
    )

for cat in MAINT:
    r6 = {unit_key(r): r for r in raw(load(E6, cat))}
    r7 = {unit_key(r): r for r in raw(load(E7, cat))}
    cleared = set(r6) - set(r7)
    new = set(r7) - set(r6)
    if cleared or new:
        print(
            f"\n--- {cat.replace(' findings.csv', '')}: cleared {len(cleared)}, "
            f"new {len(new)}, net {len(new) - len(cleared):+d} ---"
        )
        if cleared:
            fc = Counter(norm_file(r6[k].get("File", "")) for k in cleared)
            print("  Top cleared:")
            for f, n in fc.most_common(10):
                print(f"    -{n}  {f}")
        if new:
            fn = Counter(norm_file(r7[k].get("File", "")) for k in new)
            print("  Top new:")
            for f, n in fn.most_common(10):
                print(f"    +{n}  {f}")
