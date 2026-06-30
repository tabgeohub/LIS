# Sigrid export 3 (current)

Raw CSV exports from Sigrid after the latest deploy and scan.

| File | Sigrid category |
|------|-----------------|
| `Security findings.csv` | Vulnerabilities, unsafe patterns, OSS deps |
| `Reliability findings.csv` | Dependency / stability risk |
| `Duplication findings.csv` | Copy-paste code clusters |
| `Duplicates.csv` | Line-level duplication detail |
| `Unit size findings.csv` | Functions too long |
| `Unit complexity findings.csv` | McCabe complexity too high |
| `Unit interfacing findings.csv` | Too many parameters |
| `Module coupling findings.csv` | High fan-in modules |
| `Component independence findings.csv` | Large interface hubs |
| `Component entanglement findings.csv` | Folder-level coupling |
| `AI Generated findings.csv` | AI-related findings (if any) |

Regenerate the plan from this folder:

```bash
python sigrid-findings/plan/generate-plan.py
```

Next export: create `exported-findings-4/` with new CSVs, then  
`SIGRID_EXPORT_DIR=sigrid-findings/exported-findings-4 python sigrid-findings/plan/generate-plan.py`
