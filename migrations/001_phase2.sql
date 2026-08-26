create table if not exists users (
  id uuid primary key, wallet_address varchar(42) not null unique, created_at timestamptz not null default now()
);
create table if not exists auth_challenges (
  id uuid primary key, wallet_address varchar(42) not null, message text not null,
  expires_at timestamptz not null, consumed_at timestamptz, created_at timestamptz not null default now()
);
create index if not exists auth_challenges_expiry_idx on auth_challenges (expires_at);
create table if not exists agents (
  id uuid primary key, owner_user_id uuid not null references users(id), name varchar(60) not null,
  description varchar(240) not null, provider varchar(20) not null, provider_wallet_id varchar(100) not null unique,
  wallet_address varchar(42) not null unique, blockchain varchar(32) not null check (blockchain = 'ARC-TESTNET'),
  account_type varchar(8) not null check (account_type in ('SCA', 'EOA')),
  status varchar(32) not null check (status in ('active', 'paused', 'requires_attention')),
  daily_spend_limit numeric(30,0) not null check (daily_spend_limit >= 0),
  single_transaction_limit numeric(30,0) not null check (single_transaction_limit >= 0),
  approval_threshold numeric(30,0) not null check (approval_threshold >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists agents_owner_idx on agents (owner_user_id, created_at desc);
create table if not exists agent_creation_requests (
  owner_user_id uuid not null references users(id), idempotency_key varchar(100) not null,
  status varchar(16) not null check (status in ('pending', 'completed')), agent_id uuid references agents(id), created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), primary key (owner_user_id, idempotency_key)
);
create table if not exists rate_limit_buckets (
  bucket_key varchar(255) primary key, window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0), updated_at timestamptz not null default now()
);
create index if not exists rate_limit_buckets_updated_idx on rate_limit_buckets (updated_at);
