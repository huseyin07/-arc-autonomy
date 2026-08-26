import "server-only";
import postgres, { type Sql } from "postgres";
import type { Address } from "@/types/agent";
import type { AgentRecord, AgentRepository, AuthChallengeRecord, ChallengeRepository, IdempotencyRepository, UserRecord, UserRepository } from "@/server/domain";
import { getDatabaseUrl } from "@/server/env";

let client: Sql | undefined;
export function database(): Sql { return client ??= postgres(getDatabaseUrl(), { max: 10, idle_timeout: 20 }); }
const user = (r: Record<string, unknown>): UserRecord => ({ id: String(r.id), walletAddress: String(r.wallet_address) as Address, createdAt: new Date(String(r.created_at)) });
const agent = (r: Record<string, unknown>): AgentRecord => ({ id:String(r.id), ownerUserId:String(r.owner_user_id), name:String(r.name), description:String(r.description), provider:"circle", providerWalletId:String(r.provider_wallet_id), walletAddress:String(r.wallet_address) as Address, blockchain:"ARC-TESTNET", accountType:String(r.account_type) as "SCA"|"EOA", status:String(r.status) as AgentRecord["status"], dailySpendLimit:BigInt(String(r.daily_spend_limit)), singleTransactionLimit:BigInt(String(r.single_transaction_limit)), approvalThreshold:BigInt(String(r.approval_threshold)), createdAt:new Date(String(r.created_at)), updatedAt:new Date(String(r.updated_at)) });

export class PostgresUserRepository implements UserRepository {
  async findOrCreateByWallet(address: Address) { const [r]=await database()`insert into users (id,wallet_address) values (${crypto.randomUUID()},${address.toLowerCase()}) on conflict (wallet_address) do update set wallet_address=excluded.wallet_address returning *`; return user(r); }
  async findById(id:string) { const [r]=await database()`select * from users where id=${id}`; return r?user(r):null; }
}
export class PostgresAgentRepository implements AgentRepository {
  async create(a:AgentRecord){const [r]=await database()`insert into agents (id,owner_user_id,name,description,provider,provider_wallet_id,wallet_address,blockchain,account_type,status,daily_spend_limit,single_transaction_limit,approval_threshold,created_at,updated_at) values (${a.id},${a.ownerUserId},${a.name},${a.description},${a.provider},${a.providerWalletId},${a.walletAddress},${a.blockchain},${a.accountType},${a.status},${a.dailySpendLimit.toString()},${a.singleTransactionLimit.toString()},${a.approvalThreshold.toString()},${a.createdAt},${a.updatedAt}) returning *`;return agent(r)}
  async listByOwner(owner:string){return (await database()`select * from agents where owner_user_id=${owner} order by created_at desc`).map(agent)}
  async findByOwnerAndId(owner:string,id:string){const [r]=await database()`select * from agents where id=${id} and owner_user_id=${owner}`;return r?agent(r):null}
}
export class PostgresChallengeRepository implements ChallengeRepository {
  async create(c:AuthChallengeRecord){await database()`insert into auth_challenges (id,wallet_address,message,expires_at) values (${c.id},${c.walletAddress.toLowerCase()},${c.message},${c.expiresAt})`}
  async consume(id:string,address:Address,now:Date){const [r]=await database()`update auth_challenges set consumed_at=${now} where id=${id} and wallet_address=${address.toLowerCase()} and consumed_at is null and expires_at>${now} returning *`;return r?{id:String(r.id),walletAddress:String(r.wallet_address) as Address,message:String(r.message),expiresAt:new Date(String(r.expires_at)),consumedAt:new Date(String(r.consumed_at))}:null}
}
export class PostgresIdempotencyRepository implements IdempotencyRepository {
  async reserve(owner:string,key:string){const rows=await database()`insert into agent_creation_requests (owner_user_id,idempotency_key,status) values (${owner},${key},'pending') on conflict do nothing returning status`;if(rows.length)return "reserved";const [r]=await database()`select status from agent_creation_requests where owner_user_id=${owner} and idempotency_key=${key}`;return r?.status==="completed"?"completed":"pending"}
  async complete(owner:string,key:string,agentId:string){await database()`update agent_creation_requests set status='completed',agent_id=${agentId},updated_at=now() where owner_user_id=${owner} and idempotency_key=${key}`}
  async getCompletedAgentId(owner:string,key:string){const [r]=await database()`select agent_id from agent_creation_requests where owner_user_id=${owner} and idempotency_key=${key} and status='completed'`;return r?.agent_id?String(r.agent_id):null}
}
