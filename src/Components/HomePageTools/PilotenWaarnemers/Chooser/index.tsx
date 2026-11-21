import { MdClose, MdFlight, MdVisibility } from "react-icons/md";
import { useTabState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import type { PilotenWaarnemersStep } from "..";

export default function Chooser({
  setStep,
}: {
  setStep: (value: PilotenWaarnemersStep) => void;
}) {
  const logAction = useLogAction();
  const content = useContent();
  const { setSelectedTab } = useTabState();
  const c = content.tools.pilotenWaarnemers.chooser;

  return (
    <div className="h-full py-2">
      <p className="text-[12px] border-b border-gray-200 px-2 pb-2">{c.text}</p>

      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="gray-button inline-flex items-center justify-center gap-1.5"
            onClick={() => {
              setStep("piloten");
              logAction({
                message: "User opened piloten editor",
                step: "PilotenWaarnemers - Chooser",
              });
            }}
          >
            <MdFlight className="text-[16px] shrink-0" />
            {c.editPiloten}
          </button>

          <button
            type="button"
            className="gray-button inline-flex items-center justify-center gap-1.5"
            onClick={() => {
              setStep("waarnemers");
              logAction({
                message: "User opened waarnemers editor",
                step: "PilotenWaarnemers - Chooser",
              });
            }}
          >
            <MdVisibility className="text-[16px] shrink-0" />
            {c.editWaarnemers}
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="gray-button inline-flex w-fit items-center justify-center gap-1.5"
            onClick={() => {
              setSelectedTab("none");
              logAction({
                message: "User cancelled piloten/waarnemers tool",
                step: "PilotenWaarnemers - Chooser",
              });
            }}
          >
            <MdClose className="text-[16px] shrink-0" />
            {content.common.annuleren}
          </button>
        </div>
      </div>
    </div>
  );
}
