import { describe, expect, it } from "vitest";
import { ARC_TESTNET_CHAIN_ID } from "@/config/arc";
import { evaluateTransactionIntent } from ".";
import type { Agent } from "@/types/agent";
const recipient="0x1234000000000000000000000000000000007890" as const;
const agent:Agent={id:"a",name:"Agent",description:"",walletAddress:"0x0000000000000000000000000000000000000001",status:"active",balance:100,dailySpendLimit:20,singleTransactionLimit:10,approvalThreshold:5,dailySpent:2,allowedAssets:["USDC"],allowedRecipients:[recipient],createdAt:"2026-01-01T00:00:00Z"};
const intent={agentId:"a",recipient,asset:"USDC" as const,amount:2,chainId:ARC_TESTNET_CHAIN_ID};
const run=(agentPatch:Partial<Agent>={},intentPatch:Partial<typeof intent>={})=>evaluateTransactionIntent({agent:{...agent,...agentPatch},intent:{...intent,...intentPatch}});
describe("evaluateTransactionIntent",()=>{
 it("allows a valid transaction",()=>expect(run()).toMatchObject({allowed:true,requiresApproval:false,violations:[]}));
 it("rejects the wrong chain",()=>expect(run({}, {chainId:1}).allowed).toBe(false));
 it("rejects an inactive agent",()=>expect(run({status:"paused"}).allowed).toBe(false));
 it("rejects an amount over balance",()=>expect(run({balance:1}).allowed).toBe(false));
 it("rejects an exceeded daily limit",()=>expect(run({dailySpent:19}).allowed).toBe(false));
 it("rejects an exceeded transaction limit",()=>expect(run({singleTransactionLimit:1}).allowed).toBe(false));
 it("escalates above the approval threshold",()=>expect(run({}, {amount:8})).toMatchObject({allowed:false,requiresApproval:true,violations:[]}));
 it("rejects a blocked recipient",()=>expect(run({blockedRecipients:[recipient]}).allowed).toBe(false));
});
