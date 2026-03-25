import type { SpatialReference } from "Types";

export default function CoordinateSystemSelect({
  coordinateSystem,
  setCoordinateSystem,
}: {
  coordinateSystem: SpatialReference;
  setCoordinateSystem: (value: SpatialReference) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
        Coördinatensysteem
      </label>
      <select
        className="inputClass w-full"
        value={coordinateSystem}
        onChange={(e) => setCoordinateSystem(e.target.value as SpatialReference)}
      >
        <option value="RD">RD</option>
        <option value="WGS84">WGS84</option>
      </select>
    </div>
  );
}
