import { EnrichedPointType, FlightPlanType } from "Types";
import { useUpdateData } from "utils/useUpdateData";

export default function Buttons({
  setStep,
  setFase,
  selectedPlan,
  pointsData,
}: {
  setStep: (value: number) => void;
  setFase: (value: string) => void;
  selectedPlan: FlightPlanType;
  pointsData: EnrichedPointType[];
}) {
  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);

  function handleSubmit() {
    const selectedIds = selectedPlan?.points?.map((p) => p.id) || [];
    const dataIds = pointsData.map((p) => p.id);

    const mergedIds = Array.from(new Set([...selectedIds, ...dataIds]));

    update(
      {
        points: mergedIds,
        id: selectedPlan?.id,
      },
      () => {
        setStep(1);
        setFase("all");
      }
    );
  }
  return (
    <div className="flex justify-end mt-4 gap-x-2 px-2">
      <button className="gray-button" onClick={handleSubmit}>
        Toevoegen
      </button>
      <button className="gray-button" onClick={() => setFase("all")}>
        Annuleren
      </button>
    </div>
  );
}
