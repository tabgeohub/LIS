import { ReactNode } from "react";
import MenuItem from "Components/HomePage/Body/Bottom/common/MenuItem";

export type SearchedResultAction = {
  key: string;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

export default function SearchedResultsActionsMenu({
  actions,
}: {
  actions: SearchedResultAction[];
}) {
  return (
    <div className="absolute top-[100%] right-0 z-10 bg-white rounded-md shadow-md w-[350px] max-h-[330px] overflow-y-auto border border-gray-300 thin-scrollbar">
      {actions.map((action) => (
        <MenuItem
          key={action.key}
          icon={action.icon}
          title={action.title}
          description={action.description}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
}
