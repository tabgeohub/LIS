import { AnimatePresence, motion } from "framer-motion";

export default function ModalContainer({
  openModal,
  children,
}: {
  openModal: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {openModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 left-10 z-10 min-w-[350px] max-w-[450px] bg-gray-100 py-2 px-4 rounded rounded-br border border-gray-300 shadow-md text-gray-500 group transition-all duration-300"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
