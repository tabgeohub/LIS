import { classNames } from "@helpers/classNames";
import { useTabState } from "@helpers/ZustandStates/tabState";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/features/usePointsStore";

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
  const { setPoints, dbPoints } = usePointsStore();

  const logAction = useLogAction();

  return (
    <div
      key={item.id}
      onClick={() => {
        onClick();

        setPoints(dbPoints);

        logAction({ message: `User clicked ${item.label} tab` });
      }}
      className={classNames(
        "hover:bg-blue-50 hover:border-blue-200 relative cursor-pointer text-center grid grid-rows-2 justify-center text-gray-400 group border-2 transition-all duration-300 rounded-xl",
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
