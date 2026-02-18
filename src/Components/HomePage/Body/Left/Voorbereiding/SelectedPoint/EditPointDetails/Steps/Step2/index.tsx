import { useFormikContext } from "formik";
import { useState } from "react";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import Step2Sub1 from "./Step2Sub1";
import Step2Sub2 from "./Step2Sub2";
import { useUpdateData } from "utils/useUpdateData";
import { EnrichedPointType } from "Types";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Step2({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const { clickedPointId, clickedPoint, setCreateNewPoint } = usePopUpState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  const [subStep, setSubStep] = useState(1);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const { update, loading } = useUpdateData(`/points/${clickedPoint?.id}`);
  const { fetchDBPoints, fetchPoints } = usePointsStore();

  const { values } = useFormikContext<EnrichedPointType>();
  const { redGraphicsLayer, mapView } = useMapViewState();

  const { user } = useAuth();

  async function handleSubmit() {
    if (!clickedPointId) return;

    const attributes = {
      omschrijving: values.omschrijving,
      regio_id: values.regio_id,
      xcoordinaat_rd: values.xcoordinaat_rd,
      ycoordinaat_rd: values.ycoordinaat_rd,
      latitude: values.latitude,
      longitude: values.longitude,
      vertrouwelijk: values.vertrouwelijk,
      herhalen: values.herhalen,
      user_id: values.user_id,
      activiteit_id: values.activiteit_id,
      organisatie_id: values.organisatie_id,
      specifiek_letten_op: values.specifiek_letten_op,
      datum: values.created_at,
      id: values.id,
    };

    update(attributes, async (responseData) => {
      if (!responseData.result) return;
      // Remove temp red point
      redGraphicsLayer?.removeAll();

      mapView?.graphics.removeAll();

      await fetchDBPoints({
        regio: user?.role,
      });

      await fetchPoints({
        regio: user?.role,
      });

      // Exit geometry-edit mode and go back to details
      setCreateNewPoint(false);
      setSelectedBottomTab("viewSelectedPointDetails");
    });
  }

  return (
    <div className="p-2">
      {subStep === 1 && (
        <Step2Sub1
          subStep={subStep}
          setStep={setStep}
          setSubStep={setSubStep}
          isLoading={loading}
          handleSubmit={handleSubmit}
          currentPoint={currentPoint}
          setCurrentPoint={setCurrentPoint}
        />
      )}

      {subStep === 2 && (
        <Step2Sub2 handleSubmit={handleSubmit} setSubStep={setSubStep} />
      )}
    </div>
  );
}
