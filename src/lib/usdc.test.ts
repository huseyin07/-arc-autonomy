import { describe, expect, it } from "vitest";
import { formatUsdcAmount, parseUsdcAmount } from "./usdc";
describe("USDC amounts", () => {
  it("parses integers", () => expect(parseUsdcAmount("12")).toBe(12_000_000n));
  it("parses decimals", () => expect(parseUsdcAmount("12.50")).toBe(12_500_000n));
  it("parses six decimals", () => expect(parseUsdcAmount("0.000001")).toBe(1n));
  it("rejects more than six decimals", () => expect(() => parseUsdcAmount("1.0000001")).toThrow());
  it("rejects negatives", () => expect(() => parseUsdcAmount("-1")).toThrow());
  it.each(["NaN", "Infinity", "1e3", " 1", "1.", ""])("rejects malformed %s", (value: string) => expect(() => parseUsdcAmount(value)).toThrow());
  it("formats without precision loss", () => expect(formatUsdcAmount(12_500_000n)).toBe("12.5"));
});
