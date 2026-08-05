/** Replace `'{key}'` placeholders in a content template string. */
export function formatConfirmMessage(
  template: string,
  values: Record<string, string>
): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`'{${key}}'`, `'${value}'`),
    template
  );
}
