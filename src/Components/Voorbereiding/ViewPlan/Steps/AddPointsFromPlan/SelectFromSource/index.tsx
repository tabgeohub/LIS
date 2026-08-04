/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "hooks/zustand/ui";
import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import { filterPointsNotInPlan } from "./helpers/mapSourceItems";
import { useSelectFromSourceMapEffects } from "./useSelectFromSourceMapEffects";
import { useSelectFromSourceData } from "./useSelectFromSourceData";
import SelectFromSourceButtons from "./SelectFromSourceButtons";
import PlansList from "./PlansList";
import PointsList from "./PointsList";
import { useUpdateData } from "api-hooks/mutations";
import WizardLoadingOverlay from "Components/Common/Wizard/WizardLoadingOverlay";
import { usePointsStore } from "hooks/features";

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
