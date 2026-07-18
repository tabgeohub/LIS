type Unit = "kilometers" | "meters";

export function PointListBufferUnitField(input: {
  unit: Unit;
  setUnit: (value: Unit) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Eenheden</label>
      <select
        value={input.unit}
        onChange={(e) => input.setUnit(e.target.value as Unit)}
        className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
      >
        <option value="kilometers">Kilometers (km)</option>
        <option value="feet">Voet (ft)</option>
        <option value="yards">Yards (yd)</option>
        <option value="meters">Meters (m)</option>
        <option value="miles">Mijlen (mi)</option>
        <option value="nautical-miles">Zeemijlen (NM)</option>
      </select>
    </div>
  );
}
