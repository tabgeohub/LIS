import { useContent } from "hooks/useContent";

export default function FotoEmptyState({
  setAction,
}: {
  setAction: (value: string) => void;
}) {
  const content = useContent();

  return (
    <div className="p-4">
      <p className="text-gray-400">
        {
          content.nabewerking.vluchtenZoeken.step2.waarnemingen
            .editPointDetails.noImages
        }
      </p>

      <div className="flex justify-end">
        <button onClick={() => setAction("form")} className="gray-button">
          {content.common.vorige}
        </button>
      </div>
    </div>
  );
}
