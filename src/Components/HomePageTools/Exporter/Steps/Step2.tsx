import { useContent } from "hooks/useContent";

export default function Step2() {
  const content = useContent();

  return (
    <div className="py-4 px-2 ">
      <p className="text-[14px] text-gray-700">
        {content.tools.exporteer.modal.loading}
      </p>
    </div>
  );
}
