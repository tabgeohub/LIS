import { TbPolygon, TbLine } from "react-icons/tb";

export function TemplateGeometryRow(props: {
  geometry: any;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const g = props.geometry;
  const isPolygon = g.type === "polygon";
  return (
    <div
      onMouseEnter={props.onEnter}
      onMouseLeave={props.onLeave}
      className="p-2 hover:bg-blue-100/70"
    >
      <div className="flex gap-x-2 items-center">
        {isPolygon ? (
          <TbPolygon className="text-yellow-500 text-lg" />
        ) : (
          <TbLine className="text-green-500 text-lg" />
        )}
        <span className="text-gray-800 text-lg">
          {g.omschrijving || `Geometrie ${g.id}`}
        </span>
      </div>
      <div className="pl-6 text-xs font-semibold text-gray-600">
        <p>Type: {isPolygon ? "Veelhoek" : "Lijn"}</p>
        {g.organisatie && <p>Organisatie: {g.organisatie}</p>}
        {g.activiteit && <p>Activiteit: {g.activiteit}</p>}
      </div>
    </div>
  );
}
