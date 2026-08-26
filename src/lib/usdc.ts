import { USDC_DECIMALS } from "@/config/agent-wallet";

const USDC_PATTERN = /^(0|[1-9]\d*)(?:\.(\d{1,6}))?$/;

export function parseUsdcAmount(value: string): bigint {
  if (typeof value !== "string" || value.length === 0 || value.trim() !== value) throw new Error("Invalid USDC amount");
  const match = USDC_PATTERN.exec(value);
  if (!match) throw new Error("Invalid USDC amount");
  const fraction = (match[2] ?? "").padEnd(USDC_DECIMALS, "0");
  return BigInt(match[1]) * 10n ** BigInt(USDC_DECIMALS) + BigInt(fraction || "0");
}

export function formatUsdcAmount(value: bigint): string {
  if (value < 0n) throw new Error("USDC amount cannot be negative");
  const scale = 10n ** BigInt(USDC_DECIMALS);
  const whole = value / scale;
  const fraction = (value % scale).toString().padStart(USDC_DECIMALS, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
