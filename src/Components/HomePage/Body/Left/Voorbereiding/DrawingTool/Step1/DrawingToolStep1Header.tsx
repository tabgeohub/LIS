import { motion } from "framer-motion";
import { TbPencil } from "react-icons/tb";

export function DrawingToolStep1Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-3"
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <TbPencil className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          Tekengereedschap
        </h3>
      </div>
      <p className="text-[12px] text-gray-600 leading-relaxed pl-10">
        Selecteer een type tekenhulpmiddel om vormen op de kaart te maken.
      </p>
    </motion.div>
  );
}
