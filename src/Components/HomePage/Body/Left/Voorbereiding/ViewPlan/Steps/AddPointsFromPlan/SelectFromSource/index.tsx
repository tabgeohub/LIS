/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "hooks/zustand/ui/useAuth";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { filterPointsNotInPlan } from "./helpers/mapSourceItems";
import { useSelectFromSourceMapEffects } from "./useSelectFromSourceMapEffects";
import { useSelectFromSourceData } from "./useSelectFromSourceData";
import SelectFromSourceButtons from "./SelectFromSourceButtons";
import PlansList from "./PlansList";
import PointsList from "./PointsList";
import { useUpdateData } from "utils/useUpdateData";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import { usePointsStore } from "hooks/features/usePointsStore";

type Source = "flightPlans" | "templates";

export default function SelectFromSource({ source }: { source: Source }) {
  const { dbPoints } = usePointsStore();
  const {
    items,
    planPointIds,
    selectedItem,
    setSelectedItem,
    selectedPointIds,
    setSelectedPointIds,
    dataLoading,
  } = useSelectFromSourceData(source);

  useSelectFromSourceMapEffects({
    selectedItem,
    selectedPointIds,
    planPointIds,
    dbPoints,
  });

  const { update, loading } = useUpdateData(`/flightPlans/vluchtplans/points`);

  return (
    <ScrollButtonsLayout
      className="pt-16"
      buttons={
        <SelectFromSourceButtons
          loading={loading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          selectedPointIds={selectedPointIds}
          update={update}
        />
      }
    >
      <WizardLoadingOverlay show={dataLoading || loading} variant="stacked" />

      {!dataLoading && !loading && !selectedItem && (
        <PlansList
          items={items}
          onSelect={(id) => {
            const item = items.find((i) => i.id === id);
            if (!item) return;

            setSelectedItem({
              id: item.id,
              title: item.title,
              points: filterPointsNotInPlan(item.points, planPointIds),
            });
          }}
        />
      )}

      {!dataLoading && !loading && selectedItem && (
        <PointsList
          selectedItem={selectedItem}
          selectedPointIds={selectedPointIds}
          setSelectedPointIds={setSelectedPointIds}
        />
      )}
    </ScrollButtonsLayout>
  );
}
