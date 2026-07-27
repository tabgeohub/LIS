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

function countRaw(dir, file) {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) return null;
  try {
    return parseCsv(p).filter((r) => r.Status === "RAW").length;
  } catch {
    return null;
  }
}

const cats = {
  size: "Unit size findings.csv",
  complexity: "Unit complexity findings.csv",
  interfacing: "Unit interfacing findings.csv",
  duplication: "Duplication findings.csv",
  independence: "Component independence findings.csv",
  coupling: "Module coupling findings.csv",
  entanglement: "Component entanglement findings.csv",
  security: "Security findings.csv",
  reliability: "Reliability findings.csv",
};

const packs = {
  "(1)": "sigrid-findings/all-findings-rijkswaterstaat-otg-lis-20260721(1)",
  "227": "sigrid-findings/sigrid-227",
  new: "sigrid-findings/all-findings-rijkswaterstaat-otg-lis-20260727",
};

console.log(
  "Metric".padEnd(14),
  "(1)".padEnd(6),
  "227".padEnd(6),
  "new".padEnd(6),
  "d227"
);
for (const [k, f] of Object.entries(cats)) {
  const a = countRaw(packs["(1)"], f);
  const b = countRaw(packs["227"], f);
  const c = countRaw(packs.new, f);
  const delta =
    typeof b === "number" && typeof c === "number"
      ? (c - b >= 0 ? "+" : "") + (c - b)
      : typeof a === "number" && typeof c === "number"
        ? (c - a >= 0 ? "+" : "") + (c - a) + "(vs1)"
        : "?";
  console.log(
    k.padEnd(14),
    String(a).padEnd(6),
    String(b).padEnd(6),
    String(c).padEnd(6),
    delta
  );
}

const newDir = packs.new;
const dup = parseCsv(path.join(newDir, cats.duplication));
console.log("\nDup remaining (" + dup.filter((r) => r.Status === "RAW").length + "):");
dup
  .filter((r) => r.Status === "RAW")
  .forEach((r) => console.log(" ", r.Severity, r.Locations));

const mid = "sigrid-findings/duplication-findings-rijkswaterstaat-otg-lis-20260727/Duplication findings.csv";
if (fs.existsSync(mid)) {
  const md = parseCsv(mid).filter((r) => r.Status === "RAW");
  console.log("\nSame-day mid dup RAW (" + md.length + "):");
  md.forEach((r) => console.log(" ", r.Locations));
}

const size = parseCsv(path.join(newDir, cats.size)).filter((r) => r.Status === "RAW");
console.log("\nSize MEDIUM:", size.filter((r) => r.Severity === "MEDIUM").length);
size.filter((r) => r.Severity === "MEDIUM").forEach((r) => console.log(" ", r.File));

const iface = parseCsv(path.join(newDir, cats.interfacing)).filter((r) => r.Status === "RAW");
console.log("Interfacing MEDIUM:", iface.filter((r) => r.Severity === "MEDIUM").length);

const cx = parseCsv(path.join(newDir, cats.complexity)).filter((r) => r.Status === "RAW");
console.log(
  "McCabe>=8:",
  cx.filter((r) => Number(r["McCabe complexity"] || 0) >= 8).length
);
console.log(
  "McCabe>=7:",
  cx.filter((r) => Number(r["McCabe complexity"] || 0) >= 7).length
);

const sec = parseCsv(path.join(newDir, cats.security));
console.log("\nSecurity statuses:", Object.fromEntries(
  [...new Set(sec.map((r) => r.Status || "(empty)"))].map((s) => [
    s,
    sec.filter((r) => (r.Status || "(empty)") === s).length,
  ])
));
sec.filter((r) => r.Status === "RAW").forEach((r) => {
  console.log(" RAW", r.Severity, r.File, r.Weakness || r.Type);
});

// independence unchanged?
const indep = parseCsv(path.join(newDir, cats.independence)).filter((r) => r.Status === "RAW");
console.log("\nIndependence HIGH:", indep.filter((r) => r.Severity === "HIGH").length);
console.log("Independence MEDIUM:", indep.filter((r) => r.Severity === "MEDIUM").length);
