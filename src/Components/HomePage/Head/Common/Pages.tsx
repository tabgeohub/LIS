import { useAuth } from "@helpers/ZustandStates/useAuth";
import { pages } from "../constants";
import { motion } from "framer-motion";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import Users from "../Users";
import Search from "../Search";
import useLogAction from "hooks/useLogAction";

export default function Pages() {
  const { selectedPage, selectedTab, setSelectedPage, setSelectedTab } =
    useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  const { user } = useAuth();

  const logAction = useLogAction();

  return (
    <div className="flex justify-between bg-gray-200 border-[1px] border-gray-300 w-[100%]">
      <div className="flex gap-x-4 px-2 pt-3 pb-0 items-end">
        {pages.map((tab) => (
          <motion.button
            disabled={user.user_id === 0 || user.role === undefined}
            key={tab.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ opacity: selectedPage === tab.value ? 1 : 0.6 }}
            onClick={() => {
              const leavingTimeSlider =
                selectedPage === "timeslider" && tab.value !== "timeslider";

              if (leavingTimeSlider) {
                setOpenSideBar(false);
                setSelectedTab("none");
                setSelectedBottomTab("Kaartlagenlijst");
              }

              setSelectedPage(tab.value);
              if (tab.value === "timeslider") {
                // Reuse existing left panel flow and content.
                if (selectedTab !== "timeslider") setSelectedTab("timeslider");
                setOpenSideBar(true);
              }

              logAction({ message: `User selected ${tab.label} page` });
            }}
            className={`relative px-4 py-1 border-[1px] ${
              selectedPage === tab.value && user.user_id !== 0
                ? "bg-gray-100 rounded-t-[5px] text-primary/75 border-gray-300 border-b-gray-100 -mb-[1px]"
                : "text-gray-400"
            }`}
          >
            {tab.new && (
              <span className="pointer-events-none absolute -top-2 right-1 z-10 rounded-full bg-primary px-1.5 py-px text-[8px] font-bold uppercase leading-tight text-white shadow-sm">
                new
              </span>
            )}
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-x-4 px-2">
        <Search />
        <Users />
      </div>
    </div>
  );
}
