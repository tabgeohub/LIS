import { FaMinus, FaPlus } from "react-icons/fa6";
import useLogAction from "hooks/useLogAction";

export function ParentItemToggle({
  title,
  open,
  setOpen,
}: {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const logAction = useLogAction();
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
        logAction({
          message: `User ${open ? "closed" : "opened"} parent item '${title}'`,
          step: "Kaartlegende",
        });
      }}
      className="w-4 text-gray-500 mr-2"
    >
      {open ? <FaMinus /> : <FaPlus />}
    </button>
  );
}
