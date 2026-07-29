import { createGeometryGraphic } from "Components/HomePage/helpers/ArcGISHelpers/createGeometryGraphic";
import type { Geometry } from "hooks/features/useGeometriesStore";

export function buildGeometryMapGraphics(geometries: Geometry[]) {
  return geometries
    .map((geometry) =>
      createGeometryGraphic(geometry, {
        attributes: {
          organisatie: geometry.organisatie,
          vertrouwelijk: geometry.vertrouwelijk,
          herhalen: geometry.herhalen,
          activiteit: geometry.activiteit,
          specifiek_letten_op: geometry.specifiek_letten_op,
          regio_id: geometry.regio_id,
        },
      })
    )
    .filter(
      (graphic): graphic is NonNullable<typeof graphic> => graphic !== null
    );
}
