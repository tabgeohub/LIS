export function mapRegiosForUserRole(
  regios: { label: string; value: string }[],
  userRole: string
) {
  const userType = userRole.split(" ")[0];
  if (userType !== "EXT") return regios;
  return regios.map((regio) => ({
    label: regio.label.replace("RWS ", "EXT "),
    value: regio.value.replace("RWS ", "EXT "),
  }));
}
