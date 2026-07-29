import { useContent } from "hooks/useContent";

export default function FotoEmptyState() {
  const content = useContent();

  return (
    <div className="p-4">
      <p className="text-gray-400">
        {
          content.nabewerking.vluchtenZoeken.step2.waarnemingen
            .editPointDetails.noImages
        }
      </p>
    </div>
  );
}
