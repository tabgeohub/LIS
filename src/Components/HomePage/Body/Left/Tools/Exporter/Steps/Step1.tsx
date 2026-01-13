import { useContent } from "hooks/useContent";

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

  return (
    <>
      <div className="pt-4 px-2">
        <p className="text-gray-500">{content.tools.exporteer.modal.text}</p>

        <select
          className="inputClass"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="bmp">BMP</option>
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="tiff">TIFF</option>
          <option value="pdf">PDF</option>
        </select>

        <div className="flex items-center mt-2 gap-x-1">
          <input
            checked={inclusief}
            onChange={(e) => setInclusief(e.target.checked)}
            type="checkbox"
            id="inclusief"
          />

          <label htmlFor="inclusief" className="labelClass -mt-0.5">
            {content.tools.exporteer.modal.inclusiefGeoreferentie}
          </label>
        </div>
      </div>

      <div className="py-2 px-3">
        <div className="flex justify-end mt-6">
          <button className="gray-button" onClick={exportMap}>
            {content.tools.exporteer.modal.afbeeldingAanmaken}
          </button>
        </div>
      </div>
    </>
  );
}
