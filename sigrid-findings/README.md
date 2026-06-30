# Sigrid findings — Otg-lis

## Layout

| Location | Contents |
|----------|----------|
| **`exported-findings-3/`** | **Raw Sigrid CSV exports** (current scan) |
| **`plan/`** | **Remediation plan** — [start here](./plan/README.md) |
| `plan/Maintainability-Architecture/` | MAINT + ARCH split plan |
| `plan/devops/` | Docker/K8s (deferred) |

Raw findings live **only** inside export folders (e.g. `exported-findings-3/`).  
After a new Sigrid export, add a folder `exported-findings-4/` and run the generator.

## Quick start

Open **[plan/REMEDIATION-PLAN.md](./plan/REMEDIATION-PLAN.md)** or **`plan/plan-MASTER-action-items.csv`**.

```bash
python sigrid-findings/plan/generate-plan.py
```

Default source: `exported-findings-3/`. Override: `SIGRID_EXPORT_DIR=path/to/folder`.
