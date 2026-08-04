import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import { useContent } from "hooks/useContent";
import { usePointsStore } from "hooks/features";
import { useMapViewState } from "hooks/zustand/ui";
import { useOpenTable } from "hooks/zustand/ui";
import { useUpdateData } from "api-hooks/mutations";
import { useViewPlanAddPointsState } from "../../../pickViewPlanAddPointsState";
import { buildSubmitSelectedPointsResult } from "./helpers/selectFromSourceGraphics";
import type { SelectFromSourceItem } from "./helpers/mapSourceItems";

export default function SelectFromSourceButtons({
  loading,
  selectedItem,
  setSelectedItem,
  selectedPointIds,
  update,
}: {
  loading: boolean;
  selectedItem: SelectFromSourceItem | null;
  setSelectedItem: (item: SelectFromSourceItem | null) => void;
  selectedPointIds: number[];
  update: ReturnType<typeof useUpdateData>["update"];
}) {
  const content = useContent();
  const viewPlan = useViewPlanAddPointsState();
  const { dbPoints } = usePointsStore();
  const { yellowGraphicsLayer } = useMapViewState();
  const { setPointsTable, setGeometriesTable } = useOpenTable();

  function handleSubmit() {
    const selectedPlan = viewPlan.selectedPlan;
    if (!selectedPlan || !selectedItem) return;

    const checkedPoints = selectedItem.points.filter((pt) =>
      selectedPointIds.includes(pt.id)
    );

    const result = buildSubmitSelectedPointsResult({
      selectedPlan,
      checkedPoints,
      dbPoints,
      filteredPlans: viewPlan.filteredPlans,
      yellowGraphicsLayer,
    });

    update({
      data: result.payload,
      onSuccess: () => {
        viewPlan.setSelectedPlan(result.updatedPlan);
        setPointsTable(result.updatedPoints);
        setGeometriesTable(selectedPlan.geometries || []);
        viewPlan.setFilteredPlans(result.updatedFilteredPlans);
        setSelectedItem(null);
        viewPlan.setStep(2);
      },
    });
  }

  if (loading) return null;

  if (!selectedItem) {
    return (
      <WizardButtonBar
        className=""
        buttons={[
          { label: content.common.vorige, onClick: () => viewPlan.setStep(2) },
        ]}
      />
    );
  }

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: content.common.vorige,
          onClick: () => setSelectedItem(null),
        },
        { label: content.common.opslaan, onClick: handleSubmit },
      ]}
    />
  );
}
