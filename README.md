# ARC AUTONOMY

**Programmable financial control for autonomous agents on Arc.** ARC AUTONOMY is an Arc-native agent-wallet and programmable spending-policy platform. Its goal is to let autonomous software act economically while people retain explicit custody, authorization, and escalation controls.

## Current capabilities (Phase 2)

- Responsive public product site and operating-console routes.
- Isolated demo agents, approvals, and activity records (clearly marked as prototypes).
- Pure, deterministic policy evaluation for chain, asset, status, balance, budgets, thresholds, and recipient rules.
- Owner-wallet challenge/signature authentication with short-lived HttpOnly sessions.
- Authenticated, idempotent Circle Developer-Controlled Wallet provisioning on `ARC-TESTNET`.
- Owner-scoped persisted agent list/detail views backed by PostgreSQL repository interfaces.
- Local-only approval interactions. They never sign or submit transactions.
- Arc-only wagmi/viem wallet connection, active-chain detection, and explicit network switching.

## Architecture

The App Router lives in `src/app`. Shared presentation is in `src/components`; bounded product modules are in `src/features`; domain models are in `src/types`; centralized Arc configuration is in `src/config`; prototype fixtures are in `src/data`; and auditable domain logic is in `src/lib/policy-engine`.

The production boundary keeps **authentication**, **ownership**, **policy evaluation**, **provider provisioning**, and future **execution** separate. Circle responses are normalized behind `AgentWalletProvisioner`; Circle SDK types never enter the domain or browser. No private key enters the browser, database, or repository.

```text
BROWSER (owner wallet)
  │ challenge + signed message / authenticated request
  ▼
ARC AUTONOMY SERVER
  ├── signature authentication + HttpOnly session
  ├── ownership checks + rate-limit interface
  ├── PostgreSQL repositories
  ├── deterministic policy engine (no execution yet)
  └── AgentWalletProvisioner
             │ server-only credentials
             ▼
       CIRCLE WALLET SET
             ▼
         ARC TESTNET
```

## Run locally

Requirements: Node.js 20+ and npm.

```bash
cp .env.example .env.local
npm install
psql "$DATABASE_URL" -f migrations/001_phase2.sql
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Quality commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_ARC_RPC_URL` | Public Arc Testnet JSON-RPC endpoint. Public RPC URLs are not secrets. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Optional public WalletConnect Cloud project identifier. Enables that connector when present. |
| `CIRCLE_API_KEY` | Server-only Circle API key. |
| `CIRCLE_ENTITY_SECRET` | Server-only Circle Entity Secret used by Developer-Controlled Wallets. |
| `CIRCLE_AGENT_WALLET_SET_ID` | Reused ID of the one-time ARC AUTONOMY Agent Wallet Set. |
| `DATABASE_URL` | PostgreSQL connection string for users, challenges, idempotency records, and agents. |
| `AUTH_SESSION_SECRET` | Random server-only secret of at least 32 characters for HMAC-signed sessions. |
| `AUTH_APP_DOMAIN` | Trusted host included in authentication messages; required in production unless `VERCEL_PROJECT_PRODUCTION_URL` is available. |
| `ENABLE_CIRCLE_INTEGRATION_TESTS` | Must be exactly `true` before the opt-in wallet creation script will run. |

Never place private keys, signing material, API secrets, or custody credentials in `NEXT_PUBLIC_*` variables. Production deployments should use a secret manager and rotate credentials according to Circle policy.

On Vercel, configure every server-only value for the intended environment. Set `AUTH_APP_DOMAIN` to the exact public host (without a scheme), especially when using a custom domain. Authentication rejects requests whose effective URL host does not match the trusted configured host and never derives identity context from forwarded-host headers.

## Circle setup and Wallet Set initialization

1. Create/configure a Circle Developer-Controlled Wallets entity and register its Entity Secret using Circle's documented secure setup process.
2. Set `CIRCLE_API_KEY` and `CIRCLE_ENTITY_SECRET` only in the server environment.
3. Run `npm run circle:init-wallet-set` **once**. The script creates `ARC AUTONOMY Agents` and prints its ID.
4. Store the result as `CIRCLE_AGENT_WALLET_SET_ID`. The application never creates Wallet Sets at boot or per agent.

Wallets use the centralized `ARC-TESTNET` / `SCA` configuration. Confirm that the installed Circle SDK and Circle account support SCA on Arc Testnet before production deployment; provisioning fails rather than falling back silently. To perform one explicit live check, configure all Circle variables and run:

```bash
ENABLE_CIRCLE_INTEGRATION_TESTS=true npm run circle:integration
```

This creates a real wallet and is intentionally excluded from normal tests and CI.

Without PostgreSQL, authentication and real agent routes return a sanitized configuration/service error; the landing page and Phase 1 demo console remain usable, and repository-backed services remain unit-testable with in-memory fakes. Missing Circle credentials or Wallet Set configuration never falls back to a fake wallet.

## Authentication and ownership

The browser submits only its connected EVM address. The server constructs a five-minute challenge containing the application/domain, normalized address, random nonce, timestamps, Arc chain ID, and challenge ID. `viem` verifies the signed server-issued message. Challenges are atomically consumed in PostgreSQL, providing expiration and single-use replay protection. A successful verification creates a 15-minute HMAC-authenticated, `HttpOnly`, `SameSite=Lax` cookie (`Secure` in production).

The server derives `userId` from this cookie. Create/list/detail APIs do not accept an owner address. Every agent read uses `(owner_user_id, agent_id)`, so an authenticated owner cannot enumerate another owner's records. Provider wallet IDs remain server-side.

## Persistence and idempotency

Run `migrations/001_phase2.sql` against a Postgres-compatible database. Repository interfaces keep services unit-testable without an external DB. Persisted monetary limits are exact USDC base units (`numeric(30,0)` / `bigint`), never floating point. Secrets and signing material are not schema fields.

Agent creation reserves `(owner_user_id, idempotency_key)` before calling Circle. A completed retry returns the existing agent without provisioning another wallet. Concurrent duplicates return `409`. Any ambiguous Circle failure, or a persistence failure after Circle succeeds, leaves the reservation pending and disables client retry so another wallet cannot be created accidentally. Operators must reconcile that request against Circle before changing its state.

Authentication and provisioning endpoints use a rate-limit interface. Local development uses the process-local adapter; production automatically uses the shared PostgreSQL adapter with atomic bucket updates, making limits consistent across Vercel instances. Schedule periodic deletion of expired `rate_limit_buckets` rows as routine database maintenance.

## Arc network

- **Network:** Arc Public Testnet
- **Chain ID:** `5042002`
- **Execution:** EVM compatible
- **Primary asset / gas denomination:** USDC

The chain definition and RPC configuration are centralized in `src/config/arc.ts`, providing one replacement point for a future Arc Mainnet migration. No generic or multi-chain selection is exposed.

## Security disclaimer

Phase 2 provisions real Circle wallets but does not fund them, retrieve balances, enforce policy in a trusted execution environment, sign transactions, or submit blockchain transactions. The UI correctly reports new balances as `0.00 USDC` until balance retrieval exists. Future execution must use checked base-unit `bigint` values and repeat policy enforcement server-side. Do not use unfinished Phase 2 flows to control production funds.

## Roadmap

1. **Phase 1 — Interface + Policy Engine** ✓
2. **Phase 2 — Real Agent Wallet Provisioning** — implementation complete; live Circle verification pending
3. **Phase 3 — Arc USDC Execution**
4. **Phase 4 — Human Approval Signing**
5. **Phase 5 — Agent-to-Agent Payments**
6. **Phase 6 — Agent Marketplace / SDK**

### Recommended Phase 3 next step

Add a read-only Arc USDC balance service first: configure the canonical Arc Testnet USDC contract centrally, query balances with viem in base units, persist indexed balance/activity observations, and display freshness/error states. Only after that boundary is verified should Phase 3 introduce a server-side transaction-intent pipeline that re-evaluates policy immediately before Circle signing; do not expose an unrestricted transfer endpoint.
