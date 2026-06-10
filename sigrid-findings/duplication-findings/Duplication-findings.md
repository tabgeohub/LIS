# Otg-lis Duplication Findings — Status



**Source:** `Duplication findings.csv` + `Duplicates.csv`  

**Sigrid pillar:** Maintainability (code duplication)  

**Date:** 2026-06-05  



---



## Summary





| Metric                      | Value                            |

| --------------------------- | -------------------------------- |

| **Duplicate clusters**      | **~122** remaining (est.)        |

| **Severity**                | All **HIGH**                     |

| **Total redundant lines**   | **~1,356** remaining (est.)      |

| **File locations affected** | **~656** (est.; rescan to confirm) |





Duplication means the **same block of code appears in multiple places**. Sigrid counts how many lines are redundant and how often they repeat. Fixing duplication improves maintainability — one change updates one shared function instead of many copies.



**Tier-1 refactors:** complete · **QA:** complete (2026-06-05)



---



## By application area (remaining)





| Area                                 | Clusters (est.) | Redundant lines (est.) | Notes                            |

| ------------------------------------ | --------------- | ---------------------- | -------------------------------- |

| **Backend** (`backend/src/routes/…`) | ~25             | ~290                   | Residual route patterns          |

| **HomePage — Voorbereiding**         | ~24             | ~154                   | Residual voorbereiding patterns  |

| **hooks**                            | ~10             | ~140                   | Residual hook patterns           |

| **HomePage — Search & tables**       | ~20             | ~200                   | Residual list/table patterns     |

| **HomePage — Nabewerking**           | ~15             | ~150                   | Residual nabewerking patterns    |

| **HomePage — Other**                 | ~18             | ~200                   | Layout, misc                     |

| **HomePage — Tools**                 | ~2              | ~50                    | Residual tools patterns          |

| **helpers**                          | ~10             | ~120                   | Shared utilities                 |

| **Other pages**                      | 10              | ~137                   | Dashboard, installations         |

| **Miscellaneous**                    | 122             | ~1,350                 | Small one-off duplicates         |





---



## Grouped by theme (recommended reading order)



Clusters are grouped by **what is duplicated**, not by Sigrid row order.  

**Redundant lines** = total copy-paste cost for that cluster.



---



### 1. Miscellaneous



**122 clusters · ~1,350 redundant lines**



Smaller or one-off duplicates across Dashboard, emails, filters, import flows, etc. Address opportunistically when touching those files — not worth a dedicated sprint.



---



## Cross-stack duplication (backend ↔ frontend)



**21 clusters** span both backend and frontend (validation shapes, types, similar field checks). Highest priority:





| Item                | Files                                         |

| ------------------- | --------------------------------------------- |

| Point payload shape | `createPoint.ts` ↔ frontend add-point buttons |





---



## Recommended fix priority



No tier-1 themes remain. Address **miscellaneous** clusters opportunistically when editing related files.



---



## What not to chase



- **Miscellaneous** small blocks (6–8 lines) scattered across unrelated features  

- Duplication inside large one-off wizards unless already editing that area  

- Targeting **0 duplication** — unrealistic for an app this size; aim to clear HIGH clusters in tiers 1–2



---



## Quick reference — top open clusters by redundant lines



See `Duplicates.csv` for file-level detail. No single cluster dominates after tier-1 themes.



---



## Files in this folder





| File                            | Contents                                           |

| ------------------------------- | -------------------------------------------------- |

| `Duplication findings.csv`      | 398 duplicate clusters — one row per cluster       |

| `Duplicates.csv`                | 1,038 rows — one row per file location per cluster |

| `Duplication-findings.md`       | Cluster status & fix priority (tier-1 complete)    |

