"""Compare two Sigrid export folders.

Usage:
  python sigrid-findings/compare-exports-pair.py "sigrid findings" exported-findings-8
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
        prev_name = os.environ.get("SIGRID_PREV", "sigrid findings")
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


def norm_file(path):
    return (path or "").split("#")[0].replace("\\", "/")


def unit_key(row):
    return (
        norm_file(row.get("File", "")),
        row.get("Unit", ""),
        (row.get("Description") or "")[:80],
    )


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
    for category in CATS:
        rows_prev = raw(load(prev, category))
        rows_next = raw(load(nxt, category))
        total_prev += len(rows_prev)
        total_next += len(rows_next)
        if category in MAINT:
            maint_prev += len(rows_prev)
            maint_next += len(rows_next)
        delta = len(rows_next) - len(rows_prev)
        mark = "" if delta == 0 else ("  UP" if delta > 0 else "  DOWN")
        print(
            f"{category.replace(' findings.csv', ''):<28}"
            f"{len(rows_prev):>12}{len(rows_next):>12}{delta:>+8}{mark}"
        )
    print("=" * 72)
    print(f"{'TOTAL':<28}{total_prev:>12}{total_next:>12}{total_next - total_prev:>+8}")
    print(
        f"{'MAINT+ARCH subtotal':<28}"
        f"{maint_prev:>12}{maint_next:>12}{maint_next - maint_prev:>+8}"
    )

    all_prev = []
    all_next = []
    for category in MAINT:
        all_prev.extend(raw(load(prev, category)))
        all_next.extend(raw(load(nxt, category)))
    keys_prev = {unit_key(row) for row in all_prev}
    keys_next = {unit_key(row) for row in all_next}
    print(f"\nUnique maint+arch cleared: {len(keys_prev - keys_next)}")
    print(f"Unique maint+arch new:     {len(keys_next - keys_prev)}")
    print(f"Unchanged overlap:         {len(keys_prev & keys_next)}")

    severity_prev = Counter(row.get("Severity") for row in all_prev)
    severity_next = Counter(row.get("Severity") for row in all_next)
    print("\nSeverity (maint+arch):")
    for severity in ("HIGH", "MEDIUM", "LOW"):
        print(
            f"  {severity:<8} {prev_label}={severity_prev.get(severity, 0):>4}  "
            f"{next_label}={severity_next.get(severity, 0):>4}  "
            f"delta={severity_next.get(severity, 0) - severity_prev.get(severity, 0):+d}"
        )

    for category in MAINT:
        rows_prev = {unit_key(row): row for row in raw(load(prev, category))}
        rows_next = {unit_key(row): row for row in raw(load(nxt, category))}
        cleared = set(rows_prev) - set(rows_next)
        new = set(rows_next) - set(rows_prev)
        if not cleared and not new:
            continue
        print(
            f"\n--- {category.replace(' findings.csv', '')}: cleared {len(cleared)}, "
            f"new {len(new)}, net {len(new) - len(cleared):+d} ---"
        )
        if cleared:
            files_cleared = Counter(norm_file(rows_prev[key].get("File", "")) for key in cleared)
            print("  Top cleared:")
            for filename, count in files_cleared.most_common(10):
                print(f"    -{count}  {filename}")
        if new:
            files_new = Counter(norm_file(rows_next[key].get("File", "")) for key in new)
            print("  Top new:")
            for filename, count in files_new.most_common(10):
                print(f"    +{count}  {filename}")


if __name__ == "__main__":
    main()
