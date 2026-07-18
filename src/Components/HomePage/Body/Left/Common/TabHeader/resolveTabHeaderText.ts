import type { TabType } from "Types";
import { buildTabHeaderLabelMap } from "./buildTabHeaderLabelMap";

export function resolveTabHeaderText(
  selectedTab: TabType,
  content: {
    layout: {
      tabHeaders: Record<string, string>;
      pages: Array<string | undefined>;
    };
  }
): string | undefined {
  return buildTabHeaderLabelMap(content)[selectedTab];
}
