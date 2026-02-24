import React from "react";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function MenuItem({
  icon,
  title,
  description,
  onClick,
}: MenuItemProps) {
  return (
    <div
      className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
      onClick={onClick}
    >
      <div>{icon}</div>

      <div>
        <p className="text-[14px] font-semibold text-gray-800">{title}</p>
        <p className="text-[12px] text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default React.memo(MenuItem);

