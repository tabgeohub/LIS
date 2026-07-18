import { ReactNode } from "react";
import { EnrichedPointType } from "Types";
import { useTemplateSelectionFilters } from "./useTemplateSelectionFilters";
import { TemplateSelectionStepBody } from "./TemplateSelectionStepBody";

type TemplateSelectionStepProps = {
  repeat: boolean;
  text: string;
  step: number;
  filteredPoints: EnrichedPointType[];
  selectedPoints: number[];
  setSelectedPoints: (points: number[]) => void;
  selectedGeometries: number[];
  setSelectedGeometries: (geometries: number[]) => void;
  buttons: ReactNode;
};

export default function TemplateSelectionStep(
  props: TemplateSelectionStepProps
) {
  const filters = useTemplateSelectionFilters({
    repeat: props.repeat,
    filteredPoints: props.filteredPoints,
  });
  return <TemplateSelectionStepBody {...props} {...filters} />;
}
