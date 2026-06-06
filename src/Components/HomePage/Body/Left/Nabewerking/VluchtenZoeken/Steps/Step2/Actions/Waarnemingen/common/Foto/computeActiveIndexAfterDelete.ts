export function computeActiveIndexAfterDelete(
  currentIndex: number,
  remainingCount: number
): { newIndex: number; closeGallery: boolean } {
  if (remainingCount === 0) {
    return { newIndex: 0, closeGallery: true };
  }

  if (currentIndex >= remainingCount) {
    return { newIndex: remainingCount - 1, closeGallery: false };
  }

  return { newIndex: currentIndex, closeGallery: false };
}
