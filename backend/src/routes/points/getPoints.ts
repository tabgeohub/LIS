import { Request, Response } from "express";
import { pool } from "../../db";

export async function getPoints(req: Request, res: Response) {
  try {
    const {
      naamAandachtspunt,
      activiteit,
      organisatie,
      van,
      tot,
      herhalen,
      regio,
      status,
    } = req.query;

    let query = "SELECT * FROM lis.points";
    const params: any[] = [];
    const conditions: string[] = [];

    // herhalen (numeric)
    if (herhalen !== undefined) {
      params.push(Number(herhalen));
      conditions.push(`herhalen = $${params.length}`);
    }

    // omschrijving (ILIKE already case-insensitive, but use lower for consistency)
    if (naamAandachtspunt !== undefined) {
      params.push(`%${String(naamAandachtspunt).trim().toLowerCase()}%`);
      conditions.push(`LOWER(omschrijving) LIKE $${params.length}`);
    }

    // activiteit_id
    if (activiteit !== undefined) {
      params.push(String(activiteit).toLowerCase());
      conditions.push(`LOWER(activiteit_id) = $${params.length}`);
    }

    // organisatie_id
    if (organisatie !== undefined) {
      params.push(String(organisatie).toLowerCase());
      conditions.push(`LOWER(organisatie_id) = $${params.length}`);
    }

    // created_at date range
    if (van !== undefined && tot !== undefined) {
      params.push(van);
      conditions.push(`created_at::date >= $${params.length}`);
      params.push(tot);
      conditions.push(`created_at::date <= $${params.length}`);
    } else if (van !== undefined) {
      params.push(van);
      conditions.push(`created_at::date >= $${params.length}`);
    } else if (tot !== undefined) {
      params.push(tot);
      conditions.push(`created_at::date <= $${params.length}`);
    }

    // regio_id (skip when admin)
    if (regio !== undefined && regio !== "admin") {
      params.push(String(regio).toLowerCase());
      conditions.push(`LOWER(regio_id) = $${params.length}`);
    }

    // status filter: accept single value or comma-separated list. Omit when 'all' or missing
    if (status !== undefined) {
      const raw = Array.isArray(status)
        ? status.join(",")
        : String(status).trim();
      if (raw.toLowerCase() !== "all" && raw.length > 0) {
        const statusList = raw
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        if (statusList.length > 0) {
          params.push(statusList);
          conditions.push(`status = ANY($${params.length})`);
        }
      }
    }

    // apply conditions
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));

    res.status(500).json({
      error: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
