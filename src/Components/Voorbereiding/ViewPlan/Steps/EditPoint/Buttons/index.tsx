import Submit from "./Submit";
import { useViewPlanState } from "Components/Voorbereiding/ViewPlan/useViewPlanState";
import RemovePoint from "./RemovePoint";
import { useContent } from "hooks/useContent";
import type { EditPointDetailFields } from "./editPointDetailFields";

export default function Buttons(fields: EditPointDetailFields) {
  const { setStep } = useViewPlanState();

  const content = useContent();

  return (
    <div className="flex justify-end gap-x-1 text-[12px] mt-6 px-2">
      <button onClick={() => setStep(2)} className="gray-button">
        {content.common.vorige}
      </button>

      <Submit {...fields} />

      <RemovePoint />
    </div>
  );
}
