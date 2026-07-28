import fs from "fs";
import path from "path";

function parseCsv(text) {
  const rows = [];
  let i = 0;
  let field = "";
  let row = [];
  let inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQ = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQ = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((x) => x !== "")) rows.push(row);
  }
  return rows;
}

function loadCsv(filePath) {
  const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((values) => {
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (values[i] ?? "").trim();
    });
    return row;
  });
}

const base =
  "sigrid-findings/all-findings-rijkswaterstaat-otg-lis-20260728";


const indep = loadCsv(
  path.join(base, "Component independence findings.csv")
).filter((r) => r.Status === "RAW");
const coupling = loadCsv(
  path.join(base, "Module coupling findings.csv")
).filter((r) => r.Status === "RAW");
const ent = loadCsv(
  path.join(base, "Component entanglement findings.csv")
).filter((r) => r.Status === "RAW");
const sec = loadCsv(path.join(base, "Security findings.csv")).filter(
  (r) =>
    r.Status === "RAW" &&
    (String(r.File || "").toLowerCase().includes("dockerfile") ||
      String(r.Locations || "").toLowerCase().includes("dockerfile") ||
      String(r.Weakness || "").includes("CWE-266") ||
      String(r.Weakness || "").includes("CWE-250"))
);
const osh = loadCsv(path.join(base, "Security findings.csv")).filter(
  (r) =>
    r.Status === "RAW" &&
    String(r.File || "").includes("package-lock.json")
);
const size = loadCsv(path.join(base, "Unit size findings.csv")).filter(
  (r) =>
    r.Status === "RAW" &&
    r.Severity === "MEDIUM" &&
    String(r.File || "")
      .toLowerCase()
      .includes("dockerfile")
);
const interfacing = loadCsv(
  path.join(base, "Unit interfacing findings.csv")
).filter((r) => r.Status === "RAW");

const EXPRESS_OR_MULTER_RE =
  /(Request|Response|NextFunction|RequestHandler|express\.|Multer|fileFilter|filename|requirePassword|requireSessionAuth|requireAuthClientHeader|legacyAuthUsageMonitor|requireAdmin|attachDeviceFromToken|handleInstallerUploadMiddleware)/i;

const expressIface = interfacing.filter((r) =>
  EXPRESS_OR_MULTER_RE.test(`${r.Unit} ${r.File} ${r.Description}`)
);

const total =
  indep.length +
  coupling.length +
  ent.length +
  sec.length +
  size.length +
  expressIface.length +
  osh.length;

let out = "# Sigrid-20260728 FULL Accept checklist\n\n";
out +=
  "Apply in Sigrid UI. Source: `sigrid-findings/all-findings-rijkswaterstaat-otg-lis-20260728`.\n\n";
out +=
  "**Code-fixed this wave (do not Accept):** Dup HIGH repos, complexity LOW `rolesFromTokenSet`, size MEDIUM `useFotoPanelModel`.\n\n";
out +=
  "**Out of scope code:** Docker/Nginx, Independence `*Core` facades, high fan-in hubs - Accept only.\n\n";
out += "## Summary\n\n| Bucket | Count |\n| --- | --- |\n";
out += `| Independence | ${indep.length} |\n`;
out += `| Module coupling | ${coupling.length} |\n`;
out += `| Entanglement | ${ent.length} |\n`;
out += `| Security Docker | ${sec.length} |\n`;
out += `| Size Accept (dockerfile) | ${size.length} |\n`;
out += `| Interfacing Express/Multer | ${expressIface.length} |\n`;
out += `| Security OSH residual | ${osh.length} |\n`;
out += `| **Total** | **${total}** |\n\n`;

out += "## Independence HIGH\n\n";
indep
  .filter((r) => r.Severity === "HIGH")
  .forEach((r, i) => {
    out += `${i + 1}. [ ] \`${r.File}\` — ${r.Description}\n`;
  });

out += "\n## Independence MEDIUM (accept all)\n\n";
indep
  .filter((r) => r.Severity === "MEDIUM")
  .forEach((r, i) => {
    out += `${i + 1}. [ ] \`${r.File}\` (${r["Lines of code"]} LOC)\n`;
  });

out += "\n## Module coupling\n\n";
coupling.forEach((r, i) => {
  out += `${i + 1}. [ ] \`${r.File}\` — fan-in ${r["Fan-in"]} (${r.Severity})\n`;
});

out += "\n## Entanglement\n\n";
ent.forEach((r, i) => {
  out += `${i + 1}. [ ] ${r.Description} (${r.Severity})\n`;
});

out += "\n## Security Docker (Accept — no Dockerfile edits)\n\n";
sec.forEach((r, i) => {
  out += `${i + 1}. [ ] \`${r.File || r.Locations}\` — ${r.Weakness || r.Description}\n`;
});

out += "\n## Size Accept\n\n";
size.forEach((r, i) => {
  out += `${i + 1}. [ ] \`${r.File}\` — ${r.Description}\n`;
});

out += "\n## Interfacing Express/Multer (Accept — framework signatures)\n\n";
expressIface.forEach((r, i) => {
  out += `${i + 1}. [ ] \`${r.File}\` — ${r.Unit || r.Description}\n`;
});

out += "\n## Security OSH residual\n\n";
if (osh.length === 0) {
  out +=
    "_None remaining after bump, or mark Accept if CVE still open on latest 6.x._\n";
} else {
  osh.forEach((r, i) => {
    out += `${i + 1}. [ ] \`${r.File}\` — ${r.Description} (${r.Weakness})\n`;
  });
}

fs.writeFileSync(
  "sigrid-findings/SIGRID-20260728-FULL-ACCEPT-CHECKLIST.md",
  out
);
console.log("Wrote full checklist, total items:", total);

// Coupling-only checklist
let coupleOut = "# Sigrid coupling Accept checklist (pack 20260728)\n\n";
coupleOut +=
  "Source: `all-findings-rijkswaterstaat-otg-lis-20260728/Module coupling findings.csv`\n\n";
coupling.forEach((r, i) => {
  coupleOut += `${i + 1}. [ ] \`${r.File}\` — fan-in ${r["Fan-in"]} (${r.Severity}, ${r["Lines of code"]} LOC)\n`;
});
fs.writeFileSync(
  "sigrid-findings/SIGRID-COUPLING-ACCEPT-CHECKLIST.md",
  coupleOut
);
console.log("Wrote coupling checklist, items:", coupling.length);

// ACCEPT-LIST summary
let acceptList = `# ACCEPT-LIST — pack 20260728\n\n`;
acceptList += `Generated from \`all-findings-rijkswaterstaat-otg-lis-20260728\`.\n\n`;
acceptList += `## Do in Sigrid UI\n\n`;
acceptList += `- Full checklist: [SIGRID-20260728-FULL-ACCEPT-CHECKLIST.md](SIGRID-20260728-FULL-ACCEPT-CHECKLIST.md) (**${total}** items)\n`;
acceptList += `- Coupling only: [SIGRID-COUPLING-ACCEPT-CHECKLIST.md](SIGRID-COUPLING-ACCEPT-CHECKLIST.md) (**${coupling.length}**)\n\n`;
acceptList += `## Buckets\n\n`;
acceptList += `| Bucket | Count | Action |\n| --- | --- | --- |\n`;
acceptList += `| Independence | ${indep.length} | Accept |\n`;
acceptList += `| Module coupling | ${coupling.length} | Accept |\n`;
acceptList += `| Entanglement | ${ent.length} | Accept |\n`;
acceptList += `| Security Docker | ${sec.length} | Accept |\n`;
acceptList += `| Size dockerfile | ${size.length} | Accept |\n`;
acceptList += `| Interfacing Express/Multer | ${expressIface.length} | Accept |\n`;
acceptList += `| OSH residual | ${osh.length} | Bump if possible else Accept |\n`;
acceptList += `\n## Do not Accept (code wave)\n\n`;
acceptList += `- Dup HIGH: finishedPlansRepo / attachmentsRepo (code-fixed)\n`;
acceptList += `- Unit complexity LOW: rolesFromTokenSet (code-fixed)\n`;
acceptList += `- Size MEDIUM: useFotoPanelModel (code-fixed); dockerfile + script helper Accept\n`;
fs.writeFileSync("sigrid-findings/ACCEPT-LIST.md", acceptList);
console.log("Wrote ACCEPT-LIST.md");
