/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";
import { useTemplateFlights } from "api-hooks/templateFlights";
import { useContent } from "hooks/useContent";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import PlansList from "./PlansList";
import PointsList from "./PointsList";
import { useUpdateData } from "utils/useUpdateData";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  buildPlanPointIdSet,
  filterPointsNotInPlan,
  mapSourceToItems,
  SelectFromSourceItem,
} from "./helpers/mapSourceItems";
import { buildSubmitSelectedPointsResult } from "./helpers/selectFromSourceGraphics";
import { useSelectFromSourceMapEffects } from "./useSelectFromSourceMapEffects";

type Source = "flightPlans" | "templates";

export default function SelectFromSource({ source }: { source: Source }) {
  const { user } = useAuth();
  const { selectedPlan } = useViewPlanState();
  const { dbPoints } = usePointsStore();
  const { data: flightPlansData, isPending: flightPlansPending } =
    useFlightPlansList({
      regioId: user.role,
      userId: user.user_id,
      enabled: source === "flightPlans",
    });
  const { data: templateData, isPending: templatePending } = useTemplateFlights({
    regioId: user.role,
    userId: user.user_id,
    enabled: source === "templates",
  });

  const data =
    source === "flightPlans" ? flightPlansData ?? EMPTY_FLIGHT_PLANS : templateData;
  const dataLoading =
    source === "flightPlans" ? flightPlansPending : templatePending;

  const items = useMemo(() => mapSourceToItems(source, data), [data, source]);
  const planPointIds = useMemo(
    () => buildPlanPointIdSet(selectedPlan?.points),
    [selectedPlan?.points]
  );

  const [selectedItem, setSelectedItem] = useState<SelectFromSourceItem | null>(null);
  const [selectedPointIds, setSelectedPointIds] = useState<number[]>([]);

  useEffect(() => {
    if (!selectedItem) {
      setSelectedPointIds([]);
      return;
    }
    setSelectedPointIds(
      filterPointsNotInPlan(selectedItem.points, planPointIds).map((p) => p.id)
    );
  }, [selectedItem, planPointIds]);

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
        <Buttons
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

function Buttons({
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

    update(result.payload, () => {
      setSelectedPlan(result.updatedPlan);
      setPointsTable(result.updatedPoints);
      setGeometriesTable(selectedPlan.geometries || []);
      setFilteredPlans(result.updatedFilteredPlans);
      setSelectedItem(null);
      setStep(2);
    });
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
