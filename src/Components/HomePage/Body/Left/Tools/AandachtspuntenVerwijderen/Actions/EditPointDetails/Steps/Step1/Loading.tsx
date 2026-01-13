import { useContent } from "hooks/useContent";
import { CgSpinner } from "react-icons/cg";

export default function Loading() {
  const content = useContent();

  return (
    <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <CgSpinner className="animate-spin text-blue-500 text-6xl" />
        <p className="text-gray-500 text-sm">
          {content.tools.aandachtspuntenVerwijderen.editPoint.step2.loading}
        </p>
      </div>
    </div>
  );
}
