import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import { ActionType } from "../..";
import Buttons from "./Buttons";
import FormElements from "./FormElements";
import { useFinishedPlansState } from "Components/Nabewerking/VluchtenZoeken/useFinishedPlansState";

export default function EditFlight({
  setAction,
}: {
  setAction: (action: ActionType) => void;
}) {
  const { selectedPlan } = useFinishedPlansState();

  if (!selectedPlan) return null;

  return (
    <ScrollButtonsLayout buttons={<Buttons setAction={setAction} />}>
      <div className="h-[100%] thin-scrollbar overflow-y-auto">
        <div className="form mt-4 space-y-2 pr-1">
          <FormElements />
        </div>
      </div>
    </ScrollButtonsLayout>
  );
}
