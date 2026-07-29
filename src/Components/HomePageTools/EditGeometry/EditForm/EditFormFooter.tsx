import FormFooterBar from "./FormFooterBar";

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
    <FormFooterBar>
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
    </FormFooterBar>
  );
}
