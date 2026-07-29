import { create } from "zustand";

type HoveredGraphic = {
  id: number;
  label: string;
  point?: any;
} | null;

export const useHoveredGraphicState = create<{
  hovered: HoveredGraphic;
  setHovered: (value: HoveredGraphic) => void;
}>(() => ({
  hovered: null,
  setHovered: () => {},
}));

// initialize setter properly to avoid stale closures across HMR
useHoveredGraphicState.setState({
  setHovered: (value: HoveredGraphic) =>
    useHoveredGraphicState.setState({ hovered: value }),
});
