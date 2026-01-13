import { motion } from "framer-motion";
import useLogAction from "hooks/useLogAction";
import { FaChevronLeft } from "react-icons/fa6";

export default function ChevronButton({
  setOpenSideBar,
  openSideBar,
}: {
  setOpenSideBar: (value: boolean) => void;
  openSideBar: boolean;
}) {
  const logAction = useLogAction();

  return (
    <button
      className="absolute top-0 left-0 z-10 bg-gray-100 p-2 rounded-br border border-gray-100 shadow-md text-gray-500 group transition-all duration-300"
      onClick={() => {
        setOpenSideBar(!openSideBar);
        logAction({
          message: `User clicked on 'ChevronButton' to set openSideBar to ${
            openSideBar ? "closed" : "open"
          }`,
        });
      }}
    >
      <motion.p
        initial={{ rotate: 0 }}
        animate={{ rotate: openSideBar ? 0 : 180 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <FaChevronLeft className="group-hover:scale-110 transition-all duration-300" />
      </motion.p>
    </button>
  );
}
