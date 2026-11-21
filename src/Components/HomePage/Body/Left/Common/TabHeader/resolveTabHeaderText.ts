import type { TabType } from "Types";
import type { PilotenWaarnemersStep } from "Components/HomePageTools/PilotenWaarnemers/usePilotenWaarnemersStep";
import { resolvePilotenWaarnemersLabel } from "Components/HomePageTools/PilotenWaarnemers/resolvePilotenWaarnemersLabel";
import { buildTabHeaderLabelMap } from "./buildTabHeaderLabelMap";

export function resolveTabHeaderText(
  selectedTab: TabType,
  content: {
    layout: {
      tabHeaders: Record<string, string>;
      pages: Array<string | undefined>;
    };
    tools: {
      tabs: { pilotenWaarnemers: string };
      pilotenWaarnemers: {
        chooser: {
          editPiloten: string;
          editWaarnemers: string;
        };
      };
    };
  },
  pilotenWaarnemersStep: PilotenWaarnemersStep = "chooser"
): string | undefined {
  if (selectedTab === "pilotenWaarnemers") {
    return resolvePilotenWaarnemersLabel(pilotenWaarnemersStep, content);
  }
  return buildTabHeaderLabelMap(content)[selectedTab];
}
