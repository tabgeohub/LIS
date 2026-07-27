import fs from "fs";

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

const coupling = parseCsv(
  "sigrid-findings/module-coupling-findings-rijkswaterstaat-otg-lis-20260727(1).csv"
).filter((r) => r.Status === "RAW");
const complexity = parseCsv(
  "sigrid-findings/unit-complexity-findings-rijkswaterstaat-otg-lis-20260727.csv"
).filter((r) => r.Status === "RAW");
const interfacing = parseCsv(
  "sigrid-findings/unit-interfacing-findings-rijkswaterstaat-otg-lis-20260727.csv"
).filter((r) => r.Status === "RAW");

console.log("coupling", coupling.length);
console.log(
  "complexity",
  complexity.length,
  "mccabe",
  Object.fromEntries(
    [...new Set(complexity.map((r) => r["McCabe complexity"]))].map((m) => [
      m,
      complexity.filter((r) => r["McCabe complexity"] === m).length,
    ])
  )
);
console.log(
  "interfacing",
  interfacing.length,
  "params",
  Object.fromEntries(
    [...new Set(interfacing.map((r) => r["Number of parameters"]))].map((p) => [
      p,
      interfacing.filter((r) => r["Number of parameters"] === p).length,
    ])
  )
);
console.log(
  "iface MEDIUM",
  interfacing.filter((r) => r.Severity === "MEDIUM").map((r) => r.File)
);
console.log("--- complexity files ---");
complexity.forEach((r) =>
  console.log(r["McCabe complexity"], r.File, r.Unit || "")
);
console.log("--- interfacing (non-express candidates) ---");
interfacing.forEach((r) =>
  console.log(r["Number of parameters"], r.Severity, r.File, r.Unit || "")
);
