import { useTabState } from "@helpers/ZustandStates/tabState";
import { AnimatePresence, motion } from "framer-motion";
import HeadButtonsVoorbereiding from "../HeadButtonsVoorbereiding";
import HeadButtonsTools from "../HeadButtonsTools";
import HeadButtonsNabewerking from "../HeadButtonsNabewerking";
import HeadButtonsTimeslider from "../HeadButtonsTimeslider";

export default function HeaderButtons() {
  const { selectedPage } = useTabState();

  return (
    <AnimatePresence>
      <div className="w-[100%]">
        <div className="bg-gray-100 p-1">
          {selectedPage === "voorbereiding" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeadButtonsVoorbereiding />
            </motion.div>
          )}

          {selectedPage === "tools" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeadButtonsTools />
            </motion.div>
          )}

          {selectedPage === "nabewerking" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeadButtonsNabewerking />
            </motion.div>
          )}

          {selectedPage === "timeslider" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeadButtonsTimeslider />
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
