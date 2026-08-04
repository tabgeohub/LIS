import { useFormikContext } from "formik";
import { useState } from "react";
import { usePopUpState } from "hooks/zustand/ui";
import Step2Sub1 from "./Step2Sub1";
import Step2Sub2 from "./Step2Sub2";
import { useUpdateData } from "api-hooks/mutations";
import { EnrichedPointType } from "Types";
import { useFetchInitialFeatures } from "hooks/features/useFetchInitialFeatures";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { useMapViewState } from "hooks/zustand/ui";
import { useAuth } from "hooks/zustand/ui";
import { buildPointUpdatePayload } from "Components/HomePage/helpers/points/buildPointUpdatePayload";

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
  const { fetchInitialFeatures } = useFetchInitialFeatures();

  const { values } = useFormikContext<EnrichedPointType>();
  const { redGraphicsLayer, mapView } = useMapViewState();

  const { user } = useAuth();

  async function handleSubmit() {
    if (!clickedPointId) return;

    const attributes = buildPointUpdatePayload({
      fields: values,
      id: values.id,
      created_at: values.created_at,
    });

    update({
      data: attributes,
      onSuccess: async (responseData) => {
        if (!responseData.result) return;
        redGraphicsLayer?.removeAll();

        mapView?.graphics.removeAll();

        await fetchInitialFeatures(user?.role);

        setCreateNewPoint(false);
        setSelectedBottomTab("viewSelectedPointDetails");
      },
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
