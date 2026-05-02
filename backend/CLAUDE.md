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

## Comandos Úteis
- Build: `npm run build`
- Testes: `npm run test`
- Lint: `npm run lint` (Sempre rode antes de entregar).
- Prisma: `npx prisma generate`

## Regras Universais
- Nunca importe `infrastructure` ou `interface` dentro de `domain`.
- Use Mappers para isolar o Prisma do Domínio.
- Se a lógica de negócio mudar, atualize os documentos em `../docs/`.