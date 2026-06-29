# Sigrid findings — Otg-lis

## Layout

| Location | Contents |
|----------|----------|
| **`plan/`** | **Code remediation plan** — [start here](./plan/README.md) |
| `plan/devops/` | K8s, Docker, nginx (deferred) |
| `* findings.csv` | Raw Sigrid exports |

## Quick start (code)

Open **[plan/REMEDIATION-PLAN.md](./plan/REMEDIATION-PLAN.md)** or **`plan/plan-MASTER-action-items.csv`**.

DevOps items: **[plan/devops/DEVOPS-PLAN.md](./plan/devops/DEVOPS-PLAN.md)**

```bash
python sigrid-findings/plan/generate-plan.py
```
