import { FaMinus, FaPlus } from "react-icons/fa6";

export function OndergrondHeader(props: {
  openCheck: boolean;
  setOpenCheck: (value: boolean) => void;
  ondergrond: boolean;
  setOndergrond: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-1 hover:bg-gray-100">
      <div
        className="flex items-center gap-2 w-full cursor-pointer"
        onClick={() => props.setOpenCheck(!props.openCheck)}
      >
        <span className="text-gray-500 w-4">
          {props.openCheck ? <FaMinus /> : <FaPlus />}
        </span>
        <input
          id="ondergrond"
          checked={props.ondergrond}
          onChange={(e) => {
            e.stopPropagation();
            props.setOndergrond(e.target.checked);
          }}
          type="checkbox"
          className="h-[12px] w-[12px] cursor-pointer"
        />
        <label htmlFor="ondergrond" className="cursor-pointer select-none">
          Ondergrond
        </label>
      </div>
      <div className="text-gray-400 text-sm">
        <div className="w-2 h-2 border-r border-b border-gray-400 rotate-45 mr-1 mt-0.5" />
      </div>
    </div>
  );
}
