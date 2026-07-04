type HerhalenValue = number | string | boolean | undefined | null;

export function matchesHerhalen(herhalenValue: HerhalenValue, herhalen: boolean): boolean {
  if (typeof herhalenValue === "number") {
    return herhalen ? herhalenValue === 1 : herhalenValue === 0;
  }
  if (typeof herhalenValue === "string") {
    return herhalen ? herhalenValue === "1" : herhalenValue === "0";
  }
  return herhalen ? herhalenValue === true : herhalenValue === false;
}

export function filterByHerhalen<T extends { herhalen: HerhalenValue }>(
  items: T[],
  herhalen: boolean
): T[] {
  return items.filter((item) => matchesHerhalen(item.herhalen, herhalen));
}
