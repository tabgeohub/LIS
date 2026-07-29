import { ReactNode } from "react";
import { IconType } from "react-icons";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import useLogAction from "hooks/useLogAction";

/** Shared bottom-tab button used by Kaartlagenlijst / Searched / Result tabs. */
export function BottomTabButton(props: {
  tabKey: string;
  label: ReactNode;
  Icon: IconType;
  logMessage: string;
  logStep: string;
  activeWhen?: (selectedBottomTab: string) => boolean;
}) {
  const { selectedBottomTab, setSelectedBottomTab } =
    useSelectedBottomTabState();
  const logAction = useLogAction();
  const isActive =
    props.activeWhen?.(selectedBottomTab) ??
    selectedBottomTab === props.tabKey;

  return (
    <button
      className={`
         px-3 flex items-center gap-x-3
        ${isActive && "bg-white shadow"}
      `}
      onClick={() => {
        setSelectedBottomTab(props.tabKey);
        logAction({
          message: props.logMessage,
          step: props.logStep,
        });
      }}
    >
      <props.Icon className="size-6 text-blue-500" />
      <span className="text-xs font-semibold">{props.label}</span>
    </button>
  );
}
