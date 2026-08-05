import type { ReactNode } from "react";

/**
 * Pick the active wizard panel by step number.
 * Keeps feature roots free of long if/else chains.
 */
export function renderWizardStep(
  step: number,
  steps: Record<number, ReactNode>
): ReactNode {
  return steps[step] ?? null;
}
