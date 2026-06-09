export function runWizardCleanup(
  actions: Array<(() => void) | undefined | null>
): void {
  for (const action of actions) {
    action?.();
  }
}
