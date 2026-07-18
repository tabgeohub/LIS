import LegendSectionLayout from "./LegendSectionLayout";
import {
  type LegendSectionProps,
  useLegendSectionModel,
} from "./LegendSectionCore";

export default function LegendSection(props: LegendSectionProps) {
  const model = useLegendSectionModel(props);
  if (model.hidden) return null;
  return <LegendSectionLayout {...model.layoutProps} />;
}
