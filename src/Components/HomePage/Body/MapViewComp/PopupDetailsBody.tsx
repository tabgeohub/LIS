import type { PathPointType } from "hooks/zustand/ui/pathPointState";

function DetailRow(input: { label: string; value: string }) {
  return (
    <p className="grid grid-cols-2">
      <span className="text-[12px] text-gray-600">{input.label}</span>
      <span className="font-semibold text-gray-700 text-[13px]">
        {input.value}
      </span>
    </p>
  );
}

export function PopupDetailsBody(input: { point: PathPointType }) {
  const p = input.point;
  return (
    <div className="mt-2">
      <DetailRow label="Vluchtnummer:" value={p.vluchtnummer} />
      <DetailRow label="Breedtegraad:" value={p.latitude.toFixed(4)} />
      <DetailRow label="Lengtegraad:" value={p.longitude.toFixed(4)} />
      <DetailRow label="Hoogte:" value={`${p.altitude.toFixed(4)} m`} />
      <DetailRow label="Snelheid:" value={`${p.speed.toFixed(4)} u`} />
      <DetailRow
        label="Rotatiehoek:"
        value={`${p.rotationAngle.toFixed(4)}°`}
      />
    </div>
  );
}
