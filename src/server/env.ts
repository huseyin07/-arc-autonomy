import "server-only";
import { z } from "zod";
import { AppError } from "./errors";

const nonEmpty = z.string().trim().min(1);
const forbiddenPublicSecretNames = [
  "NEXT_PUBLIC_CIRCLE_API_KEY",
  "NEXT_PUBLIC_CIRCLE_ENTITY_SECRET",
  "NEXT_PUBLIC_CIRCLE_AGENT_WALLET_SET_ID",
  "NEXT_PUBLIC_DATABASE_URL",
  "NEXT_PUBLIC_AUTH_SESSION_SECRET",
] as const;

function assertNoPublicSecretAliases() {
  if (forbiddenPublicSecretNames.some((name) => process.env[name])) {
    throw new AppError("UNSAFE_ENVIRONMENT", 503, "A server credential is configured with an unsafe public prefix.");
  }
}

function parse<T extends z.ZodTypeAny>(schema: T, values: unknown, code: string, message: string): z.infer<T> {
  const result = schema.safeParse(values);
  if (!result.success) throw new AppError(code, 503, message);
  return result.data;
}

export function getCircleEnvironment() {
  assertNoPublicSecretAliases();
  return parse(
    z.object({
      apiKey: nonEmpty,
      entitySecret: z.string().regex(/^[a-fA-F0-9]{64}$/),
      walletSetId: z.string().uuid(),
    }),
    {
      apiKey: process.env.CIRCLE_API_KEY,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      walletSetId: process.env.CIRCLE_AGENT_WALLET_SET_ID,
    },
    "CIRCLE_NOT_CONFIGURED",
    "Circle wallet provisioning is not configured.",
  );
}

export function getCircleCredentials() {
  const environment = getCircleEnvironment();
  return { apiKey: environment.apiKey, entitySecret: environment.entitySecret };
}

export function getDatabaseUrl() {
  assertNoPublicSecretAliases();
  return parse(
    z.string().url().refine((value: string) => value.startsWith("postgres://") || value.startsWith("postgresql://")),
    process.env.DATABASE_URL,
    "DATABASE_NOT_CONFIGURED",
    "Database persistence is not configured.",
  );
}

export function getSessionSecret() {
  assertNoPublicSecretAliases();
  return parse(
    z.string().min(32),
    process.env.AUTH_SESSION_SECRET,
    "AUTH_NOT_CONFIGURED",
    "Authentication is not configured.",
  );
}

/** Uses trusted deployment configuration in production; forwarded host headers are never consulted. */
export function getAuthenticationDomain(requestUrl: string) {
  const configured = process.env.AUTH_APP_DOMAIN ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (configured) {
    const trusted = configured.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
    if (new URL(requestUrl).host.toLowerCase() !== trusted) {
      throw new AppError("AUTH_DOMAIN_MISMATCH", 403, "Authentication is not available on this domain.");
    }
    return trusted;
  }
  if (process.env.NODE_ENV === "production") {
    throw new AppError("AUTH_DOMAIN_NOT_CONFIGURED", 503, "Authentication domain is not configured.");
  }
  return new URL(requestUrl).host.toLowerCase();
}
