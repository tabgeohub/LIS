import fs from "fs";
import path from "path";

const dir = process.argv[2];

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

function load(name) {
  const text = fs.readFileSync(path.join(dir, name), "utf8");
  const rows = parseCsv(text);
  const h = rows[0];
  const data = rows.slice(1).map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ""])));
  return { h, data };
}

function dump(name, pick = null) {
  const { h, data } = load(name);
  console.log("\n====", name, "====");
  console.log("headers:", h.join(" | "));
  console.log("count:", data.length);
  for (const row of data) {
    if (pick) {
      console.log(JSON.stringify(Object.fromEntries(pick.map((k) => [k, row[k]]))));
    } else {
      // print compact non-empty fields
      const o = {};
      for (const [k, v] of Object.entries(row)) {
        if (String(v).trim()) o[k] = v;
      }
      console.log(JSON.stringify(o));
    }
  }
}

dump("Security findings.csv");
dump("Reliability findings.csv");
dump("Unit complexity findings.csv");
dump("Unit interfacing findings.csv");
dump("Component entanglement findings.csv");

// Medium unit size only
{
  const { data } = load("Unit size findings.csv");
  const med = data.filter((r) => (r.Severity || "").toUpperCase() === "MEDIUM");
  console.log("\n==== Unit size MEDIUM ====");
  for (const row of med) {
    const o = {};
    for (const [k, v] of Object.entries(row)) if (String(v).trim()) o[k] = v;
    console.log(JSON.stringify(o));
  }
}

// Coupling + independence HIGH
{
  const { data } = load("Module coupling findings.csv");
  console.log("\n==== Module coupling all ====");
  for (const row of data) {
    const o = {};
    for (const [k, v] of Object.entries(row)) if (String(v).trim()) o[k] = v;
    console.log(JSON.stringify(o));
  }
}
{
  const { data } = load("Component independence findings.csv");
  const high = data.filter((r) => (r.Severity || "").toUpperCase() === "HIGH");
  console.log("\n==== Independence HIGH ====");
  for (const row of high) {
    const o = {};
    for (const [k, v] of Object.entries(row)) if (String(v).trim()) o[k] = v;
    console.log(JSON.stringify(o));
  }
}
