// Minimal RFC 4180-ish CSV builder — no dependency needed for something
// this small. Every field is quoted and internal quotes are doubled,
// which is the one escaping rule that actually matters (commas and
// newlines inside a quoted field are otherwise valid as-is).
function escapeCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const lines = [headers.map(escapeCell).join(","), ...rows.map((row) => row.map(escapeCell).join(","))];
  // \r\n and a trailing newline: matches what Excel expects and avoids a
  // missing-final-row quirk in some CSV parsers.
  return lines.join("\r\n") + "\r\n";
}
