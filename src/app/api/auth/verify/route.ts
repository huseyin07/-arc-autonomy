import { NextResponse } from "next/server";
import { AuthService } from "@/server/auth/service";
import { createSession } from "@/server/auth/session";
import { PostgresChallengeRepository, PostgresUserRepository } from "@/server/persistence/postgres";
import { verifySchema } from "@/server/validation";
import { rateLimiter, requestIp } from "@/server/rate-limit";
import { errorResponse } from "@/server/http";
export const runtime = "nodejs";
export async function POST(request:Request){try{const body=verifySchema.parse(await request.json());const ip=requestIp(request);await rateLimiter.check(`verify:ip:${ip}`,30,60_000);await rateLimiter.check(`verify:address:${body.address.toLowerCase()}`,10,60_000);const user=await new AuthService(new PostgresChallengeRepository(),new PostgresUserRepository()).verify(body.challengeId,body.address as `0x${string}`,body.signature as `0x${string}`);await createSession({userId:user.id,walletAddress:user.walletAddress});return NextResponse.json({data:{authenticated:true,walletAddress:user.walletAddress}})}catch(error){return errorResponse(error)}}
