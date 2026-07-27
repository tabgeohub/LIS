import fs from "fs";

function parseCsv(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/);
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

const indep = parseCsv(
  "sigrid-findings/component-independence-findings-rijkswaterstaat-otg-lis-20260727.csv"
).filter((r) => r.Status === "RAW");

const coupling = parseCsv(
  "sigrid-findings/module-coupling-findings-rijkswaterstaat-otg-lis-20260727.csv"
).filter((r) => r.Status === "RAW");

const total = indep.length + coupling.length;

let out = "# Sigrid-20260727 Accept checklist\n\n";
out +=
  "Apply in Sigrid UI. Source: `sigrid-findings/*-20260727*` (independence + coupling).\n\n";
out +=
  "Duplication HIGH findings are **code-fixed** in this wave (shared FE/BE module + Step2 + dead `public/index.html`) — do not Accept those; expect FIXED on rescan.\n\n";
out += "## Summary\n\n| Bucket | Count |\n| --- | --- |\n";
out += `| Independence | ${indep.length} |\n`;
out += `| Module coupling | ${coupling.length} |\n`;
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

fs.writeFileSync("sigrid-findings/SIGRID-20260727-ACCEPT-CHECKLIST.md", out);
console.log("Wrote checklist, total items:", total);
