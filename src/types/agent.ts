export type Address = `0x${string}`;
export type AgentStatus = "active" | "paused" | "requires_attention";
export type SupportedAsset = "USDC";

/** Decimal amounts are presentation-only in Phase 1; execution must use bigint base units. */
export interface Agent {
  id: string;
  name: string;
  description: string;
  walletAddress: Address;
  status: AgentStatus;
  balance: number;
  dailySpendLimit: number;
  singleTransactionLimit: number;
  approvalThreshold: number;
  dailySpent: number;
  allowedAssets: SupportedAsset[];
  allowedRecipients: Address[];
  blockedRecipients?: Address[];
  createdAt: string;
}
