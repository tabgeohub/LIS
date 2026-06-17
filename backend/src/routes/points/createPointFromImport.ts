import { Request, Response } from "express";
import { pool } from "../../db";
import { POINT_CORE_COLUMNS } from "../../helpers/queries/pointFields";

type ReturnMode = "all" | "existing" | "created";

export async function createPointFromImport(
  req: Request,
  res: Response
): Promise<void> {
  const { rows, returnMode }: { rows: any[]; returnMode?: ReturnMode } =
    req.body ?? {};
  const mode: ReturnMode =
    returnMode === "existing" || returnMode === "created" ? returnMode : "all";

  if (!Array.isArray(rows) || rows.length === 0) {
    res.status(400).json({
      ok: false,
      message: "Body must contain a non-empty 'rows' array.",
    });
    return;
  }

  const normalized: Array<{
    omschrijving: string;
    regio_id: string | null;
    xcoordinaat_rd: number | null;
    ycoordinaat_rd: number | null;
    latitude: number | null;
    longitude: number | null;
    vertrouwelijk: number | null;
    herhalen: number | null;
    user_id: string;
    activiteit_id: string | null;
    organisatie_id: string | null;
    specifiek_letten_op: string | null;
  }> = [];

  const seen = new Set<string>();
  const toNum = (v: any): number | null => {
    if (v === null || v === undefined || v === "") return null;
    const n =
      typeof v === "string" ? parseFloat(v.replace(",", ".")) : Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const to01 = (v: any): number | null => {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "boolean") return v ? 1 : 0;
    const s = String(v).trim().toLowerCase();
    if (s === "1" || s === "ja" || s === "true" || s === "yes") return 1;
    if (s === "0" || s === "nee" || s === "false" || s === "no") return 0;
    return null;
  };
  const toStr = (v: any): string | null => {
    const s = (v ?? "").toString().trim();
    return s.length ? s : null;
  };

  for (const r of rows) {
    const omschrijving = String(r?.omschrijving ?? "").trim();
    const user_id = String(r?.user_id ?? "").trim();
    if (!omschrijving || !user_id) continue;

    const key = omschrijving.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    normalized.push({
      omschrijving,
      regio_id: toStr(r?.regio_id),
      xcoordinaat_rd: toNum(r?.xcoordinaat_rd),
      ycoordinaat_rd: toNum(r?.ycoordinaat_rd),
      latitude: toNum(r?.latitude),
      longitude: toNum(r?.longitude),
      vertrouwelijk: to01(r?.vertrouwelijk),
      herhalen: to01(r?.herhalen),
      user_id,
      activiteit_id: toStr(r?.activiteit_id),
      organisatie_id: toStr(r?.organisatie_id),
      specifiek_letten_op: toStr(r?.specifiek_letten_op),
    });
  }

  if (normalized.length === 0) {
    res
      .status(400)
      .json({ ok: false, message: "No valid rows after normalization." });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const incomingOms = normalized.map((r) => r.omschrijving);
    const existingRes = await client.query(
      `SELECT id, omschrijving
       FROM lis.points
       WHERE omschrijving = ANY($1::text[])`,
      [incomingOms]
    );
    const existingMap = new Map<string, number>(
      existingRes.rows.map((r: { id: number; omschrijving: string }) => [
        r.omschrijving.toLowerCase(),
        r.id,
      ])
    );

    const toInsert = normalized.filter(
      (r) => !existingMap.has(r.omschrijving.toLowerCase())
    );

    let insertedMap = new Map<string, number>();
    if (toInsert.length > 0) {
      const cols = [...POINT_CORE_COLUMNS, "created_at"];
      const now = new Date();
      const valuesSql: string[] = [];
      const params: any[] = [];

      toInsert.forEach((r, i) => {
        const base = i * cols.length;
        valuesSql.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${
            base + 5
          }, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${
            base + 10
          }, $${base + 11}, $${base + 12}, $${base + 13})`
        );
        params.push(
          r.omschrijving,
          r.regio_id,
          r.xcoordinaat_rd,
          r.ycoordinaat_rd,
          r.latitude,
          r.longitude,
          r.vertrouwelijk,
          r.herhalen,
          r.user_id,
          r.activiteit_id,
          r.organisatie_id,
          r.specifiek_letten_op,
          now
        );
      });

      const insertedRes = await client.query(
        `
        INSERT INTO lis.points (
          ${cols.join(", ")}
        )
        VALUES ${valuesSql.join(", ")}
        RETURNING id, omschrijving
        `,
        params
      );
      for (const row of insertedRes.rows as Array<{
        id: number;
        omschrijving: string;
      }>) {
        insertedMap.set(row.omschrijving.toLowerCase(), row.id);
      }
    }

    const existingPoints = rows
      .map((raw: any) => {
        const omschrijving = String(raw?.omschrijving ?? "")
          .trim()
          .toLowerCase();
        const id = existingMap.get(omschrijving) ?? null;
        if (id == null) return null;
        return { ...raw, id };
      })
      .filter(Boolean) as Array<any & { id: number }>;

    const createdPoints = rows
      .map((raw: any) => {
        const omschrijving = String(raw?.omschrijving ?? "")
          .trim()
          .toLowerCase();
        const id = insertedMap.get(omschrijving) ?? null;
        if (id == null) return null;
        return { ...raw, id };
      })
      .filter(Boolean) as Array<any & { id: number }>;

    const points =
      mode === "existing"
        ? existingPoints
        : mode === "created"
        ? createdPoints
        : rows.map((raw: any) => {
            const omschrijving = String(raw?.omschrijving ?? "")
              .trim()
              .toLowerCase();
            const id =
              existingMap.get(omschrijving) ??
              insertedMap.get(omschrijving) ??
              null;
            return { ...raw, id };
          });

    await client.query("COMMIT");

    res.status(201).json({
      ok: true,
      created: createdPoints.length,
      existing: existingPoints.length,
      total: rows.length,
      points,
      createdPoints,
      existingPoints,
      message: "Import verwerkt.",
      returnMode: mode,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createPointFromImport error:", err);
    res.status(500).json({
      ok: false,
      message: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  } finally {
    client.release();
  }
}
