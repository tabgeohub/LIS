import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import useLogAction from "hooks/useLogAction";
import { FaLayerGroup } from "react-icons/fa6";

export default function KaartlagenlijstTab() {
  const { selectedBottomTab, setSelectedBottomTab } =
    useSelectedBottomTabState();

  const logAction = useLogAction();

  return (
    <button
      className={`
         px-3 flex items-center gap-x-3
        ${selectedBottomTab === "Kaartlagenlijst" && "bg-white shadow"}
      `}
      onClick={() => {
        setSelectedBottomTab("Kaartlagenlijst");

        logAction({
          message: `User clicked on 'KaartlagenlijstTab' in the 'BottomTabs' component`,
          step: "BottomTabs",
        });
      }}
    >
      <FaLayerGroup className="size-6 text-blue-500" />
      <span className="text-xs font-semibold">Kaartlagenlijst</span>
    </button>
  );
}
