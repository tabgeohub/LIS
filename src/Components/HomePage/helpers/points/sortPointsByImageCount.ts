type PointWithImages = {
  attachments?: readonly (unknown | null)[];
};

function getImageCount(point: PointWithImages) {
  return point.attachments?.filter((attachment) => attachment != null).length ?? 0;
}

/** Returns a stable copy ordered from most images to fewest images. */
export function sortPointsByImageCount<T extends PointWithImages>(
  points: readonly T[]
): T[] {
  return points
    .map((point, originalIndex) => ({ point, originalIndex }))
    .sort(
      (left, right) =>
        getImageCount(right.point) - getImageCount(left.point) ||
        left.originalIndex - right.originalIndex
    )
    .map(({ point }) => point);
}
