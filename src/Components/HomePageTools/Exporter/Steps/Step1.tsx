import { useContent } from "hooks/useContent";
import { EXPORT_IMAGE_FORMATS } from "./exportFormats";

export default function Step1({
  setValue,
  value,
  setInclusief,
  inclusief,
  exportMap,
}: {
  setValue: (value: string) => void;
  value: string;
  setInclusief: (value: boolean) => void;
  inclusief: boolean;
  exportMap: () => void;
}) {
  const content = useContent();
  const modal = content.tools.exporteer.modal;

  return (
    <>
      <div className="pt-2">
        <p className="text-gray-500">{modal.text}</p>

        <select
          className="inputClass"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={modal.text}
        >
          {EXPORT_IMAGE_FORMATS.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>

        <div className="flex items-center mt-2 gap-x-1">
          <input
            checked={inclusief}
            onChange={(e) => setInclusief(e.target.checked)}
            type="checkbox"
            id="inclusief"
          />

          <label htmlFor="inclusief" className="labelClass -mt-0.5">
            {modal.inclusiefGeoreferentie}
          </label>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button type="button" className="gray-button" onClick={exportMap}>
          {modal.afbeeldingAanmaken}
        </button>
      </div>
    </>
  );
}
