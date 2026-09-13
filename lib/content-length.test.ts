import { describe, it, expect } from "vitest";
import { countWords, getStudyFieldWordCount, estimateReadingMinutes, MIN_FIELD_PAGE_WORDS } from "./content-length";

describe("countWords", () => {
  it("counts space-separated words", () => {
    expect(countWords("one two three")).toBe(3);
  });

  it("returns 0 for empty or whitespace-only input", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n\t ")).toBe(0);
  });

  it("collapses multiple whitespace characters between words", () => {
    expect(countWords("one   two\nthree")).toBe(3);
  });
});

describe("getStudyFieldWordCount", () => {
  it("sums words across every content section", () => {
    const total = getStudyFieldWordCount({
      overview: "one two three",
      typical_universities: "four five",
      entry_requirements: null,
      language_requirements: undefined,
      career_outlook: "six",
    });
    expect(total).toBe(6);
  });

  it("returns 0 when every section is empty", () => {
    expect(getStudyFieldWordCount({})).toBe(0);
  });

  it("flags a realistic thin page as below the minimum", () => {
    const thin = getStudyFieldWordCount({
      overview: "A short overview of this field.",
      typical_universities: "Some German universities.",
      entry_requirements: "A bachelor's degree.",
    });
    expect(thin).toBeLessThan(MIN_FIELD_PAGE_WORDS);
  });
});

describe("estimateReadingMinutes", () => {
  it("rounds to the nearest minute at 200 words/minute", () => {
    expect(estimateReadingMinutes(Array(400).fill("word").join(" "))).toBe(2);
  });

  it("never returns less than 1 minute for non-empty text", () => {
    expect(estimateReadingMinutes("a few words")).toBe(1);
  });
});
