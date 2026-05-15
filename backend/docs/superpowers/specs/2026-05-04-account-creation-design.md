# Design Spec: Account Creation com Factory Pattern

**Data:** 2026-05-04  
**Módulo:** accounts  
**Status:** Design Aprovado  

---

## 1. Visão Geral

Implementar um endpoint `/accounts/signup` que permite criar uma conta de usuário integrando **Supabase Auth** (autenticação) com **PostgreSQL/Prisma** (persistência de metadados). Utilizará **Factory Pattern** (GoF Criacional) para desacoplar a criação de User entities.

**Stack:** TypeScript, NestJS, Prisma, PostgreSQL, Supabase Auth

---

## 2. Requisitos & Constraints

### Funcionais (RF01 - Design Sprint)

- [x] Criar conta via email + senha
- [x] Validar email (Supabase envia confirmação)
- [x] Persistir metadados do usuário (id, email, nome, role, fotoPerfil, timestamps)
- [x] Retornar dados do usuário criado
- [x] Rollback automático se falha na persistência

### Não-Funcionais

- Foto de perfil: adicionada **depois** (não no signup)
- Role inicial: sempre **COMMON_USER** (sem promoção ainda)
- Email verification: **obrigatória** (Supabase valida)
- Resposta: **201 Created** com dados do user
- Erros: **400 Bad Request** com mensagem clara

### Constraints de Arquitetura

- Clean Architecture: Domain → Application → Infrastructure → Interface
- Dependency Inversion: tudo depende de interfaces
- Factory Pattern para criação de User
- Rollback em cascata: se BD falha, deleta do Supabase

---

## 3. Arquitetura de Solução

### Estrutura de Pastas

```
src/modules/accounts/
├── domain/
│   ├── entities/User.ts
│   └── interfaces/
│       ├── IUserFactory.ts
│       ├── IUserFactoryRegistry.ts
│       ├── IUserRepository.ts
│       └── ISupabaseAuthService.ts
├── application/
│   ├── use-cases/CreateAccountUseCase.ts
│   └── dtos/
│       ├── CreateAccountInput.ts
│       └── CreateAccountOutput.ts
├── infrastructure/
│   ├── factories/
│   │   ├── CommonUserFactory.ts
│   │   ├── UserFactoryRegistry.ts
│   │   └── index.ts
│   ├── services/SupabaseAuthService.ts
│   ├── persistence/PrismaUserRepository.ts
│   └── mappers/UserMapper.ts
├── interface/
│   ├── controllers/AccountController.ts
│   └── providers/UserFactoryProvider.ts
└── accounts.module.ts
```

### Camadas & Responsabilidades

| Camada | Classe | Responsabilidade |
|--------|--------|------------------|
| **Domain** | `User` | Entidade pura, regras de negócio |
| **Domain** | `IUserFactory` | Contrato: como criar User |
| **Domain** | `IUserFactoryRegistry` | Contrato: registrar/buscar factories |
| **Application** | `CreateAccountUseCase` | Orquestrar: Supabase → Factory → Repository |
| **Infrastructure** | `CommonUserFactory` | Implementação: criar User com role COMMON_USER |
| **Infrastructure** | `UserFactoryRegistry` | Implementação: mapear role → factory |
| **Infrastructure** | `SupabaseAuthService` | Integração com Supabase Auth |
| **Infrastructure** | `PrismaUserRepository` | Persistência: salvar/buscar User no BD |
| **Interface** | `AccountController` | HTTP endpoint `/accounts/signup` |

### Fluxo de Criação (Happy Path)

```
1. POST /accounts/signup
   Input: {email, password, nome}

2. AccountController.signup()
   → valida DTO (class-validator)

3. CreateAccountUseCase.execute()
   a. SupabaseAuthService.createUser(email, password)
      → Supabase retorna {uid}
      → Supabase envia email de confirmação
   
   b. UserFactoryRegistry.get(COMMON_USER)
      → retorna CommonUserFactory
   
   c. CommonUserFactory.create(uid, email, nome)
      → retorna User entity com role: COMMON_USER
   
   d. PrismaUserRepository.save(user)
      → persiste no PostgreSQL
      → retorna User com timestamps
   
   e. UserMapper.toPersistence(user)
      → converte para CreateAccountOutput DTO

4. Response 201 Created
   Output: {id, email, nome, role, createdAt, updatedAt}
```

### Fluxo de Erro (Rollback)

```
1. SupabaseAuthService.createUser() ✅ {uid}
2. CommonUserFactory.create() ✅ User entity
3. PrismaUserRepository.save() ❌ PostgreSQL error
   ↓
4. CreateAccountUseCase.execute() catch
   → SupabaseAuthService.deleteUser(uid) ← rollback
   → throw new Error("Falha ao salvar usuário...")
   
5. AccountController.signup() catch
   → BadRequestException(error.message)

6. Response 400 Bad Request
   Output: {statusCode: 400, message: "...", error: "Bad Request"}
```

---

## 4. Entidades & Tipos

### User Entity

```typescript
export enum UserRole {
  COMMON_USER = 'COMMON_USER',
  ORGANIZER = 'ORGANIZER',    // para expansão futura
  ADMIN = 'ADMIN',            // para expansão futura
}

export class User {
  id: string;                 // Supabase UID
  email: string;
  nome: string;
  role: UserRole;
  fotoPerfil: string | null;  // null no signup
  createdAt: Date;
  updatedAt: Date;
  
  constructor(...)  // standard constructor
}
```

### DTOs

#### CreateAccountInput (validação via class-validator)

```typescript
export class CreateAccountInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  nome: string;
}
```

#### CreateAccountOutput

```typescript
export class CreateAccountOutput {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 5. Factory Pattern

### Por que Factory?

- Desacopla criação de User do resto do código
- Escalável: adicionar novo role = nova factory (zero mudança em existing code)
- Cada factory pode ter lógica específica de inicialização
- Alinha com SOLID (SRP)

### Implementação

#### IUserFactory (Domain Interface)

```typescript
export interface IUserFactory {
  create(id: string, email: string, nome: string): User;
}
```

#### CommonUserFactory (Infrastructure Implementation)

```typescript
@Injectable()
export class CommonUserFactory implements IUserFactory {
  create(id: string, email: string, nome: string): User {
    return new User(id, email, nome, UserRole.COMMON_USER);
  }
}
```

#### UserFactoryRegistry (Infrastructure)

```typescript
@Injectable()
export class UserFactoryRegistry implements IUserFactoryRegistry {
  private registry: Map<UserRole, IUserFactory> = new Map();

  register(role: UserRole, factory: IUserFactory): void {
    this.registry.set(role, factory);
  }

  get(role: UserRole): IUserFactory {
    const factory = this.registry.get(role);
    if (!factory) {
      throw new Error(`Factory não registrada para role: ${role}`);
    }
    return factory;
  }
}
```

### Expansion Path (Futuro)

Quando implementar promoção de user → ORGANIZER/ADMIN:

1. Criar `OrganizerFactory` e `AdminFactory`
2. Registrar em `UserFactoryProvider`: `registry.register(ORGANIZER, ...)`
3. Criar `PromoteUserUseCase` que usa `registry.get(newRole)`
4. **Zero refactoring** na arquitetura existente ✅

---

## 6. Integração com Supabase Auth

### Fluxo

1. Backend: `SupabaseAuthService.createUser(email, password)`
   - Chama Supabase Auth API
   - Supabase cria user e envia email de confirmação
   - Retorna `{uid: string}`

2. Backend: Persiste em PostgreSQL vinculado ao `uid`

3. Cliente: Recebe `uid` e pode fazer login
   - Supabase verifica email_confirmed
   - Apenas usuários com email confirmado fazem login completo

### Rollback (Garantia de Consistência)

Se `PrismaUserRepository.save()` falha:
- `SupabaseAuthService.deleteUser(uid)` é chamado
- Garante que não há user órfão (criado em Supabase mas não no BD)

---

## 7. Use Case: CreateAccountUseCase

```typescript
@Injectable()
export class CreateAccountUseCase {
  constructor(
    private userRepository: IUserRepository,
    private supabaseAuthService: ISupabaseAuthService,
    private userFactoryRegistry: IUserFactoryRegistry,
  ) {}

  async execute(input: CreateAccountInput): Promise<CreateAccountOutput> {
    // 1. Criar em Supabase Auth
    let supabaseUser: { uid: string };
    try {
      supabaseUser = await this.supabaseAuthService.createUser(
        input.email,
        input.password,
      );
    } catch (error) {
      throw new Error(`Falha ao criar usuário no Supabase: ${error.message}`);
    }

    // 2. Factory para role padrão
    const factory = this.userFactoryRegistry.get(UserRole.COMMON_USER);

    // 3. Criar User entity
    const user = factory.create(supabaseUser.uid, input.email, input.nome);

    // 4. Persistir e rollback se falhar
    try {
      const savedUser = await this.userRepository.save(user);
      return UserMapper.toPersistence(savedUser);
    } catch (error) {
      try {
        await this.supabaseAuthService.deleteUser(supabaseUser.uid);
      } catch (rollbackError) {
        console.error(`Erro ao fazer rollback: ${rollbackError.message}`);
      }
      throw new Error(
        `Falha ao salvar usuário no banco de dados: ${error.message}`,
      );
    }
  }
}
```

---

## 8. Controller & HTTP Endpoint

```typescript
@Controller('accounts')
export class AccountController {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() input: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      return await this.createAccountUseCase.execute(input);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
```

### HTTP Contrato

**Request:**
```
POST /accounts/signup
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123!",
  "nome": "João Silva"
}
```

**Response 201 Created:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "nome": "João Silva",
  "role": "COMMON_USER",
  "createdAt": "2026-05-04T10:30:00Z",
  "updatedAt": "2026-05-04T10:30:00Z"
}
```

**Response 400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Falha ao criar usuário no Supabase: email já existe",
  "error": "Bad Request"
}
```

---

## 9. Dependency Injection (NestJS)

### UserFactoryProvider

```typescript
export const userFactoryProviders: Provider[] = [
  CommonUserFactory,
  {
    provide: IUserFactoryRegistry,
    useFactory: (commonUserFactory: CommonUserFactory) => {
      const registry = new UserFactoryRegistry();
      registry.register(UserRole.COMMON_USER, commonUserFactory);
      // Expandir quando implementar promoção:
      // registry.register(UserRole.ORGANIZER, organizerFactory);
      // registry.register(UserRole.ADMIN, adminFactory);
      return registry;
    },
    inject: [CommonUserFactory],
  },
];
```

### AccountsModule

```typescript
@Module({
  controllers: [AccountController],
  providers: [
    CreateAccountUseCase,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ISupabaseAuthService,
      useClass: SupabaseAuthService,
    },
    ...userFactoryProviders,
  ],
  exports: [IUserRepository, IUserFactoryRegistry],
})
export class AccountsModule {}
```

---

## 10. Tratamento de Erros

| Cenário | Causa | Status | Mensagem |
|---------|-------|--------|----------|
| Email já existe | Supabase | 400 | "Email já registrado" |
| Senha fraca | Supabase | 400 | "Senha deve conter..." |
| BD indisponível | PostgreSQL | 400 | "Falha ao salvar usuário" + rollback |
| Role desconhecida | Registry vazio | 500 | "Factory não registrada para role" |
| Validação DTO | Input inválido | 400 | Mensagem de validação |

---

## 11. Mapping entre Camadas

### UserMapper

```typescript
export class UserMapper {
  // Prisma raw → Domain entity
  static toDomain(raw: any): User {
    return new User(
      raw.id,
      raw.email,
      raw.nome,
      raw.role as UserRole,
      raw.fotoPerfil,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  // Domain entity → HTTP response DTO
  static toPersistence(user: User): CreateAccountOutput {
    return {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
```

---

## 12. Banco de Dados

### Schema Prisma

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  nome      String
  role      String    @default("COMMON_USER")
  fotoPerfil String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("users")
}
```

**Índices:**
- `id` (PK, Supabase UID)
- `email` (unique, para busca rápida)

---

## 13. Decisões de Design

| Decisão | Opções | Escolhida | Justificativa |
|---------|--------|-----------|---------------|
| Factory Pattern | Singular / Múltiplas / Factory Method | **Múltiplas** | Escalável, SRP, fácil expandir |
| Factory Resolver | Use Case / Registry / Controller | **Registry** | Desacoplado, Strategy pattern |
| Auth Flow | Supabase 1ª / DB 1ª / Separado | **Supabase 1ª** | Delega autenticação segura |
| Rollback | Automático / Manual / Nenhum | **Automático** | Garante consistência |
| Foto Perfil | No signup / Depois | **Depois** | Simplifica MVP, usuário completa depois |
| Role Inicial | Config / Sempre COMMON_USER | **Sempre COMMON_USER** | Regra de negócio clara |

---

## 14. Histórico de Versões

| Versão | Data | Descrição |
|--------|------|-----------|
| 1.0 | 2026-05-04 | Design inicial com Factory Pattern, apenas COMMON_USER |

---

## 15. Referências

- **Clean Architecture:** `./.claude/arch.md`
- **Code Style:** `./.claude/code-style.md`
- **DB Guidelines:** `./.claude/db-guidelines.md`
- **Use Cases:** `../docs/Modelagem/2.3.ModelagemOrganizacionalCasosDeUso.md` (RF01)
- **GoF Criacionais:** `../docs/PadroesDeProjeto/3.1.GoFsCriacionais.md`
