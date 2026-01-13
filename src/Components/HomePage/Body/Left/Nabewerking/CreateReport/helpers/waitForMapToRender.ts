export function waitForMapToRender(view: __esri.MapView): Promise<void> {
  return new Promise((resolve) => {
    if (!view.updating) return resolve();
    const handle = view.watch("updating", (updating) => {
      if (!updating) {
        handle.remove();
        resolve();
      }
    });
  });
}
