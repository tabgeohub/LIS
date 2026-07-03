import SelectedPlanImagesPanel from "./SelectedPlanImagesPanel";
import { useGeometryPlanImages } from "../Common/useGeometryPlanImages";

export default function SelectedPlanGeometryImagesPanel({
  geometryId,
  planIds,
  regioId,
  isOpen,
}: {
  geometryId: number;
  planIds: number[];
  regioId: string | undefined;
  isOpen: boolean;
}) {
  const { images, loading, error } = useGeometryPlanImages({
    geometryId,
    planIds,
    regioId,
    enabled: isOpen,
  });

  return (
    <SelectedPlanImagesPanel
      images={images}
      loading={loading}
      error={error}
      emptyMessage="Geen afbeeldingen voor deze geometrie in de geselecteerde plannen."
    />
  );
}
