import Form from "./Form";
import PointsList from "./PointsList";
import { useViewPlanState } from "Components/HomePage/hooks/zustand/voorbereiding/useViewPlanState";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import PointsAdding from "./PointsAdding";
import { useViewPlanStepMap } from "./useViewPlanStepMap";

export default function Step2({
  vluchtnummer,
  setVluchtnummer,
  handleCancel,
  refetch,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
  handleCancel: () => void;
  refetch: () => void;
}) {
  const { clickedPoint, setClickedPoint, clickedGeometry, setClickedGeometry, setStep, selectedPlan } =
    useViewPlanState();
  const { selectTargetPoint, selectTargetGeometry } = useViewPlanStepMap({
    selectedPlan,
    clickedPoint,
    setClickedPoint,
    setClickedGeometry,
  });

  return (
    <ScrollButtonsLayout
      className="h-full"
      buttons={
        <Buttons
          vluchtnummer={vluchtnummer}
          handleCancel={handleCancel}
          refetch={refetch}
        />
      }
    >
      <div className="py-4 px-2 space-y-4">
        <Form vluchtnummer={vluchtnummer} setVluchtnummer={setVluchtnummer} />

        <PointsList
          clickedPoint={clickedPoint}
          clickedGeometry={clickedGeometry}
          selectTargetPoint={selectTargetPoint}
          selectTargetGeometry={selectTargetGeometry}
        />
      </div>

      <div className="h-[2px] bg-gray-200 my-4" />

      <PointsAdding setStep={setStep} />
    </ScrollButtonsLayout>
  );
}
