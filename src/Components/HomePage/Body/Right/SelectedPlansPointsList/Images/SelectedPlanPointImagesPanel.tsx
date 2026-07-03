import SelectedPlanImagesPanel from "./SelectedPlanImagesPanel";
import { usePointPlanImages } from "../Common/usePointPlanImages";

export default function SelectedPlanPointImagesPanel({
  pointId,
  planIds,
  regioId,
  isOpen,
}: {
  pointId: number;
  planIds: number[];
  regioId: string | undefined;
  isOpen: boolean;
}) {
  const { images, loading, error } = usePointPlanImages({
    pointId,
    planIds,
    regioId,
    enabled: isOpen,
  });

  return (
    <SelectedPlanImagesPanel
      images={images}
      loading={loading}
      error={error}
      emptyMessage="Geen afbeeldingen voor dit punt in de geselecteerde plannen."
    />
  );
}
