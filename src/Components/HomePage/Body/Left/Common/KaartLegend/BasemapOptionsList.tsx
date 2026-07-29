import { classNames } from "Components/HomePage/helpers/dom/classNames";
import {
  BASEMAP_OPTIONS,
  BASEMAP_THUMBNAILS,
  type UsedPlace,
} from "./basemapsListHelpers";
import type { BasemapsType } from "Types";

export function BasemapOptionRow(props: {
  item: { id: BasemapsType; label: string };
  usedPlace: UsedPlace;
  basemap: string;
  ondergrond: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { item, usedPlace, basemap, ondergrond, onChange } = props;
  return (
    <div
      className={classNames(
        "flex items-center px-3 py-1 hover:bg-gray-100",
        usedPlace === "Kaartlagen" && "pl-14"
      )}
    >
      {usedPlace === "Map" && (
        <img
          src={BASEMAP_THUMBNAILS[item.id]}
          alt={`${item.label} preview`}
          className="h-6 w-6 rounded border mr-2 shrink-0 object-cover"
          draggable={false}
        />
      )}
      <input
        id={item.id}
        data-id={item.id}
        type="radio"
        name="basemap"
        checked={basemap === item.id}
        disabled={!ondergrond}
        onChange={onChange}
        className="h-[12px] w-[12px] cursor-pointer"
      />
      <label htmlFor={item.id} className="ml-2 cursor-pointer select-none">
        {item.label}
      </label>
    </div>
  );
}

export function BasemapOptionsList(props: {
  usedPlace: UsedPlace;
  basemap: string;
  ondergrond: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1 pl-4 mt-3">
      {BASEMAP_OPTIONS.map((item) => (
        <BasemapOptionRow key={item.id} item={item} {...props} />
      ))}
    </div>
  );
}
