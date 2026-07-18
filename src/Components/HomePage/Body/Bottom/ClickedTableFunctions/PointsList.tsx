import { useContent } from "hooks/useContent";
import { buildPointsListItemSpecs } from "./buildPointsListItemSpecs";
import { PointsListItems } from "./PointsListItems";
import { usePointsListActions } from "./usePointsListActions";

export default function PointsList() {
  const list = useContent().bottomSection.pointsList;
  const actions = usePointsListActions();
  return (
    <PointsListItems specs={buildPointsListItemSpecs({ list, actions })} />
  );
}
