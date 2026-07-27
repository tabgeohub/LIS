import fs from "fs";
import path from "path";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node summarize-sigrid-pack.mjs <dir>");
  process.exit(1);
}

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

function countBy(data, idx, key) {
  const out = {};
  for (const r of data) {
    const v = (r[idx[key]] || "").trim() || "(blank)";
    out[v] = (out[v] || 0) + 1;
  }
  return out;
}

function topN(obj, n = 15) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

function analyze(file) {
  const text = fs.readFileSync(path.join(dir, file), "utf8");
  const rows = parseCsv(text);
  if (rows.length < 2) return { file, empty: true };
  const h = rows[0];
  const idx = Object.fromEntries(h.map((x, i) => [x, i]));
  const data = rows.slice(1);
  const result = {
    file,
    total: data.length,
    bySeverity: countBy(data, idx, "Severity"),
    byFindingType: countBy(data, idx, "Finding Type"),
    byCategory: countBy(data, idx, "Category"),
  };

  // Extra detail for maintainability CSVs
  if (idx["McCabe Complexity"] != null) {
    const byM = {};
    for (const r of data) {
      const m = (r[idx["McCabe Complexity"]] || "").trim() || "(blank)";
      byM[m] = (byM[m] || 0) + 1;
    }
    result.byMcCabe = byM;
  }
  if (idx["Parameters"] != null) {
    const byP = {};
    for (const r of data) {
      const p = (r[idx["Parameters"]] || "").trim() || "(blank)";
      byP[p] = (byP[p] || 0) + 1;
    }
    result.byParameters = byP;
  }
  if (idx["Lines of Code"] != null || idx["LOC"] != null) {
    const locKey = idx["Lines of Code"] != null ? "Lines of Code" : "LOC";
    const buckets = { "1-15": 0, "16-30": 0, "31-60": 0, "61+": 0, other: 0 };
    for (const r of data) {
      const n = Number((r[idx[locKey]] || "").trim());
      if (!Number.isFinite(n)) buckets.other++;
      else if (n <= 15) buckets["1-15"]++;
      else if (n <= 30) buckets["16-30"]++;
      else if (n <= 60) buckets["31-60"]++;
      else buckets["61+"]++;
    }
    result.byLocBucket = buckets;
  }

  // Sample first few file paths / units for non-empty packs
  const fileCol =
    idx["File"] ??
    idx["Filename"] ??
    idx["Component"] ??
    idx["Module"] ??
    idx["Location"];
  const unitCol = idx["Unit"] ?? idx["Function"] ?? idx["Method"];
  if (fileCol != null) {
    const files = {};
    for (const r of data) {
      const f = (r[fileCol] || "").trim() || "(blank)";
      files[f] = (files[f] || 0) + 1;
    }
    result.topFiles = topN(files, 12);
  }
  if (unitCol != null) {
    result.sampleUnits = data.slice(0, 8).map((r) => ({
      unit: (r[unitCol] || "").trim(),
      file: fileCol != null ? (r[fileCol] || "").trim() : "",
      severity: (r[idx["Severity"]] || "").trim(),
      type: (r[idx["Finding Type"]] || "").trim(),
    }));
  }

  return result;
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv")).sort();
for (const f of files) {
  console.log(JSON.stringify(analyze(f), null, 2));
  console.log("---");
}
