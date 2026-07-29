import { useAuth } from "hooks/zustand/ui/useAuth";
import { pages } from "../constants";
import { motion } from "framer-motion";
import Users from "../Users";
import Search from "../Search";
import { usePageSelection } from "./usePageSelection";

export default function Pages() {
  const { user } = useAuth();
  const { selectedPage, selectPage } = usePageSelection();

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
            onClick={() => selectPage(tab.value, tab.label)}
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
