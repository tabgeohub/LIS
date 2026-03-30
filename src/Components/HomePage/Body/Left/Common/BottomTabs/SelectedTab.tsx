import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import {
  nabewerkingTabs,
  toolsTabs,
  voorbereidingTabs,
} from "Components/HomePage/Head/constants";
import useLogAction from "hooks/useLogAction";
import { IconType } from "react-icons";
import { TbFilterQuestion } from "react-icons/tb";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { useContent } from "hooks/useContent";

export default function SelectedTab() {
  const { selectedTab } = useTabState();
  const { selectedBottomTab, setSelectedBottomTab } =
    useSelectedBottomTabState();

  const logAction = useLogAction();
  const content = useContent();

  const selectedTabItem = [
    ...voorbereidingTabs,
    ...toolsTabs,
    ...nabewerkingTabs,
    {
      id: "timeslider",
      label: content.layout.pages.at(3)!,
      icon: FaMagnifyingGlassChart,
      disabled: false,
    },
    {
      id: "aandachtspuntenFilteren",
      label: "Aandachtspuntent filteren",
      icon: TbFilterQuestion,
      disabled: false,
    },
  ].find((item) => item.id === selectedTab);

  const IconComponent = selectedTabItem?.icon as IconType;
  const tabName = selectedTabItem?.label;

  return (
    <>
      {selectedTab !== "none" &&
        selectedBottomTab !== "viewSelectedPointDetails" && (
          <button
            className={`
              px-3 flex items-center gap-x-3
            ${selectedBottomTab === "topTabs" && "bg-white shadow"}
          `}
            onClick={() => {
              setSelectedBottomTab("topTabs");

              logAction({
                message: `User clicked on '${tabName}' in the 'SelectedTab' component`,
                step: "BottomTabs - SelectedTab",
              });
            }}
          >
            <IconComponent className="size-6 text-blue-500" />
            <span className="text-xs capitalize font-semibold">{tabName}</span>
          </button>
        )}
    </>
  );
}
