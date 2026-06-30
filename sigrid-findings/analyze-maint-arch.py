"""Analyze maintainability + architecture findings for planning."""
import csv
import os
from collections import Counter, defaultdict

E3 = os.path.join(os.path.dirname(__file__), "exported-findings-3")


def load(name: str) -> list[dict]:
    with open(os.path.join(E3, name), encoding="utf-8") as f:
        return list(csv.DictReader(f))


def norm_file(path: str) -> str:
    if not path:
        return ""
    return path.split("#")[0].replace("\\", "/")


cats = {
    "Unit size": "Unit size findings.csv",
    "Unit complexity": "Unit complexity findings.csv",
    "Unit interfacing": "Unit interfacing findings.csv",
    "Module coupling": "Module coupling findings.csv",
    "Component independence": "Component independence findings.csv",
    "Component entanglement": "Component entanglement findings.csv",
}

all_rows: list[tuple[str, dict]] = []
print("=== RAW counts by category ===")
for cat, fname in cats.items():
    rows = [r for r in load(fname) if r.get("Status") == "RAW"]
    all_rows.extend((cat, r) for r in rows)
    print(f"  {cat}: {len(rows)}")

file_cat: dict[str, set[str]] = defaultdict(set)
fc2: Counter = Counter()
for cat, r in all_rows:
    f = norm_file(r.get("File", ""))
    file_cat[f].add(cat)
    fc2[f] += 1

print("\n=== Top 20 files (finding count) ===")
for f, n in fc2.most_common(20):
    print(f"  {n:3d}  {f}  [{', '.join(sorted(file_cat[f]))}]")

folder_c: Counter = Counter()
for cat, r in all_rows:
    f = norm_file(r.get("File", ""))
    if f.startswith("src/Components/HomePage"):
        folder = "/".join(f.split("/")[:4])
    elif f.startswith("src/hooks"):
        folder = "/".join(f.split("/")[:3])
    elif f.startswith("src/"):
        folder = "/".join(f.split("/")[:2])
    else:
        folder = f.split("/")[0] or "?"
    folder_c[folder] += 1

print("\n=== Top folders ===")
for folder, n in folder_c.most_common(15):
    print(f"  {n:4d}  {folder}")

print("\n=== Module coupling (all RAW) ===")
for r in load("Module coupling findings.csv"):
    if r.get("Status") != "RAW":
        continue
    fi = r.get("Fan-in", "?")
    loc = r.get("Lines of code", "?")
    print(f"  fan-in {fi}  {norm_file(r.get('File', ''))}  ({loc} LOC)")

print("\n=== Component entanglement (all RAW) ===")
for r in load("Component entanglement findings.csv"):
    if r.get("Status") != "RAW":
        continue
    desc = (r.get("Description") or "")[:90]
    print(f"  {r.get('Severity')}  {desc}")

print("\n=== Unit size: top 12 by LOC ===")
size = [r for r in load("Unit size findings.csv") if r.get("Status") == "RAW"]
size.sort(key=lambda r: int(r.get("Lines of code") or 0), reverse=True)
for r in size[:12]:
    loc = r.get("Lines of code", "?")
    cx = r.get("McCabe complexity", "?")
    print(f"  {loc:>4s} LOC  cplx {cx}  {norm_file(r.get('File', ''))}")

print("\n=== Unit complexity: top 12 ===")
cx_rows = [r for r in load("Unit complexity findings.csv") if r.get("Status") == "RAW"]
cx_rows.sort(key=lambda r: int(r.get("McCabe complexity") or 0), reverse=True)
for r in cx_rows[:12]:
    unit = (r.get("Unit") or "")[:70]
    print(f"  cplx {r.get('McCabe complexity','?'):>3s}  LOC {r.get('Lines of code','?')}  {unit}")

print("\n=== Overlap: files with size AND complexity RAW ===")
size_files = {norm_file(r.get("File", "")) for r in load("Unit size findings.csv") if r.get("Status") == "RAW"}
cx_files = {norm_file(r.get("File", "")) for r in load("Unit complexity findings.csv") if r.get("Status") == "RAW"}
both = size_files & cx_files
print(f"  {len(both)} files flagged for both size and complexity")
for f in sorted(both, key=lambda x: -fc2[x])[:15]:
    print(f"    {fc2[f]} findings  {f}")
