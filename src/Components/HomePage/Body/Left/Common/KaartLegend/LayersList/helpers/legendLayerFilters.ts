import { LegendLayerDefinition } from "./layerTypes";

function getUserRegioCode(role: string) {
  return role.split(" ")[1];
}

export function filterLayersByRegio(
  layers: LegendLayerDefinition[],
  userRole: string
) {
  if (userRole === "admin") return layers;

  const regioCode = getUserRegioCode(userRole);
  return layers.filter((layer) => layer.regio?.includes(regioCode));
}

export function getUniqueRegioCodes(layers: LegendLayerDefinition[]) {
  return layers
    .map((layer) => layer.regio)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index);
}
