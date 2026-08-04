export function runWizardCleanup(options: {
  actions: Array<(() => void) | undefined | null>;
}): void {
  for (const action of options.actions) {
    action?.();
  }
}
