import { classNames } from "@helpers/classNames";

export default function ScrollButtonsLayout({
  children,
  buttons,
  setFilterTerm,
  className,
}: {
  children: React.ReactNode;
  buttons: React.ReactNode;
  setFilterTerm?: (value: string) => void;
  className?: string;
}) {
  function handleFilter(value: string) {
    if (setFilterTerm) {
      setFilterTerm(value);
    }
  }

  return (
    <div className={classNames("h-full", className)}>
      <div className="h-full">
        {setFilterTerm && (
          <div>
            <div className="pb-1.5 px-1">
              <input
                placeholder="Filter resultaten"
                onChange={(e) => handleFilter(e.target.value)}
                className="inputClass mt-2 !p-1 placeholder:text-[12px]"
              />
            </div>

            <div className="bg-gray-200 w-full h-[1px]" />
          </div>
        )}

        <div className="overflow-y-scroll max-h-[85%] pb-20 thin-scrollbar flex-grow">
          {children}
        </div>
      </div>

      <div className="flex bg-white absolute left-0 bottom-0 items-center border-t border-gray-300 justify-end w-full gap-x-2 py-1 pr-3">
        {buttons}
      </div>
    </div>
  );
}
