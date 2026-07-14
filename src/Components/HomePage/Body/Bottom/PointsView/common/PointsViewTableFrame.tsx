import type { ReactNode } from "react";

export function PointsViewTableFrame({
  containerHeight,
  children,
}: {
  containerHeight?: number;
  children: ReactNode;
}) {
  return (
    <div
      className="w-max min-w-full"
      style={{
        minHeight:
          typeof containerHeight === "number"
            ? `${containerHeight}px`
            : undefined,
      }}
    >
      <table className="min-w-max text-[11px] text-left rtl:text-right text-gray-500 border-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        {children}
      </table>
    </div>
  );
}
