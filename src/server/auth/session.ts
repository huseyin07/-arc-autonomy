import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { AppError } from "../errors";
import { getSessionSecret } from "@/server/env";
const COOKIE="arc_session"; const MAX_AGE=15*60;
type Session={userId:string;walletAddress:`0x${string}`;expiresAt:number};
const sign=(payload:string)=>createHmac("sha256",getSessionSecret()).update(payload).digest("base64url");
export async function createSession(session:Omit<Session,"expiresAt">){const value:Session={...session,expiresAt:Date.now()+MAX_AGE*1000};const payload=Buffer.from(JSON.stringify(value)).toString("base64url");(await cookies()).set(COOKIE,`${payload}.${sign(payload)}`,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:MAX_AGE})}
export async function getSession():Promise<Session|null>{const raw=(await cookies()).get(COOKIE)?.value;if(!raw)return null;const [payload,signature]=raw.split(".");if(!payload||!signature)return null;const expected=sign(payload);if(signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return null;try{const value=JSON.parse(Buffer.from(payload,"base64url").toString()) as Session;return value.expiresAt>Date.now()?value:null}catch{return null}}
export async function requireSession(){const session=await getSession();if(!session)throw new AppError("UNAUTHENTICATED",401,"Connect and authenticate your owner wallet.");return session}
