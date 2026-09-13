import { describe, it, expect } from "vitest";
import { slugifyHeading, extractToc } from "./toc";

describe("slugifyHeading", () => {
  it("lowercases and hyphenates", () => {
    expect(slugifyHeading("What the FSP Actually Tests")).toBe("what-the-fsp-actually-tests");
  });

  it("strips punctuation rather than turning it into hyphens", () => {
    expect(slugifyHeading("Step-by-Step: A Guide")).toBe("step-by-step-a-guide");
  });

  it("trims leading/trailing hyphens left over from punctuation at the edges", () => {
    expect(slugifyHeading("¿Ready?")).toBe("ready");
  });
});

describe("extractToc", () => {
  it("extracts only ## and ### headings, in order, with the right level", () => {
    const source = [
      "# Title (h1, ignored)",
      "",
      "Some intro text.",
      "",
      "## First Section",
      "",
      "### A Subsection",
      "",
      "## Second Section",
    ].join("\n");

    expect(extractToc(source)).toEqual([
      { id: "first-section", text: "First Section", level: 2 },
      { id: "a-subsection", text: "A Subsection", level: 3 },
      { id: "second-section", text: "Second Section", level: 2 },
    ]);
  });

  it("returns an empty array when there are no headings", () => {
    expect(extractToc("Just a paragraph, no headings.")).toEqual([]);
  });
});
