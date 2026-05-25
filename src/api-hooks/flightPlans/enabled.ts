export function enabledForUser(userId: number | undefined): boolean {
  return userId !== undefined && userId !== 0;
}

export function enabledForRegio(
  regioId: string | number | undefined,
  userId: number | undefined
): boolean {
  return (
    regioId !== undefined &&
    regioId !== "" &&
    enabledForUser(userId)
  );
}
