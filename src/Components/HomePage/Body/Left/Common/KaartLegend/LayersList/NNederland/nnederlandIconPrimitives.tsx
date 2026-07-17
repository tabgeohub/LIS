export function nnLineIcon(color: string, heightPx = 2) {
  return (
    <div
      className="w-[80%]"
      style={{ height: heightPx, backgroundColor: color }}
    />
  );
}

export function nnSquareIcon(input: {
  borderColor: string;
  fillColor: string;
  borderWidthPx?: number;
}) {
  const borderWidthPx = input.borderWidthPx ?? 1;
  return (
    <div
      className="w-[80%] aspect-square"
      style={{
        borderWidth: borderWidthPx,
        borderStyle: "solid",
        borderColor: input.borderColor,
        backgroundColor: input.fillColor,
      }}
    />
  );
}
