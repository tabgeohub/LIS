import { useContent } from "hooks/useContent";

export default function Step3({ downloadMap }: { downloadMap: () => void }) {
  const content = useContent();

  return (
    <div className="pt-4 pb-2 px-2">
      <p className="text-[14px] text-gray-700">
        {content.tools.exporteer.modal.step3Text}
      </p>

      <div className="flex justify-end">
        <button onClick={() => downloadMap()} className="gray-button">
          {content.tools.exporteer.modal.step3Btn}
        </button>
      </div>
    </div>
  );
}
