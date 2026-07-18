import {
  useBasemapsListModel,
  type UsedPlace,
} from "./useBasemapsListModel";
import { OndergrondHeader } from "./OndergrondHeader";
import { BasemapOptionsList } from "./BasemapOptionsList";

export default function BasemapsList({
  usedPlace = "Kaartlagen",
}: {
  usedPlace?: UsedPlace;
}) {
  const model = useBasemapsListModel(usedPlace);

  return (
    <div>
      {usedPlace === "Kaartlagen" && (
        <OndergrondHeader
          openCheck={model.openCheck}
          setOpenCheck={model.setOpenCheck}
          ondergrond={model.ondergrond}
          setOndergrond={model.setOndergrond}
        />
      )}
      {model.showList && (
        <BasemapOptionsList
          usedPlace={usedPlace}
          basemap={model.basemap}
          ondergrond={model.ondergrond}
          onChange={model.handleChangeBasemap}
        />
      )}
    </div>
  );
}
