import { getAddress, verifyMessage, type Address } from "viem";
import { ARC_TESTNET_CHAIN_ID } from "@/config/arc";
import type { ChallengeRepository, UserRepository } from "@/server/domain";
import { AppError } from "@/server/errors";
import { logEvent } from "@/server/logger";
export class AuthService {
 constructor(private challenges:ChallengeRepository,private users:UserRepository,private now=()=>new Date()){}
 async createChallenge(address:Address,domain:string){const issued=this.now();const expires=new Date(issued.getTime()+5*60_000);const id=crypto.randomUUID();const nonce=crypto.randomUUID();const normalized=getAddress(address);const message=["ARC AUTONOMY Authentication",`Domain: ${domain}`,`Address: ${normalized}`,`Chain ID: ${ARC_TESTNET_CHAIN_ID} (Arc Public Testnet)`,`Nonce: ${nonce}`,`Issued At: ${issued.toISOString()}`,`Expiration Time: ${expires.toISOString()}`,`Challenge ID: ${id}`].join("\n");await this.challenges.create({id,walletAddress:normalized,message,expiresAt:expires});logEvent("auth.challenge.created",{challengeId:id});return {challengeId:id,message,expiresAt:expires.toISOString()}}
 async verify(challengeId:string,address:Address,signature:`0x${string}`){const normalized=getAddress(address);const challenge=await this.challenges.consume(challengeId,normalized,this.now());if(!challenge)throw new AppError("CHALLENGE_INVALID",401,"Challenge expired, already used, or does not match this wallet.");const valid=await verifyMessage({address:normalized,message:challenge.message,signature});if(!valid)throw new AppError("SIGNATURE_INVALID",401,"Wallet signature was rejected.");const user=await this.users.findOrCreateByWallet(normalized);logEvent("auth.signature.verified",{challengeId,userId:user.id});return user}
}
