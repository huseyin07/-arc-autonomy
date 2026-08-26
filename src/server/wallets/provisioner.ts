import type { Address } from "@/types/agent";
export interface CreateAgentWalletInput { walletSetId:string }
export interface ProvisionedAgentWallet { provider:"circle";providerWalletId:string;walletAddress:Address;blockchain:"ARC-TESTNET";accountType:"SCA"|"EOA";state?:string }
export interface AgentWalletProvisioner { createWallet(input:CreateAgentWalletInput):Promise<ProvisionedAgentWallet>;getWallet(walletId:string):Promise<ProvisionedAgentWallet> }
