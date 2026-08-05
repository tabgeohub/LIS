import type { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

type ConfirmModalChromeProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions: ReactNode;
  className?: string;
};

/** Shared title / divider / action-row chrome for confirm dialogs. */
export default function ConfirmModalChrome({
  title,
  onClose,
  children,
  actions,
  className = "",
}: ConfirmModalChromeProps) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center px-2 py-2">
        <p />
        <p className="text-gray-500 text-[16px]">{title}</p>
        <button type="button" onClick={onClose} aria-label="Close">
          <IoMdClose className="text-gray-500 text-lg" />
        </button>
      </div>
      <div className="w-full h-0.5 bg-gray-300" />
      <div className="py-2 px-3">
        {children}
        <div className="flex justify-end mt-6 gap-x-2">{actions}</div>
      </div>
    </div>
  );
}
