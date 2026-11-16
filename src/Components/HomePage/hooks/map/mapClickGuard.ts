export function createDebouncedClickGuard(debounceMs = 150) {
  let isProcessing = false;
  let lastClickTime = 0;

  return {
    shouldSkip(): boolean {
      const now = Date.now();
      if (now - lastClickTime < debounceMs || isProcessing) return true;
      lastClickTime = now;
      isProcessing = true;
      return false;
    },
    finish() {
      isProcessing = false;
    },
  };
}
