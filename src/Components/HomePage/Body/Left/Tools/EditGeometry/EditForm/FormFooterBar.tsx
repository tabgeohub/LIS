import type { ReactNode } from "react";

export default function FormFooterBar({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex bg-white absolute left-0 bottom-0 items-center border-t border-gray-300 justify-end w-full gap-x-2 py-1.5 pr-3 pl-2 flex-wrap">
      {children}
    </div>
  );
}
