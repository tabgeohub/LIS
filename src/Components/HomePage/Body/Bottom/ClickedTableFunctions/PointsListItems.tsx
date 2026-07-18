import BottomTableActionItem from "./BottomTableActionItem";
import type { PointsListItemSpec } from "./buildPointsListItemSpecs";

export function PointsListItems({
  specs,
}: {
  specs: PointsListItemSpec[];
}) {
  return (
    <div>
      {specs.map((item, index) => (
        <BottomTableActionItem
          key={index}
          icon={item.icon}
          title={item.copy.title}
          subtitle={item.copy.subtitle}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
}
