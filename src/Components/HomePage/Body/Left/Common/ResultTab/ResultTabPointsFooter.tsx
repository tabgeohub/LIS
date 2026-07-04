type ResultTabPointsFooterProps = {
  total: number;
  summaryText: string;
  pageInfoText: string;
};

export default function ResultTabPointsFooter({
  total,
  summaryText,
  pageInfoText,
}: ResultTabPointsFooterProps) {
  return (
    <div className="px-4 py-2 text-sm text-gray-700 flex justify-between items-center border-t">
      <span>
        {summaryText
          .replace("{start}", String(1))
          .replace("{end}", String(total))
          .replace("{total}", String(total))}
      </span>
      <div className="flex items-center gap-1">
        <button type="button" className="text-gray-400 hover:text-gray-600">
          &laquo;
        </button>
        <span>
          {pageInfoText.replace("{current}", String(1)).replace("{totalPages}", String(1))}
        </span>
        <button type="button" className="text-gray-400 hover:text-gray-600">
          &raquo;
        </button>
      </div>
    </div>
  );
}
