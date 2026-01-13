import { classNames } from "@helpers/classNames";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import useLogAction from "hooks/useLogAction";
import { FaInfoCircle } from "react-icons/fa";

export default function ResultTab() {
  const { selectedBottomTab, setSelectedBottomTab } =
    useSelectedBottomTabState();

  const logAction = useLogAction();

  return (
    <>
      <button
        className={classNames(
          "px-3 flex items-center gap-x-3",
          selectedBottomTab === "result" && "bg-white shadow"
        )}
        onClick={() => {
          setSelectedBottomTab("result");

          logAction({
            message: `User clicked on 'Resultaten'`,
            step: "BottomTabs - ResultTab",
          });
        }}
      >
        <FaInfoCircle className="size-6 text-blue-500" />
        <span className="text-xs capitalize font-semibold">Resultaten</span>
      </button>
    </>
  );
}
