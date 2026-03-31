/** Geometries have no pointPlanImages API yet; keep accordion useful without a second backend route. */
export default function SelectedPlanGeometryAccordionPlaceholder() {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold text-gray-700">Afbeeldingen</p>
      <p className="text-[11px] text-gray-500">
        Afbeeldingen per punt in deze geometrie kunnen later worden toegevoegd.
      </p>
    </div>
  );
}
