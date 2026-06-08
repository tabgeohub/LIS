export function buildRegioQueryParam(
  regioId: string | number | undefined
): string {
  if (regioId === undefined || regioId === "") {
    return "";
  }

  return `regio_id=${encodeURIComponent(String(regioId))}`;
}

export function appendRegioQuery(
  path: string,
  regioId: string | number | undefined
): string {
  const regioQuery = buildRegioQueryParam(regioId);
  if (!regioQuery) {
    return path;
  }

  return path.includes("?") ? `${path}&${regioQuery}` : `${path}?${regioQuery}`;
}
