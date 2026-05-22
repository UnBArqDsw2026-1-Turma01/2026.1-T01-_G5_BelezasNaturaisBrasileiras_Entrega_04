# Frontend — Belezas Naturais Brasileiras

Interface web construída com **React 18 + Vite 5 + TypeScript + Tailwind CSS 3**.

## Pré-requisitos

- Node.js 20+
- npm 10+
- Backend rodando em `http://localhost:3000` (veja `../backend/README.md`)

---

## Passo a passo para rodar

### 1. Instale as dependências

```bash
npm install
```

### 2. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

> O Vite já está configurado com um proxy: todas as requisições para `/api` são redirecionadas automaticamente para `http://localhost:3000`. Certifique-se de que o backend está rodando antes de abrir o frontend.

---

## Outros comandos úteis

```bash
# Gerar build de produção
npm run build

# Pré-visualizar o build de produção localmente
npm run preview

# Checar tipos TypeScript
npx tsc --noEmit
```

---

## Estrutura de pastas

```
src/
├── api/          # Funções de chamada à API (axios)
├── contexts/     # AuthContext (JWT, login, logout)
├── pages/        # Páginas da aplicação
│   ├── Home.tsx           # Listagem de trilhas e pontos turísticos
│   ├── Login.tsx          # Login
│   ├── Cadastro.tsx       # Criar conta
│   ├── TrilhaDetail.tsx   # Detalhe da trilha + inscrição
│   ├── PainelOrganizador.tsx  # Painel do organizador
│   ├── PainelAdmin.tsx    # Painel do administrador
│   ├── Chat.tsx           # Chat entre participante e organizador
│   └── ...
├── components/   # Componentes reutilizáveis
└── App.tsx       # Rotas da aplicação
```

---

## Variáveis de ambiente

O frontend não exige variáveis de ambiente para rodar localmente — o proxy do Vite cuida do redirecionamento para o backend.

Se quiser apontar para um backend em outro endereço, edite o `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000', // altere aqui
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```
