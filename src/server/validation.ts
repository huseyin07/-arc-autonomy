import { z } from "zod";
const address=z.string().regex(/^0x[a-fA-F0-9]{40}$/,"Invalid wallet address");
export const challengeSchema=z.object({address});
export const verifySchema=z.object({challengeId:z.string().uuid(),address,signature:z.string().regex(/^0x[a-fA-F0-9]+$/).max(132)});
const usdc=z.string().min(1).max(31).regex(/^(0|[1-9]\d{0,23})(?:\.\d{1,6})?$/);
export const createAgentSchema=z.object({name:z.string().trim().min(2).max(60),description:z.string().trim().min(1).max(240),dailySpendLimit:usdc,singleTransactionLimit:usdc,approvalThreshold:usdc,idempotencyKey:z.string().uuid()}).strict();
export const agentIdSchema=z.string().uuid();
