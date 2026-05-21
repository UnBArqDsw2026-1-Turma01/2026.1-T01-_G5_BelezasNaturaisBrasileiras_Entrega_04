# Backend — BelezasNaturaisBrasileiras

## Stack
- **Runtime/Framework:** Node.js · TypeScript · NestJS 11
- **ORM:** Prisma 7 (cliente gerado em `src/generated/prisma/`)
- **Banco:** PostgreSQL 15 (Docker local) · Supabase Auth (produção)
- **Auth:** Passport JWT (`JwtAuthGuard` + `RolesGuard` + `@Roles()`)

## Regras de Negócio
Consulte `../docs/` antes de iniciar qualquer tarefa — é o nosso Single Source of Truth.

---

## Estrutura de Pastas

O projeto usa **módulos verticais** dentro de `src/modules/<modulo>/`:

```
src/
├── modules/
│   ├── accounts/            # Autenticação e usuários
│   │   ├── domain/
│   │   │   ├── entities/    # User.ts (Prototype)
│   │   │   ├── builders/    # UserBuilder.ts (Builder)
│   │   │   ├── interfaces/  # IUserRepository, IUserFactory, IUserFactoryRegistry, ISupabaseAuthService
│   │   │   └── validation/  # Chain of Responsibility: EmailUniquenessHandler → PasswordStrengthHandler → TermsAcceptanceHandler
│   │   ├── application/
│   │   │   └── use-cases/   # CreateAccountUseCase, LoginUseCase, PromoteUserUseCase
│   │   ├── infrastructure/
│   │   │   ├── factories/   # AdminUserFactory, CommonUserFactory, OrganizerUserFactory (Factory)
│   │   │   │               # UserFactoryRegistry (Factory Registry)
│   │   │   ├── mappers/     # UserMapper (toDomain / toPersistence)
│   │   │   ├── persistence/ # PrismaUserRepository
│   │   │   └── services/    # SupabaseAuthService
│   │   ├── interface/
│   │   │   └── controllers/ # AccountController (POST /accounts/signup|login|promote)
│   │   └── auth/            # JwtAuthGuard, RolesGuard, JwtStrategy, @Roles(), role.enum
│   │
│   ├── trilhas/             # Trilhas ecológicas
│   │   ├── domain/
│   │   │   ├── entities/    # Trilha.ts, Badge.ts
│   │   │   ├── commands/    # EditarTrilhaCommand, TrilhaCommandHistory (Command)
│   │   │   ├── iterators/   # TrilhaFilteredIterator, TrilhaPaginatedIterator (Iterator)
│   │   │   ├── localizacao/ # LocalizacaoComposita, LocalizacaoFolha (Composite)
│   │   │   ├── memento/     # TrilhaMemento, TrilhaCaretaker (Memento)
│   │   │   ├── observers/   # TrilhaEventEmitter, BadgeDistribuicaoObserver, NotificacaoObserver (Observer)
│   │   │   └── services/    # ConfirmationCodeService (Singleton), TrilhaRequestContext (AsyncLocalStorage), AuditLog
│   │   ├── application/
│   │   │   ├── TrilhaFacade.ts  # Facade → CriarTrilhaUseCase, ListarTrilhasUseCase, EditarTrilhaUseCase, FinalizarTrilhaUseCase, RestaurarTrilhaUseCase
│   │   │   └── use-cases/
│   │   ├── infrastructure/
│   │   │   └── persistence/ # PrismaTrilhaRepository, TrilhaProxyRepository (Protection Proxy),
│   │   │                    # AuditedTrilhaRepository (Decorator/Audit Proxy), CachedTrilhaRepository (Cache Proxy)
│   │   └── interface/
│   │       └── controllers/ # TrilhasController (GET|POST /trilhas, PATCH /trilhas/:id, POST /trilhas/:id/finalizar|restaurar)
│   │                        # GET /trilhas/badges/minhas, POST /trilhas/codigos/gerar|validar, GET /trilhas/status
│   │                        # POST /trilhas/localizacao/pontos
│   │
│   ├── inscricoes/          # Inscrições e check-in
│   │   ├── domain/
│   │   │   └── entities/    # Inscricao.ts — status: PENDENTE → ACEITA → PRESENTE | REJEITADA
│   │   ├── application/
│   │   │   ├── InscricaoFacade.ts  # Facade → SolicitarInscricaoUseCase, AceitarInscricaoUseCase,
│   │   │   │                       # RejeitarInscricaoUseCase, FazerCheckinUseCase, ListarInscricoesUseCase
│   │   │   └── use-cases/
│   │   └── interface/
│   │       └── controllers/ # InscricoesController (POST /inscricoes/trilha/:id, GET /inscricoes/minhas)
│   │                        # POST /inscricoes/:id/aceitar|rejeitar|checkin
│   │
│   ├── pontos-turisticos/   # Pontos turísticos
│   │   ├── application/     # PontosTuristicosService, BuscarFeedUseCase, CriarPontoUseCase, EditarPontoUseCase, DeletarPontoUseCase
│   │   ├── interface/
│   │   │   ├── controllers/ # PontosTuristicosController (GET|POST /pontos-turisticos, PUT|DELETE /pontos-turisticos/:id)
│   │   │   │                # POST /pontos-turisticos/:id/finalizar (Mediator)
│   │   │   └── proxies/     # PontosAuthProxy (Protection Proxy), PontosCacheProxy (Cache Proxy)
│   │   └── mediator/        # TrailLifecycleMediatorService (Mediator)
│   │                        # Handlers: AttendanceHandler, BadgeHandler, HistoryNotificationHandler, TrailStateHandler
│   │
│   ├── chat/                # Chat entre usuários
│   │   ├── pool/            # ChatObjectPoolService (Object Pool), ChatConnectionFactoryService
│   │   ├── repositories/    # ChatSessionRepository, ChatActivityRepository
│   │   └── chat.controller.ts  # GET /chat/pool/status, POST /chat/sessions, POST /chat/sessions/:id/messages, DELETE /chat/sessions/:id
│   │
│   └── adapters/            # Integrações externas (Adapter pattern)
│       ├── auth/            # AuthAdapterService → GoogleAuthAdapter (IAuthAdapter)
│       ├── map/             # MapAdapterService → GoogleMapsAdapter (IMapAdapter)
│       ├── notify/          # NotificationAdapterService → TwilioAdapter (INotificationAdapter)
│       ├── repositories/    # ExternalProviderConfigRepository, GeolocationCacheRepository, NotificationLogRepository
│       └── adapters.controller.ts  # GET /adapters/info, POST /adapters/geocode|route
│                                   # POST /adapters/notify/sms|whatsapp, POST /adapters/auth/validate
│
└── shared/
    └── infrastructure/
        ├── prisma/          # PrismaService
        └── supabase/        # supabase.provider.ts
```

---

## Padrões GoF Implementados

### Criacionais

| Padrão | Onde | Descrição |
|---|---|---|
| **Singleton** | `domain/services/ConfirmationCodeService.ts` | Instância única que gera e revoga códigos de confirmação de check-in |
| **Builder** | `domain/builders/UserBuilder.ts` | Construção fluente de `User` com validação |
| **Factory (Method)** | `infrastructure/factories/` | `AdminUserFactory`, `CommonUserFactory`, `OrganizerUserFactory` — cada role tem sua própria factory |
| **Factory Registry** | `infrastructure/factories/UserFactoryRegistry.ts` | Mapeia `UserRole → IUserFactory`; use `registry.get(role).create(...)` |
| **Prototype** | `domain/entities/User.ts` | `User.clone(overrides?)` para criar cópias com campos alterados (usado em `PromoteUserUseCase`) |

### Estruturais

| Padrão | Onde | Descrição |
|---|---|---|
| **Adapter** | `modules/adapters/` | `GoogleMapsAdapter` (geocode/route), `TwilioAdapter` (SMS/WhatsApp), `GoogleAuthAdapter` (OAuth) — todos implementam interface comum |
| **Composite** | `domain/localizacao/LocalizacaoComposita.ts` + `LocalizacaoFolha.ts` | Árvore estado → cidade → pontos turísticos com `getQuantidadePontos()` recursivo |
| **Decorator** | `infrastructure/persistence/AuditedTrilhaRepository.ts` | Intercepta operações do repositório e grava audit log |
| **Facade** | `application/TrilhaFacade.ts`, `application/InscricaoFacade.ts` | Ponto de entrada único para use cases; controladores delegam apenas para a facade |
| **Proxy** | `infrastructure/persistence/TrilhaProxyRepository.ts` | Protection Proxy — verifica `organizadorId` via `TrilhaRequestContext` antes do `save()` |
| | `infrastructure/persistence/CachedTrilhaRepository.ts` | Cache Proxy — evita consultas repetidas ao banco |
| | `interface/proxies/PontosAuthProxy.ts` | Protection Proxy para pontos turísticos |
| | `interface/proxies/PontosCacheProxy.ts` | Cache Proxy para pontos turísticos |
| **Object Pool** | `modules/chat/pool/ChatObjectPoolService.ts` | Pool de conexões de chat (max 50); `acquire()` / `release()` para reuso |

### Comportamentais

| Padrão | Onde | Descrição |
|---|---|---|
| **Chain of Responsibility** | `domain/validation/` | `EmailUniquenessHandler → PasswordStrengthHandler → TermsAcceptanceHandler` — validação encadeada no signup |
| **Command** | `domain/commands/EditarTrilhaCommand.ts` + `TrilhaCommandHistory.ts` | Encapsula edição de trilha; histórico permite undo |
| **Iterator** | `domain/iterators/TrilhaFilteredIterator.ts` + `TrilhaPaginatedIterator.ts` | `ListarTrilhasUseCase` filtra por status e pagina usando iteradores |
| **Mediator** | `mediator/TrailLifecycleMediatorService.ts` | Orquestra handlers (Attendance, Badge, History, TrailState) ao finalizar trilha |
| **Memento** | `domain/memento/TrilhaMemento.ts` + `TrilhaCaretaker.ts` | Salva estado antes de editar/finalizar; `RestaurarTrilhaUseCase` faz rollback via `caretaker.restore()` |
| **Observer** | `domain/observers/TrilhaEventEmitter.ts` | Notifica `BadgeDistribuicaoObserver` e `NotificacaoObserver` ao finalizar trilha |

---

## Fluxo Principal de Ponta a Ponta

```
1. Signup          POST /accounts/signup     → Chain of Responsibility (validação) → Factory (cria User por role) → Supabase + Prisma
2. Login           POST /accounts/login      → Supabase signIn → HS256 JWT gerado pelo backend
3. Criar Trilha    POST /trilhas [ORGANIZER] → JwtAuthGuard + RolesGuard → TrilhaFacade.criar → PrismaRepository
4. Listar Trilhas  GET  /trilhas             → TrilhaFacade.listar → Iterator (filtro + paginação)
5. Solicitar vaga  POST /inscricoes/trilha/:id [user] → InscricaoFacade.solicitar → PENDENTE
6. Aceitar         POST /inscricoes/:id/aceitar [org] → InscricaoFacade.aceitar → Singleton gera código → ACEITA
7. Check-in        POST /inscricoes/:id/checkin [org] → InscricaoFacade.fazerCheckin → Singleton valida + revoga → PRESENTE
8. Editar Trilha   PATCH /trilhas/:id [org]  → TrilhaRequestContext.run → TrilhaFacade.editar → Command (executa) + Memento (salva estado)
9. Restaurar       POST /trilhas/:id/restaurar [org] → TrilhaFacade.restaurar → Memento (caretaker.restore)
10. Finalizar      POST /trilhas/:id/finalizar [org] → Memento (salva) → Mediator (4 handlers) → Observer (badge + notificação)
```

---

## Regras de Arquitetura

- **Nunca** importe `infrastructure` ou `interface` dentro de `domain` ou `application`.
- **Nunca** importe `@prisma/client` fora de `infrastructure/`.
- Use `UserMapper.toDomain()` e `UserMapper.toPersistence()` — o Prisma nunca chega ao domínio.
- Use Cases dependem de **interfaces** (`IUserRepository`), nunca de classes concretas.
- Repositórios ficam em `infrastructure/persistence/` e implementam interfaces de `domain/interfaces/`.
- Controllers **apenas** delegam ao Use Case / Facade e tratam o retorno HTTP.

### Autenticação
- Senhas nunca entram no Prisma — Supabase Auth é a única fonte de verdade para credenciais.
- O `User.id` no Prisma **é** o `supabaseId` (UUID gerado pelo Supabase).
- `LoginUseCase` autentica via Supabase e emite um **HS256 JWT** assinado com `JWT_SECRET`.
- `JwtStrategy` usa `JWT_SECRET` (HS256) quando disponível; cai para `SUPABASE_JWT_PUBLIC_KEY` (ES256) apenas se `JWT_SECRET` não estiver definido.
- Rotas protegidas usam `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)`.

---

## Comandos

```bash
# Desenvolvimento
npm run start:dev          # Inicia o servidor

# Qualidade (rode antes de abrir PR)
npm run lint               # ESLint + Prettier --fix
npm run test               # Jest (unit tests)
npm run test:cov           # Cobertura de testes

# Prisma
npm run prisma:generate    # Regenera o cliente após mudança no schema
npm run prisma:migrate:dev # Cria e aplica migration em dev
npm run prisma:studio      # Abre Prisma Studio (UI do banco)

# Build
npm run build
```

---

## Setup Local (Docker)

> Troubleshooting detalhado em `.claude/docker-setup.md`.

```bash
cp .env.example .env.local   # Copiar variáveis de ambiente
docker-compose up -d         # Subir PostgreSQL + pgAdmin
```

- **pgAdmin:** `http://localhost:5050` (credenciais em `.env.local`)
- **Conectar ao banco no pgAdmin:** host `postgres`, porta `5432`
- `docker-compose down` preserva dados · `docker-compose down -v` apaga tudo

---

## Referência Rápida (leia sob demanda)

| Preciso de... | Arquivo |
|---|---|
| Camadas e responsabilidades | `.claude/arch.md` |
| Mappers, DTOs, inversão de dependência | `.claude/code-style.md` |
| Prisma, migrations, Supabase | `.claude/db-guidelines.md` |
| Testes unitários (AAA, mocks, localização) | `.claude/testing.md` |
| Checklist de revisão antes de finalizar | `.claude/review-checklist.md` |
