import { classNames } from "helpers/dom/classNames";
import { useTabState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import { useResetFeatures } from "hooks/features/useResetFeatures";

export default function CommonTabBtn({
  item,
  onClick,
}: {
  item: {
    id: string;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    disabled: boolean;
    new?: boolean;
  };
  onClick: () => void;
}) {
  const { selectedTab } = useTabState();
  const { resetFeatures } = useResetFeatures();

  const logAction = useLogAction();

  return (
    <div
      key={item.id}
      aria-disabled={item.disabled}
      onClick={() => {
        if (item.disabled) return;

        onClick();

        resetFeatures();

        logAction({ message: `User clicked ${item.label} tab` });
      }}
      className={classNames(
        "relative text-center grid grid-rows-2 justify-center text-gray-400 group border-2 transition-all duration-300 rounded-xl",
        item.disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:bg-blue-50 hover:border-blue-200 cursor-pointer",
        selectedTab === item.id
          ? "border-blue-200 bg-blue-50"
          : "border-transparent"
      )}
    >
      <button className="border-none rounded-md transition duration-100 text-primary">
        <item.icon className="size-5 mx-auto" />
      </button>

      <p className="text-[11px] line-clamp-2 tracking-normal w-[100px]">
        {item.label}
      </p>
      
      {item.new && <span className="text-[9px] font-semibold bg-blue-500 text-white  px-1 py-0.5 rounded-md -top-[5px] -right-[5px] absolute">New</span>}
    </div>
  );
}
