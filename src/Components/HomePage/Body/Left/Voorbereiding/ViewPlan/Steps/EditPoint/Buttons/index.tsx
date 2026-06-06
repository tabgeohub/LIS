import Submit from "./Submit";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import RemovePoint from "./RemovePoint";
import { useContent } from "hooks/useContent";

export default function Buttons({
  omschrijving,
  activiteit,
  organisatie,
  specifiekLettenOp,
}: {
  omschrijving: string;
  activiteit: string;
  organisatie: string;
  specifiekLettenOp: string;
}) {
  const { setStep } = useViewPlanState();

  const content = useContent();

  return (
    <div className="flex justify-end gap-x-1 text-[12px] mt-6 px-2">
      <button onClick={() => setStep(2)} className="gray-button">
        {content.common.vorige}
      </button>

      <Submit
        omschrijving={omschrijving}
        activiteit={activiteit}
        organisatie={organisatie}
        specifiekLettenOp={specifiekLettenOp}
      />

      <RemovePoint />
    </div>
  );
}
