const CSV_DELIMITER = ";";

export function accumulateCsvRow(
  buffer: string,
  line: string,
  expectedFieldCount: number
): { buffer: string; row: string[] | null } {
  const nextBuffer = buffer ? `${buffer}\n${line}` : line;
  const fields = nextBuffer.split(CSV_DELIMITER);

  if (fields.length !== expectedFieldCount) {
    return { buffer: nextBuffer, row: null };
  }

  return {
    buffer: "",
    row: fields.map((field) => field.trim()),
  };
}

export function parseDelimitedRows(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  const expectedFieldCount = lines[0]?.split(CSV_DELIMITER).length ?? 0;
  const rows: string[][] = [];
  let buffer = "";

  for (const line of lines) {
    if (!line?.trim()) continue;

    const accumulated = accumulateCsvRow(buffer, line, expectedFieldCount);
    buffer = accumulated.buffer;
    if (accumulated.row) rows.push(accumulated.row);
  }

  return rows;
}
