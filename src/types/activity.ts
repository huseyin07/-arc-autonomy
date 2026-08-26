export type ActivityType = "agent_created" | "policy_changed" | "transaction_requested" | "policy_passed" | "approval_requested" | "approval_granted" | "transaction_submitted" | "transaction_confirmed" | "transaction_blocked";
export interface ActivityEvent { id: string; type: ActivityType; agentName: string; description: string; outcome: string; timestamp: string; }
export interface ApprovalIntent { id: string; agentName: string; action: "Transfer"; destination: `0x${string}`; amount: number; asset: "USDC"; reason: string; timestamp: string; }
