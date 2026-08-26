import { NextResponse } from "next/server";
import { agentService } from "@/server/agents/factory";
import { toPublicAgent } from "@/server/agents/service";
import { requireSession } from "@/server/auth/session";
import { errorResponse } from "@/server/http";
import { rateLimiter } from "@/server/rate-limit";
import { createAgentSchema } from "@/server/validation";
import { getCircleEnvironment } from "@/server/env";
export const runtime = "nodejs";
export async function GET(){try{const session=await requireSession();return NextResponse.json({data:{agents:(await agentService().list(session.userId)).map(toPublicAgent)}})}catch(error){return errorResponse(error)}}
export async function POST(request:Request){try{const session=await requireSession();await rateLimiter.check(`agent:${session.userId}`,5,60*60_000);const input=createAgentSchema.parse(await request.json());const {walletSetId}=getCircleEnvironment();const agent=await agentService().createAuthenticated(session.userId,input,walletSetId,request.headers.get("x-request-id")??crypto.randomUUID());return NextResponse.json({data:{agent:toPublicAgent(agent)}},{status:201})}catch(error){return errorResponse(error)}}
