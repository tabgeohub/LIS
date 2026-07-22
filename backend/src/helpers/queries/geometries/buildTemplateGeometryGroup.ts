type RawPoint = Record<string, unknown> & {
  geometry_id?: number | null;
  geometry_type?: string | null;
  geometry_omschrijving?: string | null;
};

export function buildTemplateGeometryFromFullData(
  geometryId: number,
  fullGeometryData: Record<string, unknown>
) {
  return {
    id: geometryId,
    type: (fullGeometryData.type as string | null) ?? null,
    omschrijving: (fullGeometryData.omschrijving as string | null) ?? null,
    organisatie: fullGeometryData.organisatie,
    vertrouwelijk: fullGeometryData.vertrouwelijk,
    herhalen: fullGeometryData.herhalen,
    activiteit: fullGeometryData.activiteit,
    specifiek_letten_op: fullGeometryData.specifiek_letten_op,
    regio_id: fullGeometryData.regio_id,
    points: (fullGeometryData.points as Record<string, unknown>[]) ?? [],
  };
}

export function buildTemplateGeometryFallback(
  geometryId: number,
  point: RawPoint
) {
  return {
    id: geometryId,
    type: point.geometry_type ?? null,
    omschrijving: point.geometry_omschrijving ?? null,
    points: [],
  };
}

export function buildTemplateGeometryGroup(input: {
  point: RawPoint;
  geometryId: number;
  geometryDataMap: Map<number, Record<string, unknown>>;
}) {
  const fullGeometryData = input.geometryDataMap.get(input.geometryId);
  if (!fullGeometryData) {
    return buildTemplateGeometryFallback(input.geometryId, input.point);
  }
  return buildTemplateGeometryFromFullData(input.geometryId, fullGeometryData);
}
