import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { findSpecificPoint } from "Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/helpers/findSpecificPoint";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { useCreateData } from "utils/useCreateData";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { useUpdateData } from "utils/useUpdateData";
import { EnrichedPointType } from "Types";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/HomePage/Body/Common/Wizard/wizardButtonBarClass";

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
  } = useEnrichedPointState();
  const { selectedPlan, setSelectedPlan, setStep } = useViewPlanState();
  const { create } = useCreateData("/points");
  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);
  const { pointsTable, setPointsTable, geometriesTable, setGeometriesTable } =
    useOpenTable();

  async function handleSubmit() {
    await create({
      data: {
        omschrijving,
        regio_id: user?.role,
        xcoordinaat_rd: xCoord,
        ycoordinaat_rd: yCoord,
        latitude,
        longitude,
        vertrouwelijk: vertrouwelijk ? 1 : 0,
        herhalen: herhalen ? 1 : 0,
        user_id: user?.user_id,
        activiteit_id: activiteit,
        organisatie_id: organisatie,
        specifiek_letten_op: specifiekLettenOp,
      },
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
