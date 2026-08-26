import { NextResponse } from "next/server";
import { AuthService } from "@/server/auth/service";
import { PostgresChallengeRepository, PostgresUserRepository } from "@/server/persistence/postgres";
import { challengeSchema } from "@/server/validation";
import { rateLimiter, requestIp } from "@/server/rate-limit";
import { errorResponse } from "@/server/http";
import { getAuthenticationDomain } from "@/server/env";
export const runtime = "nodejs";
export async function POST(request:Request){try{const body=challengeSchema.parse(await request.json());const ip=requestIp(request);await rateLimiter.check(`challenge:ip:${ip}`,30,60_000);await rateLimiter.check(`challenge:address:${body.address.toLowerCase()}`,10,60_000);const domain=getAuthenticationDomain(request.url);const challenge=await new AuthService(new PostgresChallengeRepository(),new PostgresUserRepository()).createChallenge(body.address as `0x${string}`,domain);return NextResponse.json({data:challenge})}catch(error){return errorResponse(error)}}
