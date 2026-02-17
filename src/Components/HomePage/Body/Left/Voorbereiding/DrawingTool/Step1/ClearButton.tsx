import { motion } from "framer-motion";
import { TbTrash } from "react-icons/tb";
import { classNames } from "@helpers/classNames";

interface ClearButtonProps {
  onClear: () => void;
  hasGraphics: boolean;
}

export default function ClearButton({ onClear, hasGraphics }: ClearButtonProps) {

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClear}
      disabled={!hasGraphics}
      className={classNames(
        "flex items-center justify-center gap-1.5",
        "px-3 py-2 rounded",
        "text-xs font-semibold",
        "transition-all duration-200",
        "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg cursor-pointer",
        !hasGraphics && "opacity-50 cursor-not-allowed"
      )}
      title={"Alle tekeningen wissen"}
    >
      <TbTrash className="h-3.5 w-3.5" />
      <span>Alles wissen</span>
    </motion.button>
  );
}
