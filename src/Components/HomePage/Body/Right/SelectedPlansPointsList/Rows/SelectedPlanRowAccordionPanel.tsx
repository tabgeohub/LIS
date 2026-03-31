export default function SelectedPlanRowAccordionPanel({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden border-gray-100 bg-gray-50/90 transition-[max-height,opacity] duration-300 ease-in-out ${
        open ? "max-h-[560px] border-t opacity-100" : "max-h-0 border-t-0 opacity-0"
      }`}
    >
      <div className="px-3 pb-3 pt-2">{children}</div>
    </div>
  );
}
