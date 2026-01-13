import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";

export function useHandleLayerChange(setLayers: any) {
  const { selectedLayers, setSelectedLayers } = kaartlagenState();

  const handleLayerChange = (id: string, checked: boolean) => {
    if (selectedLayers.includes(id)) {
      setSelectedLayers(selectedLayers.filter((layer) => layer !== id));
    } else {
      setSelectedLayers([...selectedLayers, id]);
    }

    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id ? { ...layer, checked } : layer
      )
    );
  };

  return handleLayerChange;
}
