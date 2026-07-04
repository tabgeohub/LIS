import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useContent } from "hooks/useContent";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useUpdateData } from "utils/useUpdateData";
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
  const {
    selectedPlan,
    setSelectedPlan,
    setStep,
    filteredPlans,
    setFilteredPlans,
  } = useViewPlanState();
  const { dbPoints } = usePointsStore();
  const { yellowGraphicsLayer } = useMapViewState();
  const { setPointsTable, setGeometriesTable } = useOpenTable();

  function handleSubmit() {
    if (!selectedPlan || !selectedItem) return;

    const checkedPoints = selectedItem.points.filter((pt) =>
      selectedPointIds.includes(pt.id)
    );

    const result = buildSubmitSelectedPointsResult({
      selectedPlan,
      checkedPoints,
      dbPoints,
      filteredPlans,
      yellowGraphicsLayer,
    });

    update({ data: result.payload, onSuccess: () => {
      setSelectedPlan(result.updatedPlan);
      setPointsTable(result.updatedPoints);
      setGeometriesTable(selectedPlan.geometries || []);
      setFilteredPlans(result.updatedFilteredPlans);
      setSelectedItem(null);
      setStep(2);
    },});
  }

  if (loading) return null;

  if (!selectedItem) {
    return (
      <WizardButtonBar
        className=""
        buttons={[{ label: content.common.vorige, onClick: () => setStep(2) }]}
      />
    );
  }

  return (
    <WizardButtonBar
      className=""
      buttons={[
        { label: content.common.vorige, onClick: () => setSelectedItem(null) },
        { label: content.common.opslaan, onClick: handleSubmit },
      ]}
    />
  );
}
