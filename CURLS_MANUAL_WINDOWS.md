# Curls Manual - Windows PowerShell

> Versao Windows do `CURLS_MANUAL.md`.
>
> Execute os passos em ordem no PowerShell. Esta versao usa `Invoke-RestMethod`
> e guarda automaticamente tokens e IDs em variaveis.

---

## Antes de comecar


Se o backend ainda nao estiver rodando, abra outro PowerShell e execute:

```powershell
cd backend
docker compose up -d
npm run prisma:generate
npm run prisma:migrate:deploy
npm run start:dev
```

No PowerShell onde voce vai rodar o manual:

```powershell
$baseUrl = "http://localhost:3000"

# Emails aleatorios evitam erro ao rodar o manual mais de uma vez.
$sufixo = Get-Random -Minimum 1000 -Maximum 9999
$emailOrg = "org.$sufixo@teste.com"
$emailPart = "part.$sufixo@teste.com"
$emailAdmin = "admin.$sufixo@teste.com"

Invoke-RestMethod -Uri "$baseUrl/trilhas/status" -Method GET
```

Variaveis preenchidas durante o fluxo:

```powershell
$TOKEN_ORG
$TOKEN_PART
$TOKEN_ADMIN
$TRILHA_ID
$INSCRICAO_ID
$CODIGO_DEMO
$CODIGO_CHECKIN
$PONTO_ID
$SESSION_ID
```

---

## Accounts

### [1] Signup - Organizador

**Pattern:** Chain of Responsibility + Factory + Builder + Prototype

```powershell
Invoke-RestMethod -Uri "$baseUrl/accounts/signup" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    email = $emailOrg
    password = "Senha@123"
    nome = "Organizador"
    role = "ORGANIZER"
    aceitouTermos = $true
  } | ConvertTo-Json)
```

---

### [2] Signup - Participante

**Pattern:** Chain of Responsibility + Factory + Builder + Prototype

```powershell
Invoke-RestMethod -Uri "$baseUrl/accounts/signup" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    email = $emailPart
    password = "Senha@123"
    nome = "Participante"
    role = "COMMON_USER"
    aceitouTermos = $true
  } | ConvertTo-Json)
```

---

### [3] Signup - Admin

**Pattern:** Chain of Responsibility + Factory + Builder + Prototype

```powershell
Invoke-RestMethod -Uri "$baseUrl/accounts/signup" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    email = $emailAdmin
    password = "Senha@123"
    nome = "Admin"
    role = "ADMIN"
    aceitouTermos = $true
  } | ConvertTo-Json)
```

---

### [4] Login - Organizador

**Pattern:** LoginUseCase (Supabase signIn -> JWT HS256)

```powershell
$loginOrg = Invoke-RestMethod -Uri "$baseUrl/accounts/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    email = $emailOrg
    password = "Senha@123"
  } | ConvertTo-Json)

$TOKEN_ORG = $loginOrg.access_token
$headersOrg = @{ Authorization = "Bearer $TOKEN_ORG" }
$TOKEN_ORG
```

---

### [5] Login - Participante

**Pattern:** LoginUseCase (Supabase signIn -> JWT HS256)

```powershell
$loginPart = Invoke-RestMethod -Uri "$baseUrl/accounts/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    email = $emailPart
    password = "Senha@123"
  } | ConvertTo-Json)

$TOKEN_PART = $loginPart.access_token
$headersPart = @{ Authorization = "Bearer $TOKEN_PART" }
$TOKEN_PART
```

---

### [5b] Login - Admin

**Pattern:** LoginUseCase (Supabase signIn -> JWT HS256)

```powershell
$loginAdmin = Invoke-RestMethod -Uri "$baseUrl/accounts/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    email = $emailAdmin
    password = "Senha@123"
  } | ConvertTo-Json)

$TOKEN_ADMIN = $loginAdmin.access_token
$headersAdmin = @{ Authorization = "Bearer $TOKEN_ADMIN" }
$TOKEN_ADMIN
```

---

## Trilhas

### [6] Criar Trilha

**Pattern:** Facade + JwtAuthGuard + RolesGuard (ORGANIZER ou ADMIN)

```powershell
$trilha = Invoke-RestMethod -Uri "$baseUrl/trilhas" `
  -Method POST `
  -Headers $headersOrg `
  -ContentType "application/json" `
  -Body (@{
    titulo = "Chapada dos Veadeiros"
    descricao = "Trilha pelo cerrado goiano"
    pontoEncontro = "Portaria do Parque Nacional"
    dataInicio = "2026-07-15T08:00:00Z"
    vagasMaximas = 20
  } | ConvertTo-Json)

$TRILHA_ID = $trilha.id
$TRILHA_ID
```

---

### [7] Listar Trilhas - paginado

**Pattern:** Facade + Iterator (paginado)

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas?page=1&limit=10" -Method GET
```

---

### [8] Listar Trilhas - filtrado por status

**Pattern:** Facade + Iterator (filtrado)

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas?status=ATIVA&page=1&limit=5" -Method GET
```

---

### [9] Contar Pontos por Regiao - Composite

**Pattern:** Composite (LocalizacaoComposita + LocalizacaoFolha)

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas/localizacao/pontos" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    estado = "Goias"
    cidades = @(
      @{
        nome = "Alto Paraiso de Goias"
        pontos = @("Vale da Lua", "Mirante do Parque", "Cachoeira Almecegas")
      },
      @{
        nome = "Cavalcante"
        pontos = @("Cachoeira Santa Barbara")
      }
    )
  } | ConvertTo-Json -Depth 10)
```

---

### [10] Gerar Codigo de Confirmacao

**Pattern:** Singleton (ConfirmationCodeService)

```powershell
$codigoDemoResponse = Invoke-RestMethod -Uri "$baseUrl/trilhas/codigos/gerar" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{}'

$CODIGO_DEMO = $codigoDemoResponse.codigo
$CODIGO_DEMO
```

---

### [11] Validar Codigo de Confirmacao

**Pattern:** Singleton (ConfirmationCodeService)

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas/codigos/validar" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    codigo = $CODIGO_DEMO
  } | ConvertTo-Json)
```

---

### [12] Status do Singleton

**Pattern:** Singleton (codigosAtivos + observadoresAtivos)

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas/status" -Method GET
```

---

## Inscricoes

### [13] Solicitar Inscricao

**Pattern:** Facade (InscricaoFacade) + JwtAuthGuard

```powershell
$inscricao = Invoke-RestMethod -Uri "$baseUrl/inscricoes/trilha/$TRILHA_ID" `
  -Method POST `
  -Headers $headersPart

$INSCRICAO_ID = $inscricao.id
$INSCRICAO_ID
```

---

### [14] Listar Inscricoes da Trilha

**Pattern:** JwtAuthGuard

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas/$TRILHA_ID/inscricoes" `
  -Method GET `
  -Headers $headersOrg
```

---

### [15] Aceitar Inscricao

**Pattern:** Facade (InscricaoFacade) + Singleton (gera codigo de confirmacao)

```powershell
$aceite = Invoke-RestMethod -Uri "$baseUrl/inscricoes/$INSCRICAO_ID/aceitar" `
  -Method POST `
  -Headers $headersOrg

$CODIGO_CHECKIN = $aceite.codigoConfirmacao
$CODIGO_CHECKIN
```

---

### [16] Fazer Check-in

**Pattern:** Facade (InscricaoFacade) + Singleton (valida e revoga codigo)

```powershell
Invoke-RestMethod -Uri "$baseUrl/inscricoes/$INSCRICAO_ID/checkin" `
  -Method POST `
  -Headers $headersOrg `
  -ContentType "application/json" `
  -Body (@{
    codigo = $CODIGO_CHECKIN
  } | ConvertTo-Json)
```

---

### [17] Editar Trilha

**Pattern:** Facade + Command (EditarTrilhaCommand) + Memento (salva estado antes) + Proxy (verifica organizadorId)

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas/$TRILHA_ID" `
  -Method PATCH `
  -Headers $headersOrg `
  -ContentType "application/json" `
  -Body (@{
    titulo = "Chapada Editada"
    vagasMaximas = 30
  } | ConvertTo-Json)
```

---

### [18] Restaurar Estado Anterior

**Pattern:** Facade + Memento (TrilhaCaretaker.restore)

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas/$TRILHA_ID/restaurar" `
  -Method POST `
  -Headers $headersOrg
```

---

### [19] Finalizar Trilha

**Pattern:** Facade + Memento (salva estado) + Mediator (4 handlers) + Observer (badge + notificacao)

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas/$TRILHA_ID/finalizar" `
  -Method POST `
  -Headers $headersOrg
```

---

### [20] Ver Badges Recebidos

**Pattern:** Observer - BadgeDistribuicaoObserver distribuiu os badges ao finalizar

```powershell
Invoke-RestMethod -Uri "$baseUrl/trilhas/badges/minhas" `
  -Method GET `
  -Headers $headersPart
```

---

### [21] Listar Minhas Inscricoes

**Pattern:** Facade (InscricaoFacade)

```powershell
Invoke-RestMethod -Uri "$baseUrl/inscricoes/minhas" `
  -Method GET `
  -Headers $headersPart
```

---

## Pontos Turisticos

### [22] Criar Ponto Turistico

**Pattern:** Proxy (PontosAuthProxy + PontosCacheProxy)

```powershell
$ponto = Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos" `
  -Method POST `
  -Headers @{ "x-user-email" = $emailOrg } `
  -ContentType "application/json" `
  -Body (@{
    titulo = "Cachoeira dos Cristais"
    descricao = "Aguas cristalinas no cerrado goiano"
  } | ConvertTo-Json)

$PONTO_ID = $ponto.id
$PONTO_ID
```

---

### [23] Listar Pontos - Cache MISS

**Pattern:** Cache Proxy (primeira chamada - consulta o banco)

```powershell
Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos" -Method GET
```

---

### [24] Listar Pontos - Cache HIT

**Pattern:** Cache Proxy (segunda chamada - serve do cache)

```powershell
Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos" -Method GET
```

---

### [25] Busca com Filtro

**Pattern:** Cache Proxy

```powershell
Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos?titulo=Cachoeira%20dos%20Cristais" `
  -Method GET
```

---

### [26] Editar Ponto Turistico

**Pattern:** Protection Proxy (PontosAuthProxy verifica se e o criador)

```powershell
Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos/$PONTO_ID" `
  -Method PUT `
  -Headers @{ "x-user-email" = $emailOrg } `
  -ContentType "application/json" `
  -Body (@{
    titulo = "Cachoeira dos Cristais - Trilha Longa"
    descricao = "Percurso completo de 12 km"
  } | ConvertTo-Json)
```

---

## Chat / Object Pool

### [27] Status do Pool

**Pattern:** Object Pool

```powershell
Invoke-RestMethod -Uri "$baseUrl/chat/pool/status" -Method GET
```

---

### [28] Iniciar Sessao de Chat

**Pattern:** Object Pool (conexao adquirida do pool)

```powershell
$session = Invoke-RestMethod -Uri "$baseUrl/chat/sessions" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    userAId = $emailOrg
    userBId = $emailPart
  } | ConvertTo-Json)

$SESSION_ID = $session.id
$SESSION_ID
```

---

### [29] Enviar Mensagem

**Pattern:** Object Pool (acquire conexao -> usa -> release de volta ao pool)

```powershell
Invoke-RestMethod -Uri "$baseUrl/chat/sessions/$SESSION_ID/messages" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    message = "Confirmado presenca na trilha?"
  } | ConvertTo-Json)
```

---

### [30] Encerrar Sessao de Chat

**Pattern:** Object Pool

```powershell
Invoke-RestMethod -Uri "$baseUrl/chat/sessions/$SESSION_ID" `
  -Method DELETE
```

---

## Adapters

### [31] Info dos Adapters

**Pattern:** Adapter (Structural GoF)

```powershell
Invoke-RestMethod -Uri "$baseUrl/adapters/info" -Method GET
```

---

### [32] Geocodificacao

**Pattern:** Adapter - GoogleMapsAdapter implementa IMapAdapter

```powershell
Invoke-RestMethod -Uri "$baseUrl/adapters/geocode" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    address = "Chapada dos Veadeiros, Alto Paraiso de Goias, GO"
  } | ConvertTo-Json)
```

---

### [33] Rota entre dois pontos

**Pattern:** Adapter - GoogleMapsAdapter implementa IMapAdapter

```powershell
Invoke-RestMethod -Uri "$baseUrl/adapters/route" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    from = @{
      lat = -14.13
      lng = -47.51
    }
    to = @{
      lat = -13.99
      lng = -47.49
    }
  } | ConvertTo-Json -Depth 10)
```

---

### [34] Enviar SMS

**Pattern:** Adapter - TwilioAdapter implementa INotificationAdapter

```powershell
Invoke-RestMethod -Uri "$baseUrl/adapters/notify/sms" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    to = "+5561999999999"
    message = "Sua inscricao na trilha foi confirmada!"
  } | ConvertTo-Json)
```

---

### [35] Enviar WhatsApp

**Pattern:** Adapter - TwilioAdapter implementa INotificationAdapter

```powershell
Invoke-RestMethod -Uri "$baseUrl/adapters/notify/whatsapp" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    to = "+5561999999999"
    message = "Lembre-se: trilha comeca as 08h na Portaria do Parque."
  } | ConvertTo-Json)
```

---

### [36] Validar Callback OAuth

**Pattern:** Adapter - GoogleAuthAdapter implementa IAuthAdapter

```powershell
Invoke-RestMethod -Uri "$baseUrl/adapters/auth/validate" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    sub = "google-uid-organizador"
    email = $emailOrg
  } | ConvertTo-Json)
```

---

## Mediator + Delecao

### [37] Finalizar Ponto via Mediator

**Pattern:** Mediator - TrailLifecycleMediatorService orquestra AttendanceHandler, BadgeHandler, HistoryNotificationHandler, TrailStateHandler

```powershell
Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos/$PONTO_ID/finalizar" `
  -Method POST `
  -Headers @{ "x-user-id" = $emailAdmin }
```

---

### [38] Deletar Ponto Turistico

**Pattern:** Protection Proxy (verifica permissao antes de deletar)

```powershell
Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos/$PONTO_ID" `
  -Method DELETE `
  -Headers @{ "x-user-email" = $emailAdmin }
```

---

### [39] Promover Usuario

**Pattern:** RolesGuard (somente ADMIN) + Prototype (user.clone com nova role)

```powershell
Invoke-RestMethod -Uri "$baseUrl/accounts/promote" `
  -Method POST `
  -Headers $headersAdmin `
  -ContentType "application/json" `
  -Body (@{
    email = $emailPart
    newRole = "ORGANIZER"
  } | ConvertTo-Json)
```
