import { EnrichedPointType } from "Types";
import { POINT_CORE_IDENTITY_KEYS } from "Components/HomePage/helpers/points/pointCoreIdentityKeys";

const POINT_DETAIL_EXTRA_FIELDS = [
  "herhalen",
  "vertrouwelijk",
  "user_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
] as const;

const POINT_DETAIL_FIELDS = [
  ...POINT_CORE_IDENTITY_KEYS,
  ...POINT_DETAIL_EXTRA_FIELDS,
] as const;

/** Shared field list renderer for point detail side panels. */
export default function PointDetailsFieldsList({
  point,
}: {
  point: EnrichedPointType | undefined;
}) {
  return (
    <div className="space-y-2">
      {POINT_DETAIL_FIELDS.map((field) => (
        <div key={field}>
          <p className="text-gray-500 text-[12px]">{field}</p>
          <p>{point?.[field]}</p>
        </div>
      ))}
    </div>
  );
}
