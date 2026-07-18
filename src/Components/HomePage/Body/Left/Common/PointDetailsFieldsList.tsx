import { EnrichedPointType } from "Types";

const POINT_DETAIL_FIELDS = [
  "omschrijving",
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
  "herhalen",
  "vertrouwelijk",
  "user_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
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
