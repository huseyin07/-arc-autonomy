import { AppError } from "./errors";
import { database } from "./persistence/postgres";
export interface RateLimiter { check(key:string,limit:number,windowMs:number):Promise<void> }
export const requestIp = (request:Request) => (request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown").slice(0,64);
const buckets = new Map<string,{count:number;reset:number}>();
/** Development-only process-local fallback. Production multi-instance deployments must inject a shared backend. */
export class InMemoryRateLimiter implements RateLimiter { async check(key:string,limit:number,windowMs:number){const now=Date.now();const b=buckets.get(key);if(!b||b.reset<=now){buckets.set(key,{count:1,reset:now+windowMs});return}if(b.count>=limit)throw new AppError("RATE_LIMITED",429,"Too many requests. Try again later.");b.count++} }
/** Shared fixed-window limiter for Vercel/multi-instance production deployments. */
export class PostgresRateLimiter implements RateLimiter {async check(key:string,limit:number,windowMs:number){const now=new Date();const resetBefore=new Date(now.getTime()-windowMs);const [row]=await database()`insert into rate_limit_buckets (bucket_key,window_started_at,request_count,updated_at) values (${key},${now},1,${now}) on conflict (bucket_key) do update set request_count=case when rate_limit_buckets.window_started_at<=${resetBefore} then 1 else rate_limit_buckets.request_count+1 end, window_started_at=case when rate_limit_buckets.window_started_at<=${resetBefore} then ${now} else rate_limit_buckets.window_started_at end, updated_at=${now} returning request_count`;if(Number(row.request_count)>limit)throw new AppError("RATE_LIMITED",429,"Too many requests. Try again later.")}}
export const rateLimiter:RateLimiter = process.env.NODE_ENV==="production"?new PostgresRateLimiter():new InMemoryRateLimiter();
