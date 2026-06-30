"""Compare exported-findings-2 vs exported-findings-3 (and baseline)."""
import csv
import os
from collections import Counter

ROOT = os.path.dirname(os.path.abspath(__file__))
E1 = os.path.join(ROOT, "exported-findings-1")
E2 = os.path.join(ROOT, "exported-findings-2")
E3 = os.path.join(ROOT, "exported-findings-3")

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


def is_devops(file_path: str) -> bool:
    f = norm_file(file_path)
    if not f:
        return False
    if f in {"dockerfile", "backend/dockerfile", "nginx.conf", ".gitlab-ci.yml"}:
        return True
    if f.startswith("k8s/") or "dockerfile" in f:
        return True
    return False


def issue_key(row: dict) -> tuple:
    return (
        norm_file(row.get("File", "")),
        (row.get("Type") or row.get("Description") or "")[:100],
    )


def sec_rel_stats(folder: str, code_only: bool = False) -> tuple[int, int, int]:
    rows = load(folder, "Security findings.csv") + load(
        folder, "Reliability findings.csv"
    )
    if code_only:
        rows = [r for r in rows if not is_devops(r.get("File", ""))]
    c = Counter(r.get("Status") for r in rows)
    return len(rows), c.get("RAW", 0), c.get("FIXED", 0)


print("=== JOURNEY: export 1 -> 2 -> 3 ===")
for name in FILES:
    c1, c2, c3 = len(load(E1, name)), len(load(E2, name)), len(load(E3, name))
    print(f"  {name}: {c1} -> {c2} -> {c3} ({c3 - c2:+d} vs E2)")

print("\n=== SECURITY + RELIABILITY RAW ===")
for label, folder in [("E1 baseline", E1), ("E2 prev", E2), ("E3 new", E3)]:
    _, raw_all, _ = sec_rel_stats(folder)
    _, raw_code, _ = sec_rel_stats(folder, code_only=True)
    print(f"  {label}: all RAW={raw_all}, code-only RAW={raw_code}")

print("\n=== E2 -> E3: SECURITY RAW CLEARED ===")
e2_raw = {
    issue_key(r) for r in load(E2, "Security findings.csv") if r.get("Status") == "RAW"
}
e3_raw = {
    issue_key(r) for r in load(E3, "Security findings.csv") if r.get("Status") == "RAW"
}
for f, d in sorted(e2_raw - e3_raw):
    tag = "devops" if is_devops(f) else "code"
    print(f"  [{tag}] CLEARED: {f} | {d[:65]}")
if not (e2_raw - e3_raw):
    print("  (none)")

print("\n=== E2 -> E3: SECURITY RAW NEW ===")
for f, d in sorted(e3_raw - e2_raw):
    print(f"  NEW: {f} | {d[:65]}")
if not (e3_raw - e2_raw):
    print("  (none)")

print("\n=== E3: ALL SECURITY RAW REMAINING ===")
for f, d in sorted(e3_raw):
    tag = "devops" if is_devops(f) else "code"
    print(f"  [{tag}] {f} | {d[:65]}")
if not e3_raw:
    print("  none")

print("\n=== MAINTAINABILITY RAW (E2 -> E3) ===")
total_e2 = total_e3 = 0
for name in FILES[2:]:
    o = sum(1 for r in load(E2, name) if r.get("Status") == "RAW")
    n = sum(1 for r in load(E3, name) if r.get("Status") == "RAW")
    total_e2 += o
    total_e3 += n
    ch = f" ({n - o:+d})" if o != n else ""
    print(f"  {name}: {o} -> {n}{ch}")
print(f"  TOTAL maintainability RAW: {total_e2} -> {total_e3} ({total_e3 - total_e2:+d})")

print("\n=== DUPLICATION: biggest E2 -> E3 changes ===")


def dup_by_file(rows: list[dict]) -> Counter:
    out: Counter = Counter()
    for r in rows:
        loc = r.get("Locations", "") or r.get("File", "")
        first = loc.split(",")[0].split("#")[0].replace("\\", "/") if loc else "?"
        out[first] += 1
    return out


d2 = dup_by_file(load(E2, "Duplication findings.csv"))
d3 = dup_by_file(load(E3, "Duplication findings.csv"))
deltas = [
    (f, d2.get(f, 0) - d3.get(f, 0), d2.get(f, 0), d3.get(f, 0))
    for f in set(d2) | set(d3)
]
deltas.sort(key=lambda x: -abs(x[1]))
shown = 0
for f, delta, o, n in deltas:
    if delta == 0:
        continue
    print(f"  {delta:+d}: {f} ({o} -> {n})")
    shown += 1
    if shown >= 20:
        break
