import useLogAction from "hooks/useLogAction";

export default function GroupFunctionsButtonItem({
  icon,
  title,
  description,
  onClick,
  target,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
  onClick: () => void;
  target: string;
}) {
  const logAction = useLogAction();

  return (
    <div
      className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
      onClick={() => {
        onClick();

        logAction({
          message: `User clicked ${title} button in ${target} drop down`,
          step: "Searched results",
        });
      }}
    >
      <div className="text-gray-500 text-xl my-auto">{icon}</div>
      <div>
        <p className="text-gray-800 text-sm font-semibold">{title}</p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
}
