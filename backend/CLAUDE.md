# Projeto Backend (NestJS + Clean Arch)

## Escopo e Contexto
- **Stack:** TypeScript, NestJS, Prisma, PostgreSQL.
- **Localização:** Você está na pasta `./backend`.
- **Regras de Negócio:** SEMPRE consulte `../docs/` antes de iniciar qualquer tarefa. É o nosso "Single Source of Truth".

## Mapa do Tesouro (Divulgação Progressiva)
Para manter o contexto limpo, leia os arquivos abaixo apenas quando a tarefa exigir:

- **Arquitetura & Pastas:** Consulte `./.claude/arch.md` para entender as camadas (Domain, Application, etc).
- **Padrões de Código:** Consulte `./.claude/code-style.md` para Mappers, DTOs e inversão de dependência.
- **Banco de Dados:** Consulte `./.claude/db-guidelines.md` para regras de Prisma e Migrations.
- **Testes unitários:** Consulte `./.claude/testing.md` para regras dos testes unitários.
- **Revisão:** Consulte `./.claude/review-checklist.md` antes de finalizar.

## Setup do Banco de Dados Local (Docker)

> Detalhes técnicos e troubleshooting em `./.claude/docker-setup.md`.

1. Copie o arquivo de variáveis: `cp .env.example .env.local`
2. Suba o banco: `docker-compose up -d`
3. Acesse o pgAdmin em `http://localhost:5050` (credenciais em `.env.local`)
4. Para conectar ao banco no pgAdmin: host `postgres`, porta `5432`, usuário/senha conforme `.env.local`
5. Para parar: `docker-compose down` (dados persistem no volume `bnb_postgres_data`)

## Comandos Úteis
- Build: `npm run build`
- Testes: `npm run test`
- Lint: `npm run lint` (Sempre rode antes de entregar).
- Prisma: `npx prisma generate`

## Regras Universais
- Nunca importe `infrastructure` ou `interface` dentro de `domain`.
- Use Mappers para isolar o Prisma do Domínio.
- Se a lógica de negócio mudar, atualize os documentos em `../docs/`.