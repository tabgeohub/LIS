const CSV_DELIMITER = ";";

function appendCsvLine(buffer: string, line: string): string {
  if (!buffer) return line;
  return `${buffer}\n${line}`;
}

function headerFieldCount(lines: string[]): number {
  const header = lines[0];
  if (!header) return 0;
  return header.split(CSV_DELIMITER).length;
}

function isBlankLine(line: string): boolean {
  return !line.trim();
}

export function accumulateCsvRow(input: {
  buffer: string;
  line: string;
  expectedFieldCount: number;
}): { buffer: string; row: string[] | null } {
  const nextBuffer = appendCsvLine(input.buffer, input.line);
  const fields = nextBuffer.split(CSV_DELIMITER);

  if (fields.length !== input.expectedFieldCount) {
    return { buffer: nextBuffer, row: null };
  }

  return {
    buffer: "",
    row: fields.map((field) => field.trim()),
  };
}

export function parseDelimitedRows(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  const expectedFieldCount = headerFieldCount(lines);
  const rows: string[][] = [];
  let buffer = "";

  for (const line of lines) {
    if (isBlankLine(line)) continue;

    const accumulated = accumulateCsvRow({
      buffer,
      line,
      expectedFieldCount,
    });
    buffer = accumulated.buffer;
    if (accumulated.row) rows.push(accumulated.row);
  }

  return rows;
}
