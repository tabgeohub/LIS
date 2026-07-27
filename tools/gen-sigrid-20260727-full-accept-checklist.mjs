import fs from "fs";
import path from "path";

function parseCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === "," && !inQuotes) {
        values.push(current);
        current = "";
        continue;
      }
      current += ch;
    }
    values.push(current);
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (values[i] ?? "").trim();
    });
    return row;
  });
}

const base = "sigrid-findings/all-findings-rijkswaterstaat-otg-lis-20260727";

const indep = parseCsv(path.join(base, "Component independence findings.csv")).filter(
  (r) => r.Status === "RAW"
);
const coupling = parseCsv(path.join(base, "Module coupling findings.csv")).filter(
  (r) => r.Status === "RAW"
);
const ent = parseCsv(path.join(base, "Component entanglement findings.csv")).filter(
  (r) => r.Status === "RAW"
);
const sec = parseCsv(path.join(base, "Security findings.csv")).filter(
  (r) =>
    r.Status === "RAW" &&
    (String(r.File || "").includes("dockerfile") ||
      String(r.Locations || "").includes("dockerfile") ||
      String(r.Weakness || "").includes("CWE-266") ||
      String(r.Weakness || "").includes("CWE-250"))
);
const size = parseCsv(path.join(base, "Unit size findings.csv")).filter(
  (r) =>
    r.Status === "RAW" &&
    r.Severity === "MEDIUM" &&
    (r.File.includes("dockerfile") || r.File.includes("verify-regio-apis"))
);

const total =
  indep.length + coupling.length + ent.length + sec.length + size.length;

let out = "# Sigrid-20260727 FULL Accept checklist\n\n";
out +=
  "Apply in Sigrid UI. Source: `sigrid-findings/all-findings-rijkswaterstaat-otg-lis-20260727`.\n\n";
out +=
  "**Code-fixed (do not Accept):** remaining Dup HIGH (Step2 + devices), `react-router-dom` CWE-601.\n\n";
out +=
  "**Out of scope code:** Docker/Nginx — Accept only.\n\n";
out += "## Summary\n\n| Bucket | Count |\n| --- | --- |\n";
out += `| Independence | ${indep.length} |\n`;
out += `| Module coupling | ${coupling.length} |\n`;
out += `| Entanglement | ${ent.length} |\n`;
out += `| Security Docker | ${sec.length} |\n`;
out += `| Size Accept | ${size.length} |\n`;
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

fs.writeFileSync(
  "sigrid-findings/SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md",
  out
);
console.log("Wrote checklist, total items:", total);
