import { ARC_TESTNET_CHAIN_ID } from "@/config/arc";
import type { Agent } from "@/types/agent";
import type { ActivityEvent, ApprovalIntent } from "@/types/activity";
import type { TransactionIntent } from "@/types/policy";

export const demoAgents: Agent[] = [
  { id: "research", name: "Research Agent", description: "Pays for approved data and research services.", walletAddress: "0x1234000000000000000000000000000000007890", status: "active", balance: 114.25, dailySpendLimit: 20, singleTransactionLimit: 10, approvalThreshold: 5, dailySpent: 3.2, allowedAssets: ["USDC"], allowedRecipients: ["0x1234000000000000000000000000000000007890"], createdAt: "2026-08-20T15:30:00Z" },
  { id: "operations", name: "Operations Agent", description: "Handles recurring software operations.", walletAddress: "0x9876000000000000000000000000000000004321", status: "paused", balance: 50, dailySpendLimit: 10, singleTransactionLimit: 8, approvalThreshold: 5, dailySpent: 0, allowedAssets: ["USDC"], allowedRecipients: [], createdAt: "2026-08-21T10:00:00Z" },
];
export const demoIntents: TransactionIntent[] = [
  { agentId: "research", recipient: "0x1234000000000000000000000000000000007890", asset: "USDC", amount: 2, chainId: ARC_TESTNET_CHAIN_ID },
  { agentId: "research", recipient: "0x1234000000000000000000000000000000007890", asset: "USDC", amount: 8, chainId: ARC_TESTNET_CHAIN_ID },
];
export const demoApprovals: ApprovalIntent[] = [{ id: "approval-1", agentName: "Research Agent", action: "Transfer", destination: "0x1234000000000000000000000000000000007890", amount: 8, asset: "USDC", reason: "Amount exceeds the 5.00 USDC owner approval threshold.", timestamp: "2026-08-26T15:38:00Z" }];
export const demoActivity: ActivityEvent[] = [
  { id: "evt-1", type: "policy_passed", agentName: "Research Agent", description: "Transfer 1.20 USDC", outcome: "POLICY PASSED", timestamp: "2026-08-26T15:41:00Z" },
  { id: "evt-2", type: "approval_requested", agentName: "Operations Agent", description: "Transfer 8.00 USDC", outcome: "APPROVAL REQUIRED", timestamp: "2026-08-26T15:38:00Z" },
  { id: "evt-3", type: "policy_changed", agentName: "Research Agent", description: "Approval threshold updated", outcome: "POLICY CHANGED", timestamp: "2026-08-26T14:12:00Z" },
];
