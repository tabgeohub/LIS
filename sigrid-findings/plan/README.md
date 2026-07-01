# Sigrid remediation plan — Code focus

**Source:** `exported-findings-4` · Open code security RAW: **1** (WP-07 remark only)

## Start here

1. **[REMEDIATION-PLAN.md](./REMEDIATION-PLAN.md)** — current plan (what's done + what's next)
2. **`plan-MASTER-action-items.csv`** — open code security/reliability only (2 items)
3. **`plan-01-cleared-security-reliability.csv`** — FIXED items (removed from active plan)
4. **[devops/](./devops/)** — Docker only (deferred)
5. **[Maintainability-Architecture/](./Maintainability-Architecture/)** — MAINT + ARCH (1085 RAW)

## Layout

| Path | Contents |
|------|----------|
| `plan-MASTER-action-items.csv` | Open sec/reliability RAW only |
| `plan-01-security-reliability-mapping.csv` | Open sec/reliability RAW only |
| `plan-01-cleared-security-reliability.csv` | FIXED sec/reliability (archive) |
| `plan-02-maintainability-mapping.csv` | All maintainability findings (MAINT/ARCH/DUP overlaps) |
| `plan-03-duplication-mapping.csv` | Duplication findings |
| `plan-04-false-positives-remarks.csv` | Sigrid remark drafts |
| `Maintainability-Architecture/` | Split MAINT-01…08 + ARCH-01…04 plan |
| `devops/` | Infrastructure (out of code scope) |

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
```

Uses `sigrid-findings/exported-findings-4/` by default. Override: `SIGRID_EXPORT_DIR=path/to/export`.
