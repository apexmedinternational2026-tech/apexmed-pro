import { describe, it, expect } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("quotes every cell and doubles internal quotes", () => {
    const csv = toCsv(["Name", "Note"], [['Jane "JD" Doe', "hello, world"]]);
    expect(csv).toContain('"Jane ""JD"" Doe"');
    expect(csv).toContain('"hello, world"');
  });

  it('renders null/undefined as an empty quoted cell rather than the string "null"', () => {
    const csv = toCsv(["A", "B"], [[null, undefined]]);
    expect(csv).toContain('"",""');
  });

  it("separates rows with CRLF and ends with a trailing newline", () => {
    const csv = toCsv(["A"], [["1"], ["2"]]);
    expect(csv).toBe('"A"\r\n"1"\r\n"2"\r\n');
  });
});
