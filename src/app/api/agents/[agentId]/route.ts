import { NextResponse } from "next/server";
import { agentService } from "@/server/agents/factory";
import { toPublicAgent } from "@/server/agents/service";
import { requireSession } from "@/server/auth/session";
import { agentIdSchema } from "@/server/validation";
import { AppError } from "@/server/errors";
import { errorResponse } from "@/server/http";
export const runtime = "nodejs";
export async function GET(_:Request,{params}:{params:Promise<{agentId:string}>}){try{const session=await requireSession();const {agentId}=await params;const id=agentIdSchema.parse(agentId);const agent=await agentService().get(session.userId,id);if(!agent)throw new AppError("NOT_FOUND",404,"Agent not found.");return NextResponse.json({data:{agent:toPublicAgent(agent)}})}catch(error){return errorResponse(error)}}
