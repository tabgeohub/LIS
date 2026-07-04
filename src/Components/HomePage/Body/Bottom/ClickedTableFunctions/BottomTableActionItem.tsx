import { ReactNode } from "react";

type BottomTableActionItemProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
};

export default function BottomTableActionItem({
  icon,
  title,
  subtitle,
  onClick,
}: BottomTableActionItemProps) {
  return (
    <div
      className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
      onClick={onClick}
    >
      <div className="text-2xl text-primary mt-1">{icon}</div>
      <div>
        <p className="text-[14px] font-semibold text-gray-800">{title}</p>
        <p className="text-[12px] text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
