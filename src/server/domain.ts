import type { Address } from "@/types/agent";
export interface UserRecord { id: string; walletAddress: Address; createdAt: Date }
export interface AgentRecord {
  id: string; ownerUserId: string; name: string; description: string; provider: "circle";
  providerWalletId: string; walletAddress: Address; blockchain: "ARC-TESTNET"; accountType: "SCA" | "EOA";
  status: "active" | "paused" | "requires_attention"; dailySpendLimit: bigint;
  singleTransactionLimit: bigint; approvalThreshold: bigint; createdAt: Date; updatedAt: Date;
}
export interface AuthChallengeRecord { id: string; walletAddress: Address; message: string; expiresAt: Date; consumedAt?: Date }

export interface UserRepository { findOrCreateByWallet(address: Address): Promise<UserRecord>; findById(id: string): Promise<UserRecord | null> }
export interface AgentRepository {
  create(agent: AgentRecord): Promise<AgentRecord>; listByOwner(ownerUserId: string): Promise<AgentRecord[]>;
  findByOwnerAndId(ownerUserId: string, agentId: string): Promise<AgentRecord | null>;
}
export interface ChallengeRepository { create(challenge: AuthChallengeRecord): Promise<void>; consume(id: string, address: Address, now: Date): Promise<AuthChallengeRecord | null> }
export interface IdempotencyRepository {
  reserve(ownerUserId: string, key: string): Promise<"reserved" | "pending" | "completed">;
  complete(ownerUserId: string, key: string, agentId: string): Promise<void>;
  getCompletedAgentId(ownerUserId: string, key: string): Promise<string | null>;
}
