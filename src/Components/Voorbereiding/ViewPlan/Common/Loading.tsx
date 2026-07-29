import { FaMapMarkedAlt } from "react-icons/fa";

export default function Loading() {
  return (
    <div>
      <div className="flex w-[100%] h-[40px] p-2 border-b-[1px]">
        <input
          disabled
          className="inputClass mt-2 !p-1 placeholder:text-[12px]"
          type="text"
          placeholder="filter..."
        />
      </div>

      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="hover:cursor-pointer hover:bg-gray-100">
          <div className="flex p-2 border-b-[1px]">
            <div className="w-[10%]">
              <FaMapMarkedAlt className="size-6 text-gray-500" />
            </div>
            <div className="w-[90%] space-y-1.5">
              <div className="h-2 w-60 bg-gray-400 animate-pulse rounded-full" />

              <div className="h-1.5 w-40 bg-gray-300 animate-pulse rounded-full" />
              <div className="h-1.5 w-32 bg-gray-300 animate-pulse rounded-full" />
              <div className="h-1.5 w-36 bg-gray-300 animate-pulse rounded-full" />
              <div className="h-1.5 w-44 bg-gray-300 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
