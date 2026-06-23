# =============================================================================
#  demo-das.ps1 - Demonstracao automatizada do BACKEND (DAS - Entrega 4)
# -----------------------------------------------------------------------------
#  Executa o fluxo completo da API evidenciando os padroes GoF descritos no DAS.
#  Pre-requisito: backend rodando em http://localhost:3000
#    cd backend
#    docker compose up -d
#    npm run prisma:generate
#    npm run prisma:migrate:deploy
#    npm run start:dev
#
#  Uso (na raiz do projeto):
#    powershell -ExecutionPolicy Bypass -File docs/ArquiteturaReutilizacao/demo-das.ps1
#
#  Dica para gravacao: deixe a janela do "npm run start:dev" visivel ao lado
#  para mostrar os logs (SQL do Prisma, cache HIT/MISS, observers etc.).
# =============================================================================

$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:3000"

# Pausa entre etapas (segundos). Ajuste se quiser narrar com mais calma.
$pausa = 1.5

function Secao($titulo, $padrao) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host " $titulo" -ForegroundColor Cyan
    Write-Host " Padrao: $padrao" -ForegroundColor DarkGray
    Write-Host "============================================================" -ForegroundColor Cyan
    Start-Sleep -Seconds $pausa
}

function Mostrar($obj) {
    $obj | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
    Start-Sleep -Seconds $pausa
}

# Emails aleatorios evitam erro ao rodar o script mais de uma vez.
$sufixo     = Get-Random -Minimum 1000 -Maximum 9999
$emailOrg   = "org.$sufixo@teste.com"
$emailPart  = "part.$sufixo@teste.com"
$emailAdmin = "admin.$sufixo@teste.com"

Write-Host ""
Write-Host "### DEMONSTRACAO DAS - Belezas Naturais Brasileiras ###" -ForegroundColor Yellow
Write-Host "Backend: $baseUrl" -ForegroundColor Yellow

# --- Sanity check ------------------------------------------------------------
Secao "0. Verificando se o backend esta no ar" "GET /trilhas/status"
try {
    Mostrar (Invoke-RestMethod -Uri "$baseUrl/trilhas/status" -Method GET)
} catch {
    Write-Host "ERRO: backend nao respondeu. Suba o servidor antes de gravar." -ForegroundColor Red
    exit 1
}

# --- Accounts ----------------------------------------------------------------
Secao "1. Signup (Organizador / Participante / Admin)" "Chain of Responsibility + Factory + Builder + Prototype"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/accounts/signup" -Method POST -ContentType "application/json" -Body (@{ email=$emailOrg;   password="Senha@123"; nome="Organizador";  role="ORGANIZER";   aceitouTermos=$true } | ConvertTo-Json))
Mostrar (Invoke-RestMethod -Uri "$baseUrl/accounts/signup" -Method POST -ContentType "application/json" -Body (@{ email=$emailPart;  password="Senha@123"; nome="Participante"; role="COMMON_USER"; aceitouTermos=$true } | ConvertTo-Json))
Mostrar (Invoke-RestMethod -Uri "$baseUrl/accounts/signup" -Method POST -ContentType "application/json" -Body (@{ email=$emailAdmin; password="Senha@123"; nome="Admin";        role="ADMIN";       aceitouTermos=$true } | ConvertTo-Json))

Secao "1b. Validacao encadeada rejeita senha fraca" "Chain of Responsibility (PasswordStrengthHandler)"
try {
    Invoke-RestMethod -Uri "$baseUrl/accounts/signup" -Method POST -ContentType "application/json" -Body (@{ email="fraca.$sufixo@teste.com"; password="123"; nome="Fraca"; role="COMMON_USER"; aceitouTermos=$true } | ConvertTo-Json) | Out-Null
    Write-Host "(esperava rejeicao)" -ForegroundColor Red
} catch {
    Write-Host "Bloqueado corretamente pela cadeia de validacao:" -ForegroundColor Green
    Write-Host $_.ErrorDetails.Message -ForegroundColor Green
}
Start-Sleep -Seconds $pausa

Secao "2. Login (gera JWT por usuario)" "LoginUseCase (Supabase signIn -> JWT HS256)"
$loginOrg   = Invoke-RestMethod -Uri "$baseUrl/accounts/login" -Method POST -ContentType "application/json" -Body (@{ email=$emailOrg;   password="Senha@123" } | ConvertTo-Json)
$loginPart  = Invoke-RestMethod -Uri "$baseUrl/accounts/login" -Method POST -ContentType "application/json" -Body (@{ email=$emailPart;  password="Senha@123" } | ConvertTo-Json)
$loginAdmin = Invoke-RestMethod -Uri "$baseUrl/accounts/login" -Method POST -ContentType "application/json" -Body (@{ email=$emailAdmin; password="Senha@123" } | ConvertTo-Json)
$headersOrg   = @{ Authorization = "Bearer $($loginOrg.access_token)" }
$headersPart  = @{ Authorization = "Bearer $($loginPart.access_token)" }
$headersAdmin = @{ Authorization = "Bearer $($loginAdmin.access_token)" }
Write-Host "Tokens emitidos para org / part / admin." -ForegroundColor Green
Start-Sleep -Seconds $pausa

# --- RBAC --------------------------------------------------------------------
Secao "3. RBAC: Participante NAO pode criar trilha" "JwtAuthGuard + RolesGuard (bloqueio)"
try {
    Invoke-RestMethod -Uri "$baseUrl/trilhas" -Method POST -Headers $headersPart -ContentType "application/json" -Body (@{ titulo="Tentativa"; descricao="x"; pontoEncontro="x"; dataInicio="2026-07-15T08:00:00Z"; vagasMaximas=10 } | ConvertTo-Json) | Out-Null
    Write-Host "(esperava 403)" -ForegroundColor Red
} catch {
    Write-Host "Bloqueado pelo RolesGuard (403 Forbidden) como esperado." -ForegroundColor Green
}
Start-Sleep -Seconds $pausa

Secao "4. Criar Trilha (Organizador)" "Facade + JwtAuthGuard + RolesGuard"
$trilha = Invoke-RestMethod -Uri "$baseUrl/trilhas" -Method POST -Headers $headersOrg -ContentType "application/json" -Body (@{ titulo="Chapada dos Veadeiros"; descricao="Trilha pelo cerrado goiano"; pontoEncontro="Portaria do Parque Nacional"; dataInicio="2026-07-15T08:00:00Z"; vagasMaximas=20 } | ConvertTo-Json)
$TRILHA_ID = $trilha.id
Mostrar $trilha

Secao "5. Listar Trilhas (paginado)" "Facade + Iterator"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/trilhas?page=1&limit=10" -Method GET)

Secao "6. Contar pontos por regiao" "Composite (LocalizacaoComposita + LocalizacaoFolha)"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/trilhas/localizacao/pontos" -Method POST -ContentType "application/json" -Body (@{ estado="Goias"; cidades=@( @{ nome="Alto Paraiso de Goias"; pontos=@("Vale da Lua","Mirante do Parque","Cachoeira Almecegas") }, @{ nome="Cavalcante"; pontos=@("Cachoeira Santa Barbara") } ) } | ConvertTo-Json -Depth 10))

# --- Inscricao / Check-in ----------------------------------------------------
Secao "7. Solicitar inscricao (Participante)" "Facade (InscricaoFacade) + JwtAuthGuard"
$inscricao = Invoke-RestMethod -Uri "$baseUrl/inscricoes/trilha/$TRILHA_ID" -Method POST -Headers $headersPart
$INSCRICAO_ID = $inscricao.id
Mostrar $inscricao

Secao "8. Aceitar inscricao (gera codigo)" "Facade + Singleton (ConfirmationCodeService)"
$aceite = Invoke-RestMethod -Uri "$baseUrl/inscricoes/$INSCRICAO_ID/aceitar" -Method POST -Headers $headersOrg
$CODIGO_CHECKIN = $aceite.codigoConfirmacao
Mostrar $aceite

Secao "9. Check-in (valida e revoga codigo)" "Facade + Singleton"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/inscricoes/$INSCRICAO_ID/checkin" -Method POST -Headers $headersOrg -ContentType "application/json" -Body (@{ codigo=$CODIGO_CHECKIN } | ConvertTo-Json))

# --- Memento / Command -------------------------------------------------------
Secao "10. Editar trilha" "Facade + Command + Memento (salva estado) + Proxy"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/trilhas/$TRILHA_ID" -Method PATCH -Headers $headersOrg -ContentType "application/json" -Body (@{ titulo="Chapada Editada"; vagasMaximas=30 } | ConvertTo-Json))

Secao "11. Restaurar estado anterior" "Memento (TrilhaCaretaker.restore)"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/trilhas/$TRILHA_ID/restaurar" -Method POST -Headers $headersOrg)

# --- Mediator / Observer -----------------------------------------------------
Secao "12. Finalizar trilha" "Memento + Mediator (4 handlers) + Observer (badge + notificacao)"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/trilhas/$TRILHA_ID/finalizar" -Method POST -Headers $headersOrg)

Secao "13. Badges recebidos pelo participante" "Observer (BadgeDistribuicaoObserver)"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/trilhas/badges/minhas" -Method GET -Headers $headersPart)

# --- Proxy: Cache HIT/MISS ---------------------------------------------------
Secao "14. Criar ponto turistico" "Protection Proxy (PontosAuthProxy)"
$ponto = Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos" -Method POST -Headers @{ "x-user-email"=$emailOrg } -ContentType "application/json" -Body (@{ titulo="Cachoeira dos Cristais"; descricao="Aguas cristalinas no cerrado goiano" } | ConvertTo-Json)
$PONTO_ID = $ponto.id
Mostrar $ponto

Secao "15. Listar pontos - 1a chamada (CACHE MISS)" "Cache Proxy (consulta o banco - veja o SQL no log)"
$t1 = Measure-Command { $null = Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos" -Method GET }
Write-Host ("Tempo 1a chamada: {0} ms" -f [int]$t1.TotalMilliseconds) -ForegroundColor Green
Start-Sleep -Seconds $pausa

Secao "16. Listar pontos - 2a chamada (CACHE HIT)" "Cache Proxy (serve do cache - mais rapido, sem SQL)"
$t2 = Measure-Command { $null = Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos" -Method GET }
Write-Host ("Tempo 2a chamada: {0} ms (deve ser menor / sem log de SQL)" -f [int]$t2.TotalMilliseconds) -ForegroundColor Green
Start-Sleep -Seconds $pausa

# --- Object Pool -------------------------------------------------------------
Secao "17. Status do Object Pool de chat" "Object Pool"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/chat/pool/status" -Method GET)

Secao "18. Sessao de chat (acquire -> usa -> release)" "Object Pool"
$session = Invoke-RestMethod -Uri "$baseUrl/chat/sessions" -Method POST -ContentType "application/json" -Body (@{ userAId=$emailOrg; userBId=$emailPart } | ConvertTo-Json)
$SESSION_ID = $session.id
Mostrar (Invoke-RestMethod -Uri "$baseUrl/chat/sessions/$SESSION_ID/messages" -Method POST -ContentType "application/json" -Body (@{ message="Confirmado presenca na trilha?" } | ConvertTo-Json))
$null = Invoke-RestMethod -Uri "$baseUrl/chat/sessions/$SESSION_ID" -Method DELETE
Mostrar (Invoke-RestMethod -Uri "$baseUrl/chat/pool/status" -Method GET)

# --- Adapter -----------------------------------------------------------------
Secao "19. Adapters de servicos externos" "Adapter (GoogleMaps / Twilio / GoogleAuth)"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/adapters/info" -Method GET)
Mostrar (Invoke-RestMethod -Uri "$baseUrl/adapters/geocode" -Method POST -ContentType "application/json" -Body (@{ address="Chapada dos Veadeiros, Alto Paraiso de Goias, GO" } | ConvertTo-Json))

# --- Prototype + RBAC --------------------------------------------------------
Secao "20. Promover usuario (somente Admin)" "RolesGuard (ADMIN) + Prototype (user.clone)"
Mostrar (Invoke-RestMethod -Uri "$baseUrl/accounts/promote" -Method POST -Headers $headersAdmin -ContentType "application/json" -Body (@{ email=$emailPart; newRole="ORGANIZER" } | ConvertTo-Json))

Write-Host ""
Write-Host "### FIM DA DEMONSTRACAO DAS ###" -ForegroundColor Yellow
Write-Host "Padroes evidenciados: Chain of Responsibility, Factory, Builder, Prototype," -ForegroundColor Yellow
Write-Host "Facade, Iterator, Composite, Singleton, Command, Memento, Mediator, Observer," -ForegroundColor Yellow
Write-Host "Proxy (Protection + Cache), Object Pool, Adapter + Guards de RBAC." -ForegroundColor Yellow
