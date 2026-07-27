export type PointsListFilters = {
  naamAandachtspunt?: unknown;
  activiteit?: unknown;
  organisatie?: unknown;
  van?: unknown;
  tot?: unknown;
  herhalen?: unknown;
  status?: unknown;
  hasGeometry?: unknown;
  regio?: string | undefined;
};

type QueryBuildResult = {
  sql: string;
  params: unknown[];
};

function normalizeStatusList(value: unknown): string[] {
  const raw = Array.isArray(value) ? value.join(",") : String(value).trim();
  if (raw.toLowerCase() === "all") return [];
  if (raw.length === 0) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

class PointsFilterBuilder {
  private readonly conditions: string[] = [];
  private readonly params: unknown[] = [];

  private pushParam(sql: string, value: unknown) {
    this.params.push(value);
    this.conditions.push(sql.replace("$idx", `$${this.params.length}`));
  }

  addHasGeometry(value: unknown) {
    if (value === "true") this.conditions.push("geometry_id IS NOT NULL");
    else if (value === "false") this.conditions.push("geometry_id IS NULL");
  }

  addHerhalen(value: unknown) {
    if (value === undefined) return;
    this.pushParam("herhalen = $idx", Number(value));
  }

  addOmschrijving(value: unknown) {
    if (value === undefined) return;
    this.pushParam(
      "LOWER(omschrijving) LIKE $idx",
      `%${String(value).trim().toLowerCase()}%`
    );
  }

  addActiviteit(value: unknown) {
    if (value === undefined) return;
    this.pushParam("LOWER(activiteit_id) = $idx", String(value).toLowerCase());
  }

  addOrganisatie(value: unknown) {
    if (value === undefined) return;
    this.pushParam("LOWER(organisatie_id) = $idx", String(value).toLowerCase());
  }

  addDateRange(van: unknown, tot: unknown) {
    if (van !== undefined && tot !== undefined) {
      this.pushParam("created_at::date >= $idx", van);
      this.pushParam("created_at::date <= $idx", tot);
      return;
    }
    if (van !== undefined) this.pushParam("created_at::date >= $idx", van);
    if (tot !== undefined) this.pushParam("created_at::date <= $idx", tot);
  }

  addRegio(regio: string | undefined) {
    if (regio === undefined || regio === "admin") return;
    this.pushParam("LOWER(regio_id) = $idx", String(regio).toLowerCase());
  }

  addStatus(value: unknown) {
    if (value === undefined) return;

    const statusList = normalizeStatusList(value);
    if (statusList.length > 0) {
      this.pushParam("status = ANY($idx)", statusList);
    }
  }

  build(): QueryBuildResult {
    let sql = "SELECT * FROM lis.points";
    if (this.conditions.length > 0) {
      sql += " WHERE " + this.conditions.join(" AND ");
    }
    sql += " ORDER BY id DESC";
    return { sql, params: this.params };
  }
}

export function buildPointsListQuery(filters: PointsListFilters): QueryBuildResult {
  const builder = new PointsFilterBuilder();
  builder.addHasGeometry(filters.hasGeometry);
  builder.addHerhalen(filters.herhalen);
  builder.addOmschrijving(filters.naamAandachtspunt);
  builder.addActiviteit(filters.activiteit);
  builder.addOrganisatie(filters.organisatie);
  builder.addDateRange(filters.van, filters.tot);
  builder.addRegio(filters.regio);
  builder.addStatus(filters.status);
  return builder.build();
}
