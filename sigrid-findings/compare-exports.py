"""Compare exported-findings-1 vs exported-findings-2."""
import csv
import os
from collections import Counter

ROOT = os.path.dirname(os.path.abspath(__file__))
OLD = os.path.join(ROOT, "exported-findings-1")
NEW = os.path.join(ROOT, "exported-findings-2")

FILES = [
    "Security findings.csv",
    "Reliability findings.csv",
    "Duplication findings.csv",
    "Unit size findings.csv",
    "Unit complexity findings.csv",
    "Unit interfacing findings.csv",
    "Module coupling findings.csv",
    "Component independence findings.csv",
    "Component entanglement findings.csv",
]


def load(folder: str, name: str) -> list[dict]:
    path = os.path.join(folder, name)
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def norm_file(path: str) -> str:
    if not path:
        return ""
    return path.split("#")[0].replace("\\", "/").lower()


def issue_key(row: dict) -> tuple:
    return (
        norm_file(row.get("File", "")),
        (row.get("Type") or row.get("Description") or "")[:100],
    )


def count_status(rows: list[dict]) -> Counter:
    return Counter(r.get("Status", "?") for r in rows)


print("=== FINDING COUNTS ===")
for name in FILES:
    o, n = load(OLD, name), load(NEW, name)
    print(f"{name}: {len(o)} -> {len(n)} ({len(n) - len(o):+d})")

print("\n=== SECURITY & RELIABILITY ===")
for fname in ("Security findings.csv", "Reliability findings.csv"):
    cat = fname.split()[0]
    for label, folder in (("BEFORE", OLD), ("AFTER", NEW)):
        rows = load(folder, fname)
        c = count_status(rows)
        print(
            f"{cat} {label}: total={len(rows)} "
            f"RAW={c.get('RAW', 0)} FIXED={c.get('FIXED', 0)}"
        )

for fname, cat in (
    ("Security findings.csv", "SECURITY"),
    ("Reliability findings.csv", "RELIABILITY"),
):
    old_raw = {
        issue_key(r) for r in load(OLD, fname) if r.get("Status") == "RAW"
    }
    new_raw = {
        issue_key(r) for r in load(NEW, fname) if r.get("Status") == "RAW"
    }
    cleared = old_raw - new_raw
    still = new_raw
    new_only = new_raw - old_raw

    print(f"\n=== {cat}: CLEARED RAW ({len(cleared)}) ===")
    for f, d in sorted(cleared):
        print(f"  {f} | {d[:70]}")

    print(f"\n=== {cat}: STILL RAW ({len(still)}) ===")
    if still:
        for f, d in sorted(still):
            print(f"  {f} | {d[:70]}")
    else:
        print("  (none)")

    if new_only:
        print(f"\n=== {cat}: NEW RAW ({len(new_only)}) ===")
        for f, d in sorted(new_only):
            print(f"  {f} | {d[:70]}")

print("\n=== MAINTAINABILITY RAW (all categories) ===")
for name in FILES[2:]:
    o_raw = sum(1 for r in load(OLD, name) if r.get("Status") == "RAW")
    n_raw = sum(1 for r in load(NEW, name) if r.get("Status") == "RAW")
    if o_raw or n_raw:
        print(f"  {name}: RAW {o_raw} -> {n_raw} ({n_raw - o_raw:+d})")

print("\n=== DUPLICATION: biggest reductions ===")


def dup_by_file(rows: list[dict]) -> Counter:
    out: Counter = Counter()
    for r in rows:
        loc = r.get("Locations", "") or r.get("File", "")
        first = loc.split(",")[0].split("#")[0].replace("\\", "/") if loc else "?"
        out[first] += 1
    return out


old_d = dup_by_file(load(OLD, "Duplication findings.csv"))
new_d = dup_by_file(load(NEW, "Duplication findings.csv"))
deltas = [
    (f, old_d[f] - new_d.get(f, 0), old_d[f], new_d.get(f, 0)) for f in old_d
]
deltas.sort(key=lambda x: -x[1])
for f, delta, o, n in deltas[:20]:
    if delta != 0:
        print(f"  {delta:+d}: {f} ({o} -> {n})")
