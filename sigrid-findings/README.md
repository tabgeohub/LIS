# Sigrid findings — Otg-lis

## Layout

| Location | Contents |
|----------|----------|
| **`exported-findings-7/`** | **Raw Sigrid CSV exports** (current scan) |
| **`plan/`** | **Remediation plan** — [start here](./plan/README.md) |
| `plan/Maintainability-Architecture/` | MAINT + ARCH split plan |
| `plan/devops/` | Docker/K8s (deferred) |
| `compare-exports-pair.py` | Compare two export folders (default E7→E8) |

Raw findings live **only** inside export folders (e.g. `exported-findings-7/`).  
After a new Sigrid export, add `exported-findings-8/` and run the generator + compare script.

## Quick start

Open **[plan/REMEDIATION-PLAN.md](./plan/REMEDIATION-PLAN.md)** or **`plan/plan-MASTER-action-items.csv`**.

```bash
python sigrid-findings/plan/generate-plan.py
python sigrid-findings/compare-exports-pair.py exported-findings-7 exported-findings-8
```

Default source: `exported-findings-7/`. Override: `SIGRID_EXPORT_DIR=path/to/folder`.
