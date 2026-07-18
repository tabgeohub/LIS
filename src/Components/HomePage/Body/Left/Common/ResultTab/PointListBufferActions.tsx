export function PointListBufferActions(input: {
  onClear: () => void;
  onCancel: () => void;
  onBuffer: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        onClick={input.onClear}
        className="px-4 py-1 border border-gray-300 rounded text-blue-600 hover:bg-gray-100"
      >
        Verwijderen
      </button>
      <button
        onClick={input.onCancel}
        className="px-4 py-1 border border-gray-300 rounded text-blue-600 hover:bg-gray-100"
      >
        Annuleren
      </button>
      <button
        onClick={input.onBuffer}
        className="px-4 py-1 border border-gray-300 rounded text-blue-600 hover:bg-gray-100"
      >
        Doorgaan
      </button>
    </div>
  );
}
