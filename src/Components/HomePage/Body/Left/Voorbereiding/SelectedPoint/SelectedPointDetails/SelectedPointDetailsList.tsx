export function SelectedPointDetailsList({
  details,
}: {
  details: Array<{ label: string; value: unknown }>;
}) {
  if (!details.at(0)?.value) return <div className="h-[50vh]" />;
  return (
    <div className="h-[50vh] overflow-y-scroll thin-scrollbar">
      {details.map((detail) => (
        <div key={detail.label} className="mt-3 -space-y-1">
          <p className="text-xs text-gray-500 font-medium">{detail.label}</p>
          <p className="text-base text-gray-700">{String(detail.value ?? "")}</p>
        </div>
      ))}
    </div>
  );
}
