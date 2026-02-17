import { motion, AnimatePresence } from "framer-motion";
import { TbInfoCircle, TbMouse, TbClick } from "react-icons/tb";
import { classNames } from "@helpers/classNames";

export default function Text({
  selectedTool,
}: {
  selectedTool: "line" | "polygon" | null;
}) {
  const getToolLabel = (tool: "line" | "polygon") => {
    return tool === "line" ? "lijn" : "veelhoek";
  };

  return (
    <AnimatePresence>
      {selectedTool && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-4 overflow-hidden"
        >
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {/* Main Icon */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
                  <TbInfoCircle className="h-5 w-5 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    Tekengereedschap:{" "}
                    <span className="font-bold capitalize text-primary">
                      {getToolLabel(selectedTool)}
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-2 text-xs text-gray-700"
                  >
                    <TbMouse className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary/70" />
                    <span>
                      Klik op de kaart om te tekenen. Klik opnieuw op de knop om te annuleren.
                    </span>
                  </motion.div>

                  {(selectedTool === "polygon" || selectedTool === "line") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, delay: 0.15 }}
                      className={classNames(
                        "flex items-start gap-2 rounded-lg bg-primary/15",
                        "px-3 py-2 text-xs text-gray-800 border border-primary/20"
                      )}
                    >
                      <TbClick className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="font-medium">
                        Dubbelklik om het tekenen te voltooien.
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
