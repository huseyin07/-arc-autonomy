import "server-only";
import { getAddress, isAddress } from "viem";
import { AGENT_WALLET_CONFIG } from "@/config/agent-wallet";
import { AppError } from "@/server/errors";
import type { AgentWalletProvisioner, CreateAgentWalletInput, ProvisionedAgentWallet } from "@/server/wallets/provisioner";
import { circleClient } from "./client";
type CircleWallet={id?:string;address?:string;blockchain?:string;accountType?:string;state?:string};
function normalize(wallet:CircleWallet):ProvisionedAgentWallet {const accountType=wallet.accountType;if(!wallet.id||!wallet.address||!isAddress(wallet.address)||wallet.blockchain!==AGENT_WALLET_CONFIG.blockchain||(accountType!=="SCA"&&accountType!=="EOA"))throw new AppError("CIRCLE_INVALID_RESPONSE",502,"Circle returned an invalid Arc wallet response.");return {provider:"circle",providerWalletId:wallet.id,walletAddress:getAddress(wallet.address),blockchain:AGENT_WALLET_CONFIG.blockchain,accountType,state:wallet.state}}
export class CircleAgentWalletProvisioner implements AgentWalletProvisioner {
 async createWallet(input:CreateAgentWalletInput){try{const response=await circleClient().createWallets({accountType:AGENT_WALLET_CONFIG.accountType,blockchains:[AGENT_WALLET_CONFIG.blockchain],count:1,walletSetId:input.walletSetId});const wallet=response.data?.wallets?.[0];return normalize(wallet??{})}catch(error){if(error instanceof AppError)throw error;throw new AppError("CIRCLE_REQUEST_FAILED",502,"Circle could not provision the Arc wallet.")}}
 async getWallet(walletId:string){try{const response=await circleClient().getWallet({id:walletId});return normalize(response.data?.wallet??{})}catch(error){if(error instanceof AppError)throw error;throw new AppError("CIRCLE_REQUEST_FAILED",502,"Circle could not retrieve the Arc wallet.")}}
}
