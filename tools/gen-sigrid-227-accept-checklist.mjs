import fs from "fs";
import path from "path";

const base = "sigrid-findings/sigrid-227";

function parseCsv(file) {
  const lines = fs.readFileSync(path.join(base, file), "utf8").trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
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
    headers.forEach((header, index) => {
      row[header.trim()] = (values[index] ?? "").trim();
    });
    return row;
  });
}

const indep = parseCsv("Component independence findings.csv").filter((r) => r.Status === "RAW");
const coupling = parseCsv("Module coupling findings.csv").filter((r) => r.Status === "RAW");
const ent = parseCsv("Component entanglement findings.csv").filter((r) => r.Status === "RAW");
const sec = parseCsv("Security findings.csv").filter((r) => r.Status === "RAW");
const dup = parseCsv("Duplication findings.csv").filter(
  (r) => r.Status === "RAW" && r["Same component"] === "false"
);
const size = parseCsv("Unit size findings.csv").filter(
  (r) =>
    r.Status === "RAW" &&
    r.Severity === "MEDIUM" &&
    (r.File.includes("dockerfile") || r.File.includes("verify-regio-apis"))
);

const total = indep.length + coupling.length + ent.length + sec.length + dup.length + size.length;

let out = "# Sigrid-227 Accept checklist\n\n";
out += "Apply in Sigrid UI. Source: `sigrid-findings/sigrid-227`.\n\n";
out += "## Summary\n\n| Bucket | Count |\n| --- | --- |\n";
out += `| Independence | ${indep.length} |\n`;
out += `| Module coupling | ${coupling.length} |\n`;
out += `| Entanglement | ${ent.length} |\n`;
out += `| Security Docker | ${sec.length} |\n`;
out += `| Duplication FE/BE | ${dup.length} |\n`;
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

out += "\n## Security\n\n";
sec.forEach((r, i) => {
  out += `${i + 1}. [ ] \`${r.File}\` — ${r.Weakness} @ ${r.Locations}\n`;
});

out += "\n## Duplication FE/BE\n\n";
dup.forEach((r, i) => {
  out += `${i + 1}. [ ] ${r.Locations}\n`;
});

out += "\n## Size Accept\n\n";
size.forEach((r, i) => {
  out += `${i + 1}. [ ] \`${r.File}\` — ${r.Description}\n`;
});

fs.writeFileSync("sigrid-findings/SIGRID-227-ACCEPT-CHECKLIST.md", out);
console.log("Wrote checklist, total items:", total);
