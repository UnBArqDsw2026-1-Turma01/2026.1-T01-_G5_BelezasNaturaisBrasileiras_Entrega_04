CREATE TABLE IF NOT EXISTS "pontos" (
  "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
  "titulo"    TEXT        NOT NULL,
  "descricao" TEXT,
  "criadoPor" TEXT        NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "pontos_pkey" PRIMARY KEY ("id")
);
