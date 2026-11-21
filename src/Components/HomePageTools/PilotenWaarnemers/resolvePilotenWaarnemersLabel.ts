import type { PilotenWaarnemersStep } from "./usePilotenWaarnemersStep";

type PilotenWaarnemersContent = {
  tools: {
    tabs: { pilotenWaarnemers: string };
    pilotenWaarnemers: {
      chooser: {
        editPiloten: string;
        editWaarnemers: string;
      };
    };
  };
};

export function resolvePilotenWaarnemersLabel(
  step: PilotenWaarnemersStep,
  content: PilotenWaarnemersContent
): string {
  if (step === "piloten") {
    return content.tools.pilotenWaarnemers.chooser.editPiloten;
  }
  if (step === "waarnemers") {
    return content.tools.pilotenWaarnemers.chooser.editWaarnemers;
  }
  return content.tools.tabs.pilotenWaarnemers;
}
