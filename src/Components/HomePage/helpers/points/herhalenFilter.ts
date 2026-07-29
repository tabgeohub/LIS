type HerhalenValue = number | string | boolean | undefined | null;

function matchesNumberHerhalen(value: number, herhalen: boolean): boolean {
  return value === (herhalen ? 1 : 0);
}

function matchesStringHerhalen(value: string, herhalen: boolean): boolean {
  return value === (herhalen ? "1" : "0");
}

function matchesBooleanHerhalen(value: HerhalenValue, herhalen: boolean): boolean {
  return value === herhalen;
}

export function matchesHerhalen(herhalenValue: HerhalenValue, herhalen: boolean): boolean {
  if (typeof herhalenValue === "number") {
    return matchesNumberHerhalen(herhalenValue, herhalen);
  }
  if (typeof herhalenValue === "string") {
    return matchesStringHerhalen(herhalenValue, herhalen);
  }
  return matchesBooleanHerhalen(herhalenValue, herhalen);
}

export function filterByHerhalen<T extends { herhalen?: HerhalenValue }>(
  items: T[],
  herhalen: boolean
): T[] {
  return items.filter((item) => matchesHerhalen(item.herhalen, herhalen));
}
