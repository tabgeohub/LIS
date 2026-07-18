import { IoCloseOutline } from "react-icons/io5";

export function MapTopMessageBanner(input: {
  topMessage: { show: boolean; message: string };
  setTopMessage: (value: { message: string; show: boolean }) => void;
}) {
  if (!input.topMessage.show) return null;
  return (
    <div className="absolute z-[10000] text-[12px] py-1.5 flex items-center justify-center gap-x-2 top-0 left-0 w-full bg-yellow-100">
      <p className="grid grid-cols-2">{input.topMessage.message}</p>
      <button
        onClick={() => input.setTopMessage({ message: "", show: false })}
        className="hover:scale-110 transition-all"
      >
        <IoCloseOutline />
      </button>
    </div>
  );
}
