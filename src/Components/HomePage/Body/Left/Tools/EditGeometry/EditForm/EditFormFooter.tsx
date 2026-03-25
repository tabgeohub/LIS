import type { ReactNode } from "react";

export default function EditFormFooter({
  annulerenLabel,
  opslaanLabel,
  onCancel,
  openPointsEditor,
  isSaving = false,
}: {
  annulerenLabel: string;
  opslaanLabel: string;
  onCancel: () => void;
  /** e.g. “Punten bewerken” — must use type="button" inside */
  openPointsEditor: () => void;
  isSaving?: boolean;
}) {
  return (
    <div className="flex bg-white absolute left-0 bottom-0 items-center border-t border-gray-300 justify-end w-full gap-x-2 py-1.5 pr-3 pl-2 flex-wrap">
      <button
        type="button"
        onClick={onCancel}
        className="gray-button"
        disabled={isSaving}
      >
        {annulerenLabel}
      </button>

      <button
        type="button"
        onClick={openPointsEditor}
        className="gray-button"
        disabled={isSaving}
      >
        Punten bewerken
      </button>

      <button type="submit" className="gray-button" disabled={isSaving}>
        {isSaving ? "Opslaan..." : opslaanLabel}
      </button>
    </div>
  );
}
