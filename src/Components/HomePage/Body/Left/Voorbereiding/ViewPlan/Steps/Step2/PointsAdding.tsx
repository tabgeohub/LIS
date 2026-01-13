import { useContent } from "hooks/useContent";

export default function PointsAdding({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const content = useContent();
  return (
    <>
      <p className="text-sm font-bold text-black pl-2">Punten toevoegen</p>

      <div className="space-y-2 px-2 mt-4">
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2 hover:bg-gray-100">
          <p className="text-[13px] font-semibold text-gray-700">
            {content.voorbereiding.step2.actions.createNewPoint.label}
          </p>
          <button className="gray-button" onClick={() => setStep(4)}>
            {content.voorbereiding.step2.actions.createNewPoint.button}
          </button>
        </div>

        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2 hover:bg-gray-100">
          <p className="text-[13px] font-semibold text-gray-700">
            {content.voorbereiding.addPointsFromPlan.cta}
          </p>
          <button className="gray-button" onClick={() => setStep(6)}>
            {content.voorbereiding.step2.actions.addFromPlan.button}
          </button>
        </div>

        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2 hover:bg-gray-100">
          <p className="text-[13px] font-semibold text-gray-700">
            {content.voorbereiding.step2.actions.addToPlan.label}
          </p>
          <button className="gray-button" onClick={() => setStep(7)}>
            {content.voorbereiding.step2.actions.addToPlan.button}
          </button>
        </div>
      </div>
    </>
  );
}
