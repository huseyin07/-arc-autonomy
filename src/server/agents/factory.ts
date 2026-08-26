import "server-only";
import { CircleAgentWalletProvisioner } from "@/server/circle/provisioner";
import { PostgresAgentRepository, PostgresIdempotencyRepository } from "@/server/persistence/postgres";
import { AgentService } from "./service";
export const agentService=()=>new AgentService(new PostgresAgentRepository(),new PostgresIdempotencyRepository(),new CircleAgentWalletProvisioner());
