import { useContent } from "hooks/useContent";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";

export default function NoneAction() {
  const { selectedPlan } = useFinishedPlansState();

  const content = useContent();

  return (
    <div className="text-[12px] space-y-2 text-gray-600">
      <p className="font-semibold text-gray-700">
        {selectedPlan?.omschrijving}
      </p>

      <p>{content.nabewerking.vluchtenZoeken.step2.hints.hint1}</p>

      <p>{content.nabewerking.vluchtenZoeken.step2.hints.hint2}</p>

      <p>{content.nabewerking.vluchtenZoeken.step2.hints.hint3}</p>

      <p>{content.nabewerking.vluchtenZoeken.step2.hints.hint4}</p>

      <p>{content.nabewerking.vluchtenZoeken.step2.hints.hint5}</p>
    </div>
  );
}
