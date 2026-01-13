import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import useLogAction from "hooks/useLogAction";

export const ParentItem = ({
  isDisabled = false,
  title,
  children,
  checked,
  setChecked,
}: {
  isDisabled?: boolean;
  title: string;
  children: React.ReactNode;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);

  const logAction = useLogAction();

  return (
    <div>
      <div
        className={`flex relative items-center justify-between border-b px-3 hover:bg-gray-100 transition-colors ${
          isDisabled ? "opacity-60 pointer-events-none" : "cursor-pointer"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);

            logAction({
              message: `User ${
                open ? "closed" : "opened"
              } parent item '${title}'`,
              step: "Kaartlegende",
            });
          }}
          className="w-4 text-gray-500 mr-2"
        >
          {open ? <FaMinus /> : <FaPlus />}
        </button>

        <label
          htmlFor={title}
          className="flex items-center cursor-pointer gap-2 py-2 w-full"
        >
          <input
            type="checkbox"
            id={title}
            disabled={isDisabled}
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);

              logAction({
                message: `User ${
                  e.target.checked ? "checked" : "unchecked"
                } parent item '${title}'`,
                step: "Kaartlegende",
              });
            }}
          />

          <span>{title}</span>
        </label>
      </div>

      {open && <>{children}</>}
    </div>
  );
};
