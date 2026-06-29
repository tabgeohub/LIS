# Sigrid Remediation Plan — DevOps

Kubernetes, Docker, nginx/ingress findings — **deferred from the main code plan**.

## Finding counts

| Area | Count | Open (RAW) |
|------|------:|-----------:|
| Security + Reliability (devops) | 37 | 2 |
| FIXED (verify only) | 35 | — |
| Maintainability (dockerfile) | 1 | — |

## Work packages

| ID | Phase | Name | Open RAW |
|----|-------|------|----------|
| DO-00 | 0 - Prep | DevOps baseline | — |
| DO-01 | 1 - Docker | Docker non-root USER | 2 |
| DO-02 | 2 - Kubernetes | K8s manifests verify FIXED | — |
| DO-03 | 3 - Defer | Dockerfile unit size | — |

## Open items (2 RAW)

| DO | Severity | File | Issue |
|----|----------|------|-------|
| DO-01 | HIGH | `backend/dockerfile` | Missing User Instruction |
| DO-01 | HIGH | `dockerfile` | Missing User Instruction |

## Scope

- `dockerfile` — frontend nginx image
- `backend/dockerfile` — backend Node image
- `k8s/lis-backend-dep.yaml`, `k8s/lis-frontend-dep.yaml`
- `k8s/Lis_ingressFront.yaml`

## Suggested order (when you pick up DevOps)

1. **DO-01** — Docker USER directives (2 open HIGH)
2. **DO-02** — Verify K8s FIXED findings (no rework unless regression)

## Files

| File | Purpose |
|------|---------|
| `devops-MASTER-action-items.csv` | Open DevOps action items |
| `devops-00-work-packages.csv` | Work package definitions |
| `devops-01-security-reliability-mapping.csv` | All DevOps security/reliability findings |
