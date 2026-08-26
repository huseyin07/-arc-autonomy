import type { Address, Agent, SupportedAsset } from "./agent";

export type PolicyType = "daily_spending_limit" | "transaction_limit" | "approval_threshold" | "allowed_recipient" | "blocked_recipient" | "allowed_asset" | "emergency_stop";
export interface PolicyConfiguration { allowedRecipients?: Address[]; blockedRecipients?: Address[]; }
export interface TransactionIntent { agentId: string; recipient: Address; asset: SupportedAsset; amount: number; chainId: number; }
export interface PolicyCheck { id: string; label: string; passed: boolean; severity: "info" | "warning" | "critical"; message?: string; }
export interface PolicyEvaluation { allowed: boolean; requiresApproval: boolean; checks: PolicyCheck[]; violations: string[]; }
export type PolicyEngineInput = { agent: Agent; intent: TransactionIntent; policy?: PolicyConfiguration };
