# Sigrid remediation plan — Code focus

## Start here

1. **[REMEDIATION-PLAN.md](./REMEDIATION-PLAN.md)** — application code plan
2. **`plan-MASTER-action-items.csv`** — open code Security/Reliability items (Excel)
3. **[devops/](./devops/)** — K8s, Docker, nginx (deferred)

## Layout

| Path | Contents |
|------|----------|
| `plan-*.csv` | Code findings only |
| `devops/` | Infrastructure / DevOps findings |

## Regenerate

```bash
python sigrid-findings/plan/generate-plan.py
```
