-- Migration: add chat sessions, chat activity, external providers, notification logs, trail lifecycle events, saga state

CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userAId" varchar(255) NOT NULL,
  "userBId" varchar(255) NOT NULL,
  "connectionId" varchar(255),
  "startedAt" timestamptz NOT NULL DEFAULT now(),
  "endedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS chat_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "chatSessionId" uuid NOT NULL,
  payload jsonb NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS external_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key varchar(255) UNIQUE NOT NULL,
  provider varchar(255) NOT NULL,
  config jsonb NOT NULL,
  active boolean NOT NULL DEFAULT true,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "to" varchar(255) NOT NULL,
  provider varchar(255) NOT NULL,
  status varchar(50) NOT NULL,
  "externalId" varchar(255),
  payload jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trail_lifecycle_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "trailId" uuid NOT NULL,
  "eventType" varchar(255) NOT NULL,
  payload jsonb,
  status varchar(50) NOT NULL DEFAULT 'pending',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "processedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS trail_saga_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state jsonb NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
