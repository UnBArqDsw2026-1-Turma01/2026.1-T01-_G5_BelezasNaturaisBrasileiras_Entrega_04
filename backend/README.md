# Backend — Belezas Naturais Brasileiras

API REST construída com **NestJS 11 + TypeScript + Prisma 7 + PostgreSQL**.

## Pré-requisitos

- Node.js 20+
- npm 10+
- PostgreSQL rodando (local via Docker ou remoto)
- Conta no Supabase (para autenticação)

---

## Passo a passo para rodar

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto `backend/` com o conteúdo abaixo, preenchendo os valores conforme seu ambiente:

```env
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:5432/NOME_DO_BANCO"

# Supabase
SUPABASE_URL="https://SEU_PROJETO.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua_service_role_key"
SUPABASE_JWT_SECRET="sua_jwt_secret_do_supabase"

# JWT (HS256) — usado para assinar tokens de login
JWT_SECRET="uma_string_secreta_qualquer"

# Porta do servidor (opcional, padrão: 3000)
PORT=3000
```

> **Dica:** as chaves do Supabase estão em **Project Settings → API** no painel do Supabase.

### 3. Aplique as migrations do banco

```bash
npx prisma migrate deploy
```

Esse comando aplica todas as migrations existentes no banco configurado em `DATABASE_URL`.

### 4. Gere o cliente Prisma

```bash
npx prisma generate
```

### 5. Inicie o servidor em modo desenvolvimento

```bash
npm run start:dev
```

O servidor ficará disponível em `http://localhost:3000` com hot-reload ativo.

---

## Outros comandos úteis

```bash
# Rodar testes unitários
npm run test

# Rodar testes com cobertura
npm run test:cov

# Lint + formatação
npm run lint

# Build para produção
npm run build

# Iniciar em produção (após build)
npm run start:prod

# Abrir o Prisma Studio (UI visual do banco)
npx prisma studio

# Criar uma nova migration em desenvolvimento
npx prisma migrate dev --name nome_da_migration
```

---

## Subir o banco localmente com Docker

Se não tiver o PostgreSQL instalado, use o Docker Compose incluso:

```bash
docker-compose up -d
```

Isso sobe um PostgreSQL na porta `5432`. Use a `DATABASE_URL` correspondente no `.env`.

Para parar (sem apagar dados):

```bash
docker-compose down
```

Para parar e apagar os dados:

```bash
docker-compose down -v
```

---

## Endpoints principais

| Método | Rota                          | Descrição                      |
| ------ | ----------------------------- | ------------------------------ |
| POST   | `/accounts/signup`            | Criar conta                    |
| POST   | `/accounts/login`             | Login                          |
| POST   | `/accounts/promote`           | Promover usuário (ADMIN)       |
| GET    | `/trilhas`                    | Listar trilhas                 |
| POST   | `/trilhas`                    | Criar trilha (ORGANIZER/ADMIN) |
| PATCH  | `/trilhas/:id`                | Editar trilha                  |
| POST   | `/trilhas/:id/finalizar`      | Finalizar trilha               |
| POST   | `/trilhas/:id/restaurar`      | Restaurar trilha               |
| GET    | `/trilhas/badges/minhas`      | Badges do usuário              |
| POST   | `/inscricoes/trilha/:id`      | Solicitar inscrição            |
| GET    | `/inscricoes/minhas`          | Minhas inscrições              |
| POST   | `/inscricoes/:id/aceitar`     | Aceitar inscrição              |
| POST   | `/inscricoes/:id/checkin`     | Fazer check-in                 |
| GET    | `/pontos-turisticos`          | Listar pontos turísticos       |
| POST   | `/pontos-turisticos`          | Criar ponto turístico          |
| POST   | `/chat/sessions`              | Iniciar sessão de chat         |
| POST   | `/chat/sessions/:id/messages` | Enviar mensagem                |
| GET    | `/chat/sessions/:id/messages` | Buscar mensagens               |
