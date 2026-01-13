import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import useLogAction from "hooks/useLogAction";
import { FaInfoCircle } from "react-icons/fa";

export default function SearchedTab() {
  const { selectedBottomTab, setSelectedBottomTab } =
    useSelectedBottomTabState();

  const logAction = useLogAction();

  return (
    <>
      <button
        className={`
              px-3 flex items-center gap-x-3
            ${selectedBottomTab === "result" && "bg-white shadow"}
          `}
        onClick={() => {
          setSelectedBottomTab("searched");
          logAction({
            message: `User clicked on 'Searched Resultaten'`,
            step: "BottomTabs - SearchedTab",
          });
        }}
      >
        <FaInfoCircle className="size-6 text-blue-500" />
        <span className="text-xs capitalize font-semibold">
          Searched Resultaten
        </span>
      </button>
    </>
  );
}
