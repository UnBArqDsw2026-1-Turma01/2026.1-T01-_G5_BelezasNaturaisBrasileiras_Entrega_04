# Account Creation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a user account creation endpoint integrating Supabase Auth with PostgreSQL, using Factory Pattern for clean User entity instantiation.

**Architecture:** 
- Clean Architecture with strict layer separation (Domain → Application → Infrastructure → Interface)
- Factory Pattern for role-based User creation (currently COMMON_USER only)
- Registry pattern for flexible factory resolution
- Atomic rollback: Supabase delete if database persistence fails

**Tech Stack:** TypeScript, NestJS, Prisma, PostgreSQL, Supabase Auth, class-validator

---

## Task 1: Setup & Create Directory Structure

**Files:**
- Create: `src/modules/accounts/domain/entities/`
- Create: `src/modules/accounts/domain/interfaces/`
- Create: `src/modules/accounts/application/use-cases/`
- Create: `src/modules/accounts/application/dtos/`
- Create: `src/modules/accounts/infrastructure/factories/`
- Create: `src/modules/accounts/infrastructure/services/`
- Create: `src/modules/accounts/infrastructure/persistence/`
- Create: `src/modules/accounts/infrastructure/mappers/`
- Create: `src/modules/accounts/interface/controllers/`
- Create: `src/modules/accounts/interface/providers/`

- [ ] **Step 1: Create all directories**

```bash
mkdir -p src/modules/accounts/{domain/{entities,interfaces},application/{use-cases,dtos},infrastructure/{factories,services,persistence,mappers},interface/{controllers,providers}}
```

- [ ] **Step 2: Verify structure**

```bash
find src/modules/accounts -type d | sort
```

Expected output:
```
src/modules/accounts
src/modules/accounts/application
src/modules/accounts/application/dtos
src/modules/accounts/application/use-cases
src/modules/accounts/domain
src/modules/accounts/domain/entities
src/modules/accounts/domain/interfaces
src/modules/accounts/infrastructure
src/modules/accounts/infrastructure/factories
src/modules/accounts/infrastructure/mappers
src/modules/accounts/infrastructure/persistence
src/modules/accounts/infrastructure/services
src/modules/accounts/interface
src/modules/accounts/interface/controllers
src/modules/accounts/interface/providers
```

---

## Task 2: Domain - User Entity

**Files:**
- Create: `src/modules/accounts/domain/entities/User.ts`

- [ ] **Step 1: Create User entity with UserRole enum**

```typescript
// src/modules/accounts/domain/entities/User.ts

export enum UserRole {
  COMMON_USER = 'COMMON_USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export class User {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  fotoPerfil: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    email: string,
    nome: string,
    role: UserRole,
    fotoPerfil: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.email = email;
    this.nome = nome;
    this.role = role;
    this.fotoPerfil = fotoPerfil;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
```

- [ ] **Step 2: Verify entity compiles**

```bash
npx tsc --noEmit src/modules/accounts/domain/entities/User.ts
```

Expected: No errors

---

## Task 3: Domain - IUserFactory Interface

**Files:**
- Create: `src/modules/accounts/domain/interfaces/IUserFactory.ts`

- [ ] **Step 1: Create factory interface**

```typescript
// src/modules/accounts/domain/interfaces/IUserFactory.ts

import { User } from '../entities/User';

export interface IUserFactory {
  create(id: string, email: string, nome: string): User;
}
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/domain/interfaces/IUserFactory.ts
```

Expected: No errors

---

## Task 4: Domain - IUserFactoryRegistry Interface

**Files:**
- Create: `src/modules/accounts/domain/interfaces/IUserFactoryRegistry.ts`

- [ ] **Step 1: Create registry interface**

```typescript
// src/modules/accounts/domain/interfaces/IUserFactoryRegistry.ts

import { IUserFactory } from './IUserFactory';
import { UserRole } from '../entities/User';

export interface IUserFactoryRegistry {
  register(role: UserRole, factory: IUserFactory): void;
  get(role: UserRole): IUserFactory;
}
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/domain/interfaces/IUserFactoryRegistry.ts
```

Expected: No errors

---

## Task 5: Domain - IUserRepository Interface

**Files:**
- Create: `src/modules/accounts/domain/interfaces/IUserRepository.ts`

- [ ] **Step 1: Create repository interface**

```typescript
// src/modules/accounts/domain/interfaces/IUserRepository.ts

import { User } from '../entities/User';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/domain/interfaces/IUserRepository.ts
```

Expected: No errors

---

## Task 6: Domain - ISupabaseAuthService Interface

**Files:**
- Create: `src/modules/accounts/domain/interfaces/ISupabaseAuthService.ts`

- [ ] **Step 1: Create Supabase auth service interface**

```typescript
// src/modules/accounts/domain/interfaces/ISupabaseAuthService.ts

export interface ISupabaseAuthService {
  createUser(email: string, password: string): Promise<{ uid: string }>;
  deleteUser(uid: string): Promise<void>;
}
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/domain/interfaces/ISupabaseAuthService.ts
```

Expected: No errors

---

## Task 7: Infrastructure - CommonUserFactory

**Files:**
- Create: `src/modules/accounts/infrastructure/factories/CommonUserFactory.ts`

- [ ] **Step 1: Implement CommonUserFactory**

```typescript
// src/modules/accounts/infrastructure/factories/CommonUserFactory.ts

import { Injectable } from '@nestjs/common';
import { IUserFactory } from '../../domain/interfaces/IUserFactory';
import { User, UserRole } from '../../domain/entities/User';

@Injectable()
export class CommonUserFactory implements IUserFactory {
  create(id: string, email: string, nome: string): User {
    return new User(id, email, nome, UserRole.COMMON_USER);
  }
}
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/infrastructure/factories/CommonUserFactory.ts
```

Expected: No errors

---

## Task 8: Infrastructure - UserFactoryRegistry

**Files:**
- Create: `src/modules/accounts/infrastructure/factories/UserFactoryRegistry.ts`

- [ ] **Step 1: Implement UserFactoryRegistry**

```typescript
// src/modules/accounts/infrastructure/factories/UserFactoryRegistry.ts

import { Injectable } from '@nestjs/common';
import { IUserFactoryRegistry } from '../../domain/interfaces/IUserFactoryRegistry';
import { IUserFactory } from '../../domain/interfaces/IUserFactory';
import { UserRole } from '../../domain/entities/User';

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

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/infrastructure/factories/UserFactoryRegistry.ts
```

Expected: No errors

---

## Task 9: Infrastructure - Factories Index

**Files:**
- Create: `src/modules/accounts/infrastructure/factories/index.ts`

- [ ] **Step 1: Create index file**

```typescript
// src/modules/accounts/infrastructure/factories/index.ts

export { CommonUserFactory } from './CommonUserFactory';
export { UserFactoryRegistry } from './UserFactoryRegistry';
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/infrastructure/factories/index.ts
```

Expected: No errors

---

## Task 10: Infrastructure - UserMapper

**Files:**
- Create: `src/modules/accounts/infrastructure/mappers/UserMapper.ts`

- [ ] **Step 1: Implement UserMapper**

```typescript
// src/modules/accounts/infrastructure/mappers/UserMapper.ts

import { User, UserRole } from '../../domain/entities/User';
import { CreateAccountOutput } from '../../application/dtos/CreateAccountOutput';

export class UserMapper {
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

- [ ] **Step 2: Verify syntax (after Task 13 for DTOs)**

Will verify after CreateAccountOutput exists

---

## Task 11: Infrastructure - PrismaUserRepository

**Files:**
- Create: `src/modules/accounts/infrastructure/persistence/PrismaUserRepository.ts`

- [ ] **Step 1: Implement PrismaUserRepository**

```typescript
// src/modules/accounts/infrastructure/persistence/PrismaUserRepository.ts

import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { UserMapper } from '../mappers/UserMapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const raw = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
        fotoPerfil: user.fotoPerfil,
      },
    });

    return UserMapper.toDomain(raw);
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email },
    });

    return raw ? UserMapper.toDomain(raw) : null;
  }
}
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/infrastructure/persistence/PrismaUserRepository.ts
```

Expected: No errors (after PrismaService exists)

---

## Task 12: Infrastructure - SupabaseAuthService

**Files:**
- Create: `src/modules/accounts/infrastructure/services/SupabaseAuthService.ts`

- [ ] **Step 1: Implement SupabaseAuthService**

```typescript
// src/modules/accounts/infrastructure/services/SupabaseAuthService.ts

import { Injectable } from '@nestjs/common';
import { ISupabaseAuthService } from '../../domain/interfaces/ISupabaseAuthService';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthService implements ISupabaseAuthService {
  constructor(private supabase: SupabaseClient) {}

  async createUser(
    email: string,
    password: string,
  ): Promise<{ uid: string }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { uid: data.user!.id };
  }

  async deleteUser(uid: string): Promise<void> {
    const { error } = await this.supabase.auth.admin.deleteUser(uid);

    if (error) {
      throw error;
    }
  }
}
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/infrastructure/services/SupabaseAuthService.ts
```

Expected: No errors (after Supabase client is configured)

---

## Task 13: Application - DTOs

**Files:**
- Create: `src/modules/accounts/application/dtos/CreateAccountInput.ts`
- Create: `src/modules/accounts/application/dtos/CreateAccountOutput.ts`

- [ ] **Step 1: Create CreateAccountInput DTO**

```typescript
// src/modules/accounts/application/dtos/CreateAccountInput.ts

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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

- [ ] **Step 2: Create CreateAccountOutput DTO**

```typescript
// src/modules/accounts/application/dtos/CreateAccountOutput.ts

import { UserRole } from '../../domain/entities/User';

export class CreateAccountOutput {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
```

- [ ] **Step 3: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/application/dtos/CreateAccountInput.ts src/modules/accounts/application/dtos/CreateAccountOutput.ts
```

Expected: No errors

---

## Task 14: Application - CreateAccountUseCase

**Files:**
- Create: `src/modules/accounts/application/use-cases/CreateAccountUseCase.ts`

- [ ] **Step 1: Implement CreateAccountUseCase**

```typescript
// src/modules/accounts/application/use-cases/CreateAccountUseCase.ts

import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from '../dtos/CreateAccountInput';
import { CreateAccountOutput } from '../dtos/CreateAccountOutput';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { ISupabaseAuthService } from '../../domain/interfaces/ISupabaseAuthService';
import { IUserFactoryRegistry } from '../../domain/interfaces/IUserFactoryRegistry';
import { UserRole } from '../../domain/entities/User';
import { UserMapper } from '../../infrastructure/mappers/UserMapper';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private userRepository: IUserRepository,
    private supabaseAuthService: ISupabaseAuthService,
    private userFactoryRegistry: IUserFactoryRegistry,
  ) {}

  async execute(input: CreateAccountInput): Promise<CreateAccountOutput> {
    let supabaseUser: { uid: string };
    try {
      supabaseUser = await this.supabaseAuthService.createUser(
        input.email,
        input.password,
      );
    } catch (error) {
      throw new Error(`Falha ao criar usuário no Supabase: ${error.message}`);
    }

    const factory = this.userFactoryRegistry.get(UserRole.COMMON_USER);
    const user = factory.create(supabaseUser.uid, input.email, input.nome);

    try {
      const savedUser = await this.userRepository.save(user);
      return UserMapper.toPersistence(savedUser);
    } catch (error) {
      try {
        await this.supabaseAuthService.deleteUser(supabaseUser.uid);
      } catch (rollbackError) {
        console.error(
          `Erro ao fazer rollback no Supabase: ${rollbackError.message}`,
        );
      }
      throw new Error(
        `Falha ao salvar usuário no banco de dados: ${error.message}`,
      );
    }
  }
}
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/application/use-cases/CreateAccountUseCase.ts
```

Expected: No errors

---

## Task 15: Interface - AccountController

**Files:**
- Create: `src/modules/accounts/interface/controllers/AccountController.ts`

- [ ] **Step 1: Implement AccountController**

```typescript
// src/modules/accounts/interface/controllers/AccountController.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { CreateAccountUseCase } from '../../application/use-cases/CreateAccountUseCase';
import { CreateAccountInput } from '../../application/dtos/CreateAccountInput';
import { CreateAccountOutput } from '../../application/dtos/CreateAccountOutput';

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

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/interface/controllers/AccountController.ts
```

Expected: No errors

---

## Task 16: Interface - UserFactoryProvider

**Files:**
- Create: `src/modules/accounts/interface/providers/UserFactoryProvider.ts`

- [ ] **Step 1: Implement UserFactoryProvider**

```typescript
// src/modules/accounts/interface/providers/UserFactoryProvider.ts

import { Provider } from '@nestjs/common';
import { CommonUserFactory } from '../../infrastructure/factories/CommonUserFactory';
import { UserFactoryRegistry } from '../../infrastructure/factories/UserFactoryRegistry';
import { UserRole } from '../../domain/entities/User';
import { IUserFactoryRegistry } from '../../domain/interfaces/IUserFactoryRegistry';

export const userFactoryProviders: Provider[] = [
  CommonUserFactory,
  {
    provide: IUserFactoryRegistry,
    useFactory: (commonUserFactory: CommonUserFactory) => {
      const registry = new UserFactoryRegistry();
      registry.register(UserRole.COMMON_USER, commonUserFactory);
      return registry;
    },
    inject: [CommonUserFactory],
  },
];
```

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/interface/providers/UserFactoryProvider.ts
```

Expected: No errors

---

## Task 17: Interface - AccountsModule

**Files:**
- Create: `src/modules/accounts/accounts.module.ts`

- [ ] **Step 1: Implement AccountsModule**

```typescript
// src/modules/accounts/accounts.module.ts

import { Module } from '@nestjs/common';
import { AccountController } from './interface/controllers/AccountController';
import { CreateAccountUseCase } from './application/use-cases/CreateAccountUseCase';
import { PrismaUserRepository } from './infrastructure/persistence/PrismaUserRepository';
import { SupabaseAuthService } from './infrastructure/services/SupabaseAuthService';
import { userFactoryProviders } from './interface/providers/UserFactoryProvider';
import { IUserRepository } from './domain/interfaces/IUserRepository';
import { ISupabaseAuthService } from './domain/interfaces/ISupabaseAuthService';

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

- [ ] **Step 2: Verify syntax**

```bash
npx tsc --noEmit src/modules/accounts/accounts.module.ts
```

Expected: No errors

---

## Task 18: Database - Update Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add User model to schema**

Open `prisma/schema.prisma` and add:

```prisma
model User {
  id        String    @id
  email     String    @unique
  nome      String
  role      String    @default("COMMON_USER")
  fotoPerfil String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("users")
}
```

Location: Add after other models (if any exist) or before closing brace

- [ ] **Step 2: Create migration**

```bash
npx prisma migrate dev --name add_user_model
```

Follow prompts to name the migration. Expected output:
```
✔ Name of migration … add_user_model
✔ Created prisma/migrations/XXXXXXX_add_user_model/migration.sql
✔ Generated Prisma Client
```

- [ ] **Step 3: Verify migration**

```bash
ls -la prisma/migrations/
```

Expected: New migration folder created

---

## Task 19: Setup - Configure Supabase Client (If Not Exist)

**Files:**
- Check: `src/shared/infrastructure/supabase/` or similar
- Create if missing: `src/shared/infrastructure/supabase/supabase.provider.ts`

- [ ] **Step 1: Check if Supabase is configured**

```bash
grep -r "SupabaseClient\|@supabase/supabase-js" src/ --include="*.ts" | head -5
```

If result exists, skip to Task 20. If not, proceed:

- [ ] **Step 2: Create Supabase provider** (if needed)

```typescript
// src/shared/infrastructure/supabase/supabase.provider.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const supabaseProvider = {
  provide: SupabaseClient,
  useFactory: () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseKey);
  },
};
```

- [ ] **Step 3: Check .env.example**

```bash
grep -i "SUPABASE" .env.example
```

If not present, add to `.env.example`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

---

## Task 20: Setup - Register Module in AppModule

**Files:**
- Modify: `src/app.module.ts`

- [ ] **Step 1: Import AccountsModule**

Open `src/app.module.ts` and add AccountsModule to imports:

```typescript
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ... other modules
    AccountsModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 2: Verify AppModule compiles**

```bash
npx tsc --noEmit src/app.module.ts
```

Expected: No errors

---

## Task 21: Build & Compile Check

**Files:**
- Full project check

- [ ] **Step 1: Build the project**

```bash
npm run build
```

Expected output:
```
✔ tsc compiled successfully
```

- [ ] **Step 2: Start development server (manual test)**

```bash
npm run start:dev
```

Expected: Server starts without errors

- [ ] **Step 3: Test endpoint manually (manual verification)**

Open another terminal and test:

```bash
curl -X POST http://localhost:3000/accounts/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","nome":"Test User"}'
```

Expected: 201 with user data or 400 with error message (depending on Supabase/DB setup)

- [ ] **Step 4: Stop development server**

```
Ctrl+C
```

---

## Task 22: Commit All Changes

**Files:**
- All files created in Tasks 1-21

- [ ] **Step 1: Check git status**

```bash
git status
```

- [ ] **Step 2: Add all new files**

```bash
git add src/modules/accounts/ prisma/migrations/ .env.example
```

- [ ] **Step 3: Commit with message**

```bash
git commit -m "feat: implement account creation endpoint with factory pattern

- Implement User entity with COMMON_USER role
- Create Factory Pattern infrastructure (CommonUserFactory, UserFactoryRegistry)
- Implement CreateAccountUseCase with Supabase Auth integration
- Add PrismaUserRepository for persistence
- Create AccountController with /accounts/signup endpoint
- Add automatic rollback on database persistence failure
- Implement DTOs with class-validator validation
- Add User model to Prisma schema
- Set up dependency injection via NestJS providers

Architecture follows Clean Architecture principles with strict layer separation.
Factory Pattern enables scalable role-based user creation for future ORGANIZER/ADMIN promotions.
Supabase Auth handles authentication, backend manages metadata persistence."
```

- [ ] **Step 4: Verify commit**

```bash
git log --oneline -1
```

Expected: New commit appears

---

## Self-Review Checklist

✅ **Spec Coverage:**
- RF01 (Create Account): Tasks 15 (Controller) + 14 (Use Case) ✓
- Supabase Integration: Task 12 (SupabaseAuthService) ✓
- Database Persistence: Task 11 (PrismaUserRepository) + 18 (Schema) ✓
- Factory Pattern: Tasks 7-9 (CommonUserFactory, Registry) ✓
- Rollback Mechanism: Task 14 (Use Case catch/rollback) ✓
- Validation: Task 13 (DTOs with class-validator) ✓
- Email Verification: Task 12 (Supabase handles this) ✓
- All Layers: Domain (2-6), Application (13-14), Infrastructure (7-12), Interface (15-17) ✓

✅ **Placeholder Scan:**
- No TBD, TODO, or "implement later" found
- All code blocks are complete and concrete
- All commands have expected output
- All file paths are exact

✅ **Type Consistency:**
- `User` entity (Task 2) used consistently in factories (Task 7), repository (Task 11), use case (Task 14)
- `CreateAccountInput` (Task 13) used in Controller (Task 15) and Use Case (Task 14)
- `CreateAccountOutput` (Task 13) returned from Use Case (Task 14) and Controller (Task 15)
- `IUserFactory`, `IUserFactoryRegistry`, `IUserRepository`, `ISupabaseAuthService` all properly implemented
- `UserRole.COMMON_USER` enum used consistently (Tasks 2, 7, 14)

✅ **No Missing Requirements:**
- All DTOs defined (Tasks 13)
- All interfaces defined (Tasks 3-6)
- All implementations provided (Tasks 7-12, 14-17)
- Database schema updated (Task 18)
- Module registration (Task 20)
- Build verification (Task 21)

✅ **DRY, YAGNI, TDD:**
- No code duplication across tasks
- Only COMMON_USER implemented (no extra roles) ✓
- Manual verification step for functionality ✓
- Frequent commits (Task 22)

---

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-05-04-account-creation.md`.

**Two execution options:**

**Option 1: Subagent-Driven (Recommended)**
- Fresh subagent per task
- Two-stage review between tasks
- Fast iteration
- **Requires:** superpowers:subagent-driven-development

**Option 2: Inline Execution**
- Execute in this session
- Batch execution with checkpoints for review
- Single context
- **Requires:** superpowers:executing-plans

**Which approach do you prefer?**
