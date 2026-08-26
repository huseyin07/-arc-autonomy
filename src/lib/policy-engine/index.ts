import { ARC_TESTNET_CHAIN_ID } from "@/config/arc";
import type { PolicyCheck, PolicyEngineInput, PolicyEvaluation } from "@/types/policy";

const sameAddress = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** Pure, deterministic Phase 1 evaluator. Monetary execution must later use base-unit bigint values. */
export function evaluateTransactionIntent({ agent, intent, policy = {} }: PolicyEngineInput): PolicyEvaluation {
  const remaining = agent.dailySpendLimit - agent.dailySpent;
  const blocked = [...(agent.blockedRecipients ?? []), ...(policy.blockedRecipients ?? [])].some((r) => sameAddress(r, intent.recipient));
  const allowList = policy.allowedRecipients ?? agent.allowedRecipients;
  const recipientAllowed = !blocked && (allowList.length === 0 || allowList.some((r) => sameAddress(r, intent.recipient)));
  const checks: PolicyCheck[] = [
    { id: "chain", label: "Arc network", passed: intent.chainId === ARC_TESTNET_CHAIN_ID, severity: "critical", message: "Intent must target Arc Public Testnet." },
    { id: "asset", label: `${intent.asset} allowed`, passed: agent.allowedAssets.includes(intent.asset), severity: "critical" },
    { id: "status", label: "Agent active", passed: agent.status === "active", severity: "critical" },
    { id: "balance", label: "Sufficient balance", passed: intent.amount > 0 && intent.amount <= agent.balance, severity: "critical" },
    { id: "daily", label: "Daily budget available", passed: intent.amount <= remaining, severity: "critical" },
    { id: "transaction", label: "Below transaction limit", passed: intent.amount <= agent.singleTransactionLimit, severity: "critical" },
    { id: "recipient", label: "Recipient permitted", passed: recipientAllowed, severity: "critical", message: blocked ? "Recipient is blocked." : "Recipient is not allowlisted." },
  ];
  const violations = checks.filter((check) => !check.passed).map((check) => check.message ?? check.label);
  const policyPassed = violations.length === 0;
  return { allowed: policyPassed && intent.amount <= agent.approvalThreshold, requiresApproval: policyPassed && intent.amount > agent.approvalThreshold, checks, violations };
}
