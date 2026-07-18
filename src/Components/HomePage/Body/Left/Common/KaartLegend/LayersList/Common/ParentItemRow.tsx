export function ParentItemRow({
  isDisabled,
  children,
}: {
  isDisabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex relative items-center justify-between border-b px-3 hover:bg-gray-100 transition-colors ${
        isDisabled ? "opacity-60 pointer-events-none" : "cursor-pointer"
      }`}
    >
      {children}
    </div>
  );
}
