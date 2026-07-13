# Sigrid remediation plan — Code focus

**Source:** `exported-findings-7` · Open code security RAW: **2** (code remediated; await export-8)

## Start here

1. **[REMEDIATION-PLAN.md](./REMEDIATION-PLAN.md)** — current plan (what's done + what's next)
2. **`plan-MASTER-action-items.csv`** — open code security/reliability only
3. **[Maintainability-Architecture/](./Maintainability-Architecture/)** — HIGH units + MAINT/ARCH (1078 RAW)
4. **[devops/](./devops/)** — Docker only (deferred)

## Layout

| Path | Contents |
|------|----------|
| `plan-MASTER-action-items.csv` | Open sec/reliability RAW only |
| `plan-01-security-reliability-mapping.csv` | Open sec/reliability RAW only |
| `plan-02-maintainability-mapping.csv` | All maintainability findings (MAINT/ARCH/DUP overlaps) |
| `plan-03-duplication-mapping.csv` | Duplication findings |
| `plan-04-false-positives-remarks.csv` | Sigrid remark drafts |
| `Maintainability-Architecture/` | Split MAINT-01…08 + ARCH-01…04 plan |
| `devops/` | Infrastructure (out of code scope) |

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
python sigrid-findings/compare-exports-pair.py   # after exported-findings-8 exists
```

Uses `sigrid-findings/exported-findings-7/` by default. Override: `SIGRID_EXPORT_DIR=path/to/export`.
