import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 w-full h-full ">
      <div className="relative h-full w-full">
        <div className="absolute top-0 left-0 h-full w-full bg-gray-500/20 bg-opacity-50 z-10" />

        <div className="absolute top-[30%] left-[50%] translate-x-[-50%] z-20">
          <LoadingBars />
        </div>
      </div>
    </div>
  );
}
