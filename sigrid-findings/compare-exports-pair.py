"""Compare two Sigrid export folders (default: exported-findings-7 vs exported-findings-8).

Usage:
  python sigrid-findings/compare-exports-pair.py
  python sigrid-findings/compare-exports-pair.py exported-findings-7 exported-findings-8
  SIGRID_PREV=exported-findings-7 SIGRID_NEXT=exported-findings-8 python sigrid-findings/compare-exports-pair.py
"""
import csv
import os
import sys
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))

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


def resolve_folders():
    if len(sys.argv) >= 3:
        prev_name, next_name = sys.argv[1], sys.argv[2]
    else:
        prev_name = os.environ.get("SIGRID_PREV", "exported-findings-7")
        next_name = os.environ.get("SIGRID_NEXT", "exported-findings-8")
    prev = prev_name if os.path.isabs(prev_name) else os.path.join(BASE, prev_name)
    nxt = next_name if os.path.isabs(next_name) else os.path.join(BASE, next_name)
    return prev, nxt, os.path.basename(prev.rstrip("/\\")), os.path.basename(nxt.rstrip("/\\"))


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


def main():
    prev, nxt, prev_label, next_label = resolve_folders()
    if not os.path.isdir(prev):
        raise SystemExit(f"Previous export not found: {prev}")
    if not os.path.isdir(nxt):
        raise SystemExit(
            f"Next export not found: {nxt}\n"
            f"Add `{next_label}/` after the next Sigrid scan, then re-run."
        )

    print("=" * 72)
    print(f"{'Category':<28}{prev_label + ' RAW':>12}{next_label + ' RAW':>12}{'Delta':>8}")
    print("=" * 72)
    total_prev = total_next = 0
    maint_prev = maint_next = 0
    for cat in CATS:
        r_prev = raw(load(prev, cat))
        r_next = raw(load(nxt, cat))
        total_prev += len(r_prev)
        total_next += len(r_next)
        if cat in MAINT:
            maint_prev += len(r_prev)
            maint_next += len(r_next)
        delta = len(r_next) - len(r_prev)
        mark = "" if delta == 0 else ("  UP" if delta > 0 else "  DOWN")
        print(
            f"{cat.replace(' findings.csv', ''):<28}"
            f"{len(r_prev):>12}{len(r_next):>12}{delta:>+8}{mark}"
        )
    print("=" * 72)
    print(f"{'TOTAL':<28}{total_prev:>12}{total_next:>12}{total_next - total_prev:>+8}")
    print(
        f"{'MAINT+ARCH subtotal':<28}"
        f"{maint_prev:>12}{maint_next:>12}{maint_next - maint_prev:>+8}"
    )

    all_prev = []
    all_next = []
    for cat in MAINT:
        all_prev.extend(raw(load(prev, cat)))
        all_next.extend(raw(load(nxt, cat)))
    k_prev = {unit_key(r) for r in all_prev}
    k_next = {unit_key(r) for r in all_next}
    print(f"\nUnique maint+arch cleared: {len(k_prev - k_next)}")
    print(f"Unique maint+arch new:     {len(k_next - k_prev)}")
    print(f"Unchanged overlap:         {len(k_prev & k_next)}")

    sev_prev = Counter(r.get("Severity") for r in all_prev)
    sev_next = Counter(r.get("Severity") for r in all_next)
    print("\nSeverity (maint+arch):")
    for sev in ("HIGH", "MEDIUM", "LOW"):
        print(
            f"  {sev:<8} {prev_label}={sev_prev.get(sev, 0):>4}  "
            f"{next_label}={sev_next.get(sev, 0):>4}  "
            f"delta={sev_next.get(sev, 0) - sev_prev.get(sev, 0):+d}"
        )

    for cat in MAINT:
        r_prev = {unit_key(r): r for r in raw(load(prev, cat))}
        r_next = {unit_key(r): r for r in raw(load(nxt, cat))}
        cleared = set(r_prev) - set(r_next)
        new = set(r_next) - set(r_prev)
        if cleared or new:
            print(
                f"\n--- {cat.replace(' findings.csv', '')}: cleared {len(cleared)}, "
                f"new {len(new)}, net {len(new) - len(cleared):+d} ---"
            )
            if cleared:
                fc = Counter(norm_file(r_prev[k].get("File", "")) for k in cleared)
                print("  Top cleared:")
                for f, n in fc.most_common(10):
                    print(f"    -{n}  {f}")
            if new:
                fn = Counter(norm_file(r_next[k].get("File", "")) for k in new)
                print("  Top new:")
                for f, n in fn.most_common(10):
                    print(f"    +{n}  {f}")


if __name__ == "__main__":
    main()
