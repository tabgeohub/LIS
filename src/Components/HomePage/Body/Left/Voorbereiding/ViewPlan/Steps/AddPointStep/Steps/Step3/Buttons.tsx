import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { findSpecificPoint } from "Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/helpers/findSpecificPoint";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { useCreateData } from "utils/useCreateData";
import { useViewPlanState } from "../../../../helpers/useViewPlanState";
import { useUpdateData } from "utils/useUpdateData";
import { useContent } from "hooks/useContent";
import { EnrichedPointType } from "Types";
import { useOpenTable } from "@helpers/ZustandStates/showTable";

export default function Buttons({
  handleCancel,
  resetFormAndState,
  setStepPoint,
  setStepAdd,
}: {
  handleCancel: () => void;
  resetFormAndState: () => void;
  setStepPoint: (value: number) => void;
  setStepAdd: (value: number) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { user } = useAuth();

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

  const { pointsTable, setPointsTable } = useOpenTable();

  async function handleSubmit() {
    await create(
      {
        omschrijving: omschrijving,
        regio_id: user?.role,
        xcoordinaat_rd: xCoord,
        ycoordinaat_rd: yCoord,
        latitude: latitude,
        longitude: longitude,
        vertrouwelijk: vertrouwelijk ? 1 : 0,
        herhalen: herhalen ? 1 : 0,
        user_id: user?.user_id,
        activiteit_id: activiteit,
        organisatie_id: organisatie,
        specifiek_letten_op: specifiekLettenOp,
      },
      (response) => {
        // @ts-ignore
        const newPoint: EnrichedPointType = response.point;

        const pointIds = selectedPlan?.points.map((p) => Number(p.id));

        if (newPoint) pointIds?.push(newPoint.id);

        const payload = {
          points: pointIds,
          id: selectedPlan?.id,
        };

        update(payload, () => {
          const oldPoints: EnrichedPointType[] = selectedPlan?.points || [];

          // @ts-ignore
          setSelectedPlan({
            ...selectedPlan,
            points: [...oldPoints, newPoint],
          });

          setPointsTable([...pointsTable, newPoint]);

          setStep(2);
          resetFormAndState();
        });

        redGraphicsLayer?.removeAll();
      }
    );
  }

  function handleBack() {
    if (currentPoint.x !== 0 && currentPoint.y !== 0) {
      const currentGraphicToRemove = findSpecificPoint(
        mapView,
        currentPoint.x,
        currentPoint.y
      );

      if (currentGraphicToRemove) {
        mapView?.graphics.remove(currentGraphicToRemove);
      }
    }

    const graphicToRemove = findSpecificPoint(mapView, xCoord, yCoord);

    if (graphicToRemove) {
      mapView?.graphics.remove(graphicToRemove);
    }

    resetFormAndState();
  }

  const content = useContent();

  return (
    <div className="flex justify-end gap-x-1 text-[12px] mt-6">
      <button onClick={handleBack} className="gray-button">
        {content.common.vorige}
      </button>

      <button onClick={() => setStepAdd(2)} className="gray-button">
        {content.common.update}
      </button>

      <button
        disabled={
          omschrijving === "" ||
          activiteit === "" ||
          organisatie === "" ||
          specifiekLettenOp === ""
        }
        onClick={handleSubmit}
        className="gray-button"
      >
        {content.common.opslaan}
      </button>

      <button onClick={handleCancel} className="gray-button">
        {content.common.annuleren}
      </button>
    </div>
  );
}
