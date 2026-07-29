import { CgClose } from "react-icons/cg";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";

export function EditPointDetailsHeader({ title }: { title: string }) {
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  return (
    <>
      <div className="flex justify-between items-center p-1">
        <p></p>
        <p className="text-gray-400">{title}</p>
        <button
          onClick={() => {
            setSelectedTab("none");
            setSelectedBottomTab("Kaartlagenlijst");
          }}
        >
          <CgClose className="text-gray-400" />
        </button>
      </div>
      <div className="w-full h-[1px] bg-gray-200" />
    </>
  );
}
