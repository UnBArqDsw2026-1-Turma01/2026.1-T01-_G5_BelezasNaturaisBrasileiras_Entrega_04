# Roteiro de Gravação — Comprobatório de Execução (Entrega 4)

Vídeo curto, sem frufru: a ideia é só **mostrar o código rodando**. Duas partes:

1. **DAS** → backend rodando + padrões GoF evidenciados (automatizado por script).
2. **Reutilização de Software** → frontend React reusando o componente `<ProtectedRoute />`.

> Tempo total sugerido: **5 a 8 min**. Grave a tela inteira e narre por cima.

---

## Parte 0 — Preparação (antes de começar a gravar)

Deixe tudo pronto para não gastar tempo de vídeo com `npm install`/migrations.

```powershell
# Terminal A — Backend
cd backend
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run start:dev      # deixe rodando e VISÍVEL durante a gravação (mostra os logs)
```

```powershell
# Terminal B — Frontend (para a Parte 2)
cd frontend
npm install
npm run dev            # sobe em http://localhost:5173
```

Confirme que `http://localhost:3000/trilhas/status` responde e que o front abre.

---

## Parte 1 — DAS (Backend + Padrões GoF) — ~3 min

**Layout da tela:** terminal do `start:dev` à esquerda (mostrando logs) + terminal onde você roda o script à direita.

### Fala de abertura (15s)

> "Esta é a demonstração do DAS do projeto Belezas Naturais Brasileiras. O backend é um monólito modular em NestJS com arquitetura em camadas (DDD). Vou rodar um script que exercita a API de ponta a ponta, evidenciando os padrões GoF documentados no DAS."

### Ação automatizada

Na raiz do projeto, rode:

```powershell
powershell -ExecutionPolicy Bypass -File docs/ArquiteturaReutilizacao/demo-das.ps1
```

O script imprime cada etapa com o **padrão correspondente** no cabeçalho. Conforme ele roda, aponte na tela:

| Etapa no script                          | O que narrar / apontar                                                                                                   |
| :--------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| Signup + senha fraca rejeitada           | **Chain of Responsibility** validando o cadastro; senha curta é bloqueada pela cadeia.                                   |
| Login                                    | **Factory** por role + emissão de **JWT**.                                                                               |
| Participante tentando criar trilha → 403 | **RolesGuard (RBAC)** bloqueando.                                                                                        |
| Criar/Listar trilha                      | **Facade** + **Iterator** (paginação).                                                                                   |
| Contar pontos por região                 | **Composite** (estado → cidades → pontos).                                                                               |
| Inscrição → aceitar → check-in           | **Facade** + **Singleton** (gera/valida código).                                                                         |
| Editar → restaurar                       | **Command** + **Memento** (rollback de estado).                                                                          |
| Finalizar trilha + badges                | **Mediator** (handlers) + **Observer** (distribui badges).                                                               |
| Listar pontos 1x e 2x                    | **Cache Proxy**: 1ª chamada = MISS (SQL no log), 2ª = HIT (mais rápida, sem SQL). **Aponte o terminal do backend** aqui. |
| Chat status/sessão                       | **Object Pool** (acquire/release de conexões).                                                                           |
| Adapters info/geocode                    | **Adapter** (Google Maps / Twilio / Google Auth).                                                                        |
| Promote                                  | **Prototype** (`user.clone`) + RBAC só Admin.                                                                            |

### Fala de fechamento da Parte 1 (10s)

> "Em uma única execução cobrimos os padrões criacionais, estruturais e comportamentais descritos no DAS, com o RBAC e a cadeia de proxies funcionando em tempo real."

> 💡 Se quiser, o `CURLS_MANUAL_WINDOWS.md` na raiz tem cada requisição isolada, caso prefira rodar manualmente em vez do script.

---

## Parte 2 — Reutilização de Software (Componente React) — ~2 min

Caso de reutilização exigido pela entrega: o componente **`<ProtectedRoute />`** (`frontend/src/components/ProtectedRoute.tsx`), reaproveitado em várias rotas no `App.tsx` para centralizar autenticação e autorização por papel (RBAC).

### Fala de abertura (15s)

> "Para a Reutilização de Software, o caso é a componentização no React. O componente `ProtectedRoute` é escrito uma vez e reutilizado em múltiplas rotas, em três níveis: só logado, papéis específicos, e exclusivo de Admin."

### Mostre o código (30s)

1. Abra `frontend/src/components/ProtectedRoute.tsx` — mostre as duas regras (não autenticado → `/login`; sem papel → `/`).
2. Abra `frontend/src/App.tsx` — mostre o **mesmo** componente reusado:
   - `/perfil` e `/chat` → `<ProtectedRoute>` (só logado)
   - `/trilhas/criar` → `<ProtectedRoute roles={['ORGANIZER','ADMIN']}>`
   - `/admin` → `<ProtectedRoute roles={['ADMIN']}>`

### Mostre a execução no navegador (`http://localhost:5173`)

Faça os cenários abaixo na ordem — cada um comprova o reuso da mesma regra:

| Cenário                  | Estado                                   | URL digitada     | Resultado esperado                    |
| :----------------------- | :--------------------------------------- | :--------------- | :------------------------------------ |
| Não autenticado          | Deslogado                                | `/chat`          | Redireciona para `/login`.            |
| Sem autorização (RBAC)   | Logado como Participante (`COMMON_USER`) | `/trilhas/criar` | Redireciona para a Home `/`.          |
| Autorizado (Organizador) | Logado como `ORGANIZER`                  | `/trilhas/criar` | Página de criar trilha **renderiza**. |
| Autorizado (Admin)       | Logado como `ADMIN`                      | `/admin`         | Painel admin **renderiza**.           |

> Use os usuários criados pelo script da Parte 1 (org / participante / admin, senha `Senha@123`), ou cadastre na tela `/cadastro`.

### Fala de fechamento (10s)

> "O mesmo componente, sem duplicação de código, protege rotas com regras diferentes. É reutilização de caixa-branca via composição de componentes React."

---

## Checklist final antes de subir o vídeo

- [ ] Backend e frontend visíveis e respondendo.
- [ ] Script `demo-das.ps1` rodou do início ao fim sem erro.
- [ ] Cache MISS vs HIT mostrado nos logs do backend.
- [ ] Os 4 cenários do `ProtectedRoute` demonstrados no navegador.
- [ ] Áudio/narração audível (opcional, mas ajuda).
