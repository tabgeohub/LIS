import { CgSpinner } from "react-icons/cg";

export default function EditPointMapClickStep({
  instructionText,
  saveLabel,
  enterCoordinatesLabel,
  cancelLabel,
  onSave,
  onEnterCoordinates,
  onCancel,
  isLoading,
  loadingText,
}: {
  instructionText: string;
  saveLabel: string;
  enterCoordinatesLabel: string;
  cancelLabel: string;
  onSave: () => void;
  onEnterCoordinates: () => void;
  onCancel: () => void;
  isLoading: boolean;
  loadingText: string;
}) {
  return (
    <div>
      <p className="text-gray-800 leading-3 text-[12px]">Klik op de kaart</p>

      <p className="text-gray-800 leading-3 text-[12px] mt-2">
        {instructionText}
      </p>

      <div className="bg-gray-100 group cursor-pointer hover:bg-primary border transition-all duration-300 w-[35px] aspect-square border-gray-200 rounded-lg flex items-center justify-center mt-4">
        <div className="bg-primary group-hover:bg-gray-100 border w-2 h-2 rounded-full transition-all duration-300" />
      </div>

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button onClick={onSave} className="gray-button">
          {saveLabel}
        </button>

        <button onClick={onEnterCoordinates} className="gray-button">
          {enterCoordinatesLabel}
        </button>

        <button onClick={onCancel} className="gray-button">
          {cancelLabel}
        </button>
      </div>

      {isLoading && (
        <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <CgSpinner className="animate-spin text-blue-500 text-6xl" />
            <p className="text-gray-500 text-sm">{loadingText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
