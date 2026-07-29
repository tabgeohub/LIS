import { useMapViewState } from "hooks/zustand/ui";
import { useAuth } from "hooks/zustand/ui";
import { findSpecificPoint } from "Components/Voorbereiding/EnrichedAddPoint/helpers/findSpecificPoint";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { useCreateData } from "api-hooks/mutations";
import { useViewPlanState } from "Components/HomePage/hooks/zustand/voorbereiding/useViewPlanState";
import { useUpdateData } from "api-hooks/mutations";
import { EnrichedPointType } from "Types";
import { useOpenTable } from "hooks/zustand/ui";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/HomePage/Body/Common/Wizard/wizardButtonBarClass";
import { buildCreatePointPayload } from "Components/Voorbereiding/EnrichedAddPoint/helpers/buildCreatePointPayload";

export default function Buttons({
  handleCancel,
  resetFormAndState,
  setStepAdd,
}: {
  handleCancel: () => void;
  resetFormAndState: () => void;
  setStepPoint: (value: number) => void;
  setStepAdd: (value: number) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { user } = useAuth();
  const { labels } = useWizardButtons("View plan - Add point step 3");
  const pointState = useEnrichedPointState();
  const {
    omschrijving,
    activiteit,
    organisatie,
    specifiekLettenOp,
    xCoord,
    yCoord,
    currentPoint,
    latitude,
    longitude,
    vertrouwelijk,
    herhalen,
  } = pointState;
  const { selectedPlan, setSelectedPlan, setStep } = useViewPlanState();
  const { create } = useCreateData("/points");
  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);
  const { pointsTable, setPointsTable, geometriesTable, setGeometriesTable } =
    useOpenTable();

  async function handleSubmit() {
    await create({
      data: buildCreatePointPayload({ point: pointState, user }),
      onSuccess: (response) => {
        const newPoint: EnrichedPointType = (response as { point: EnrichedPointType })
          .point;
        const pointIds = selectedPlan?.points.map((p) => Number(p.id));
        if (newPoint) pointIds?.push(newPoint.id);

        update({
          data: { points: pointIds, id: selectedPlan?.id },
          onSuccess: () => {
            const oldPoints: EnrichedPointType[] = selectedPlan?.points || [];
            // @ts-ignore
            setSelectedPlan({
              ...selectedPlan,
              points: [...oldPoints, newPoint],
            });
            setPointsTable([...pointsTable, newPoint]);
            setGeometriesTable(geometriesTable);
            setStep(2);
            resetFormAndState();
          },
        });
        redGraphicsLayer?.removeAll();
      },
    });
  }

  function handleBack() {
    if (currentPoint.x !== 0 && currentPoint.y !== 0) {
      const currentGraphicToRemove = findSpecificPoint({
        mapView,
        x: currentPoint.x,
        y: currentPoint.y,
      });
      if (currentGraphicToRemove) mapView?.graphics.remove(currentGraphicToRemove);
    }

    const graphicToRemove = findSpecificPoint({ mapView, x: xCoord, y: yCoord });
    if (graphicToRemove) mapView?.graphics.remove(graphicToRemove);
    resetFormAndState();
  }

  return (
    <WizardButtonBar
      className={WIZARD_BUTTON_BAR_CLASS}
      buttons={[
        { label: labels.vorige, onClick: handleBack },
        { label: labels.update, onClick: () => setStepAdd(2) },
        {
          label: labels.opslaan,
          onClick: handleSubmit,
          disabled:
            omschrijving === "" ||
            activiteit === "" ||
            organisatie === "" ||
            specifiekLettenOp === "",
        },
        { label: labels.annuleren, onClick: handleCancel },
      ]}
    />
  );
}
