export function PointListBufferDistanceField(input: {
  distance: number;
  setDistance: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Afstand</label>
      <input
        type="number"
        value={input.distance}
        onChange={(e) => input.setDistance(Number(e.target.value))}
        className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
      />
    </div>
  );
}
