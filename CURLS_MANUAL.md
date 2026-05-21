# Curls — Teste Manual do Fluxo Completo

> Execute os passos **em ordem**. Após cada passo que retorna um `id` ou `access_token`, copie o valor e substitua nas variáveis dos passos seguintes.

---

## Variáveis que você vai preenchendo ao longo do teste

```
TOKEN_ORG    = <preenchido no passo 4>
TOKEN_PART   = <preenchido no passo 5>
TOKEN_ADMIN  = <preenchido no passo 5b>
TRILHA_ID    = <preenchido no passo 6>
INSCRICAO_ID = <preenchido no passo 13>
CODIGO_CHECKIN = <preenchido no passo 15>
PONTO_ID     = <preenchido no passo 22>
SESSION_ID   = <preenchido no passo 28>
```

---

## Accounts

### [1] Signup — Organizador

**Pattern:** Chain of Responsibility + Factory + Builder + Prototype

```bash
curl -X POST http://localhost:3000/accounts/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "org@teste.com",
    "password": "Senha@123",
    "nome": "Organizador",
    "role": "ORGANIZER",
    "aceitouTermos": true
  }'
```

---

### [2] Signup — Participante

**Pattern:** Chain of Responsibility + Factory + Builder + Prototype

```bash
curl -X POST http://localhost:3000/accounts/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "part@teste.com",
    "password": "Senha@123",
    "nome": "Participante",
    "role": "COMMON_USER",
    "aceitouTermos": true
  }'
```

---

### [3] Signup — Admin

**Pattern:** Chain of Responsibility + Factory + Builder + Prototype

```bash
curl -X POST http://localhost:3000/accounts/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@teste.com",
    "password": "Senha@123",
    "nome": "Admin",
    "role": "ADMIN",
    "aceitouTermos": true
  }'
```

---

### [4] Login — Organizador

**Pattern:** LoginUseCase (Supabase signIn → JWT HS256)

> Copie o `access_token` retornado → **TOKEN_ORG**

```bash
curl -X POST http://localhost:3000/accounts/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "org@teste.com",
    "password": "Senha@123"
  }'
```

---

### [5] Login — Participante

**Pattern:** LoginUseCase (Supabase signIn → JWT HS256)

> Copie o `access_token` retornado → **TOKEN_PART**

```bash
curl -X POST http://localhost:3000/accounts/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "part@teste.com",
    "password": "Senha@123"
  }'
```

---

### [5b] Login — Admin

**Pattern:** LoginUseCase (Supabase signIn → JWT HS256)

> Copie o `access_token` retornado → **TOKEN_ADMIN**

```bash
curl -X POST http://localhost:3000/accounts/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@teste.com",
    "password": "Senha@123"
  }'
```

---

## Trilhas

### [6] Criar Trilha

**Pattern:** Facade + JwtAuthGuard + RolesGuard (ORGANIZER ou ADMIN)

> Copie o `id` retornado → **TRILHA_ID**

```bash
curl -X POST http://localhost:3000/trilhas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ORG" \
  -d '{
    "titulo": "Chapada dos Veadeiros",
    "descricao": "Trilha pelo cerrado goiano",
    "pontoEncontro": "Portaria do Parque Nacional",
    "dataInicio": "2026-07-15T08:00:00Z",
    "vagasMaximas": 20
  }'
```

---

### [7] Listar Trilhas — paginado

**Pattern:** Facade + Iterator (paginado)

```bash
curl "http://localhost:3000/trilhas?page=1&limit=10"
```

---

### [8] Listar Trilhas — filtrado por status

**Pattern:** Facade + Iterator (filtrado)

```bash
curl "http://localhost:3000/trilhas?status=ATIVA&page=1&limit=5"
```

---

### [9] Contar Pontos por Região — Composite

**Pattern:** Composite (LocalizacaoComposita + LocalizacaoFolha)

```bash
curl -X POST http://localhost:3000/trilhas/localizacao/pontos \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "Goias",
    "cidades": [
      {
        "nome": "Alto Paraiso de Goias",
        "pontos": ["Vale da Lua", "Mirante do Parque", "Cachoeira Almecegas"]
      },
      {
        "nome": "Cavalcante",
        "pontos": ["Cachoeira Santa Barbara"]
      }
    ]
  }'
```

---

### [10] Gerar Código de Confirmação

**Pattern:** Singleton (ConfirmationCodeService)

> Copie o `codigo` retornado → **CODIGO_DEMO** (para teste)

```bash
curl -X POST http://localhost:3000/trilhas/codigos/gerar \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### [11] Validar Código de Confirmação

**Pattern:** Singleton (ConfirmationCodeService)

```bash
curl -X POST http://localhost:3000/trilhas/codigos/validar \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "CODIGO_DEMO"
  }'
```

---

### [12] Status do Singleton

**Pattern:** Singleton (codigosAtivos + observadoresAtivos)

```bash
curl http://localhost:3000/trilhas/status
```

---

## Inscrições

### [13] Solicitar Inscrição

**Pattern:** Facade (InscricaoFacade) + JwtAuthGuard

> Copie o `id` retornado → **INSCRICAO_ID**

```bash
curl -X POST http://localhost:3000/inscricoes/trilha/TRILHA_ID \
  -H "Authorization: Bearer TOKEN_PART"
```

---

### [14] Listar Inscrições da Trilha

**Pattern:** JwtAuthGuard

```bash
curl http://localhost:3000/trilhas/TRILHA_ID/inscricoes \
  -H "Authorization: Bearer TOKEN_ORG"
```

---

### [15] Aceitar Inscrição

**Pattern:** Facade (InscricaoFacade) + Singleton (gera código de confirmação)

> Copie o `codigoConfirmacao` retornado → **CODIGO_CHECKIN**

```bash
curl -X POST http://localhost:3000/inscricoes/INSCRICAO_ID/aceitar \
  -H "Authorization: Bearer TOKEN_ORG"
```

---

### [16] Fazer Check-in

**Pattern:** Facade (InscricaoFacade) + Singleton (valida e revoga código)

```bash
curl -X POST http://localhost:3000/inscricoes/INSCRICAO_ID/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ORG" \
  -d '{
    "codigo": "CODIGO_CHECKIN"
  }'
```

---

### [17] Editar Trilha

**Pattern:** Facade + Command (EditarTrilhaCommand) + Memento (salva estado antes) + Proxy (verifica organizadorId)

```bash
curl -X PATCH http://localhost:3000/trilhas/TRILHA_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ORG" \
  -d '{
    "titulo": "Chapada Editada",
    "vagasMaximas": 30
  }'
```

---

### [18] Restaurar Estado Anterior

**Pattern:** Facade + Memento (TrilhaCaretaker.restore)

```bash
curl -X POST http://localhost:3000/trilhas/TRILHA_ID/restaurar \
  -H "Authorization: Bearer TOKEN_ORG"
```

---

### [19] Finalizar Trilha

**Pattern:** Facade + Memento (salva estado) + Mediator (4 handlers) + Observer (badge + notificação)

```bash
curl -X POST http://localhost:3000/trilhas/TRILHA_ID/finalizar \
  -H "Authorization: Bearer TOKEN_ORG"
```

---

### [20] Ver Badges Recebidos

**Pattern:** Observer — BadgeDistribuicaoObserver distribuiu os badges ao finalizar

```bash
curl http://localhost:3000/trilhas/badges/minhas \
  -H "Authorization: Bearer TOKEN_PART"
```

---

### [21] Listar Minhas Inscrições

**Pattern:** Facade (InscricaoFacade)

```bash
curl http://localhost:3000/inscricoes/minhas \
  -H "Authorization: Bearer TOKEN_PART"
```

---

## Pontos Turísticos

### [22] Criar Ponto Turístico

**Pattern:** Proxy (PontosAuthProxy + PontosCacheProxy)

> Copie o `id` retornado → **PONTO_ID**

```bash
curl -X POST http://localhost:3000/pontos-turisticos \
  -H "Content-Type: application/json" \
  -H "x-user-email: org@teste.com" \
  -d '{
    "titulo": "Cachoeira dos Cristais",
    "descricao": "Aguas cristalinas no cerrado goiano"
  }'
```

---

### [23] Listar Pontos — Cache MISS

**Pattern:** Cache Proxy (primeira chamada — consulta o banco)

```bash
curl http://localhost:3000/pontos-turisticos
```

---

### [24] Listar Pontos — Cache HIT

**Pattern:** Cache Proxy (segunda chamada — serve do cache)

```bash
curl http://localhost:3000/pontos-turisticos
```

---

### [25] Busca com Filtro

**Pattern:** Cache Proxy

```bash
curl "http://localhost:3000/pontos-turisticos?titulo=Cachoeira%20dos%20Cristais"
```

---

### [26] Editar Ponto Turístico

**Pattern:** Protection Proxy (PontosAuthProxy verifica se é o criador)

```bash
curl -X PUT http://localhost:3000/pontos-turisticos/PONTO_ID \
  -H "Content-Type: application/json" \
  -H "x-user-email: org@teste.com" \
  -d '{
    "titulo": "Cachoeira dos Cristais - Trilha Longa",
    "descricao": "Percurso completo de 12 km"
  }'
```

---

## Chat / Object Pool

### [27] Status do Pool

**Pattern:** Object Pool

```bash
curl http://localhost:3000/chat/pool/status
```

---

### [28] Iniciar Sessão de Chat

**Pattern:** Object Pool (conexão adquirida do pool)

> Copie o `id` retornado → **SESSION_ID**

```bash
curl -X POST http://localhost:3000/chat/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userAId": "org@teste.com",
    "userBId": "part@teste.com"
  }'
```

---

### [29] Enviar Mensagem

**Pattern:** Object Pool (acquire conexão → usa → release de volta ao pool)

```bash
curl -X POST http://localhost:3000/chat/sessions/SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Confirmado presença na trilha?"
  }'
```

---

### [30] Encerrar Sessão de Chat

**Pattern:** Object Pool

```bash
curl -X DELETE http://localhost:3000/chat/sessions/SESSION_ID
```

---

## Adapters

### [31] Info dos Adapters

**Pattern:** Adapter (Structural GoF)

```bash
curl http://localhost:3000/adapters/info
```

---

### [32] Geocodificação

**Pattern:** Adapter — GoogleMapsAdapter implementa IMapAdapter

```bash
curl -X POST http://localhost:3000/adapters/geocode \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Chapada dos Veadeiros, Alto Paraiso de Goias, GO"
  }'
```

---

### [33] Rota entre dois pontos

**Pattern:** Adapter — GoogleMapsAdapter implementa IMapAdapter

```bash
curl -X POST http://localhost:3000/adapters/route \
  -H "Content-Type: application/json" \
  -d '{
    "from": { "lat": -14.13, "lng": -47.51 },
    "to":   { "lat": -13.99, "lng": -47.49 }
  }'
```

---

### [34] Enviar SMS

**Pattern:** Adapter — TwilioAdapter implementa INotificationAdapter

```bash
curl -X POST http://localhost:3000/adapters/notify/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5561999999999",
    "message": "Sua inscrição na trilha foi confirmada!"
  }'
```

---

### [35] Enviar WhatsApp

**Pattern:** Adapter — TwilioAdapter implementa INotificationAdapter

```bash
curl -X POST http://localhost:3000/adapters/notify/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5561999999999",
    "message": "Lembre-se: trilha começa às 08h na Portaria do Parque."
  }'
```

---

### [36] Validar Callback OAuth

**Pattern:** Adapter — GoogleAuthAdapter implementa IAuthAdapter

```bash
curl -X POST http://localhost:3000/adapters/auth/validate \
  -H "Content-Type: application/json" \
  -d '{
    "sub": "google-uid-organizador",
    "email": "org@teste.com"
  }'
```

---

## Mediator + Deleção

### [37] Finalizar Ponto via Mediator

**Pattern:** Mediator — TrailLifecycleMediatorService orquestra AttendanceHandler, BadgeHandler, HistoryNotificationHandler, TrailStateHandler

```bash
curl -X POST http://localhost:3000/pontos-turisticos/PONTO_ID/finalizar \
  -H "x-user-id: admin@teste.com"
```

---

### [38] Deletar Ponto Turístico

**Pattern:** Protection Proxy (verifica permissão antes de deletar)

```bash
curl -X DELETE http://localhost:3000/pontos-turisticos/PONTO_ID \
  -H "x-user-email: admin@teste.com"
```

---

### [39] Promover Usuário

**Pattern:** RolesGuard (somente ADMIN) + Prototype (user.clone com nova role)

```bash
curl -X POST http://localhost:3000/accounts/promote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -d '{
    "email": "part@teste.com",
    "newRole": "ORGANIZER"
  }'
```
