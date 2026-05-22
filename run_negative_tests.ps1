
$baseUrl = "http://localhost:3000"

function Run-Step {
    param($title, $method, $path, $headers, $body, $expectedStatus)
    Write-Host "`n--- $title ---" -ForegroundColor Cyan
    try {
        $params = @{
            Uri = "$baseUrl$path"
            Method = $method
            Headers = $headers
            ContentType = "application/json"
        }
        if ($body) {
            $params.Body = $body | ConvertTo-Json -Depth 10
        }
        $response = Invoke-RestMethod @params
        Write-Host "SUCCESS (Unexpected): $($response | ConvertTo-Json)" -ForegroundColor Yellow
        return $response
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $expectedStatus) {
            Write-Host "PASS: Received expected error $statusCode" -ForegroundColor Green
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Error Detail: $($reader.ReadToEnd())" -ForegroundColor Gray
        } else {
            Write-Host "FAIL: Expected $expectedStatus but got $statusCode" -ForegroundColor Red
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Error Detail: $($reader.ReadToEnd())" -ForegroundColor Red
        }
        return $null
    }
}

$rand = Get-Random -Minimum 1000 -Maximum 9999
$emailOrg = "org.fail.$rand@teste.com"
$emailCommon = "user.fail.$rand@teste.com"

# Setup: Criar contas
Write-Host "Configurando ambiente para testes de falha..." -ForegroundColor Gray
Invoke-RestMethod -Uri "$baseUrl/accounts/signup" -Method POST -ContentType "application/json" -Body (@{email=$emailOrg; password="Senha@123"; nome="Org"; role="ORGANIZER"; aceitouTermos=$true} | ConvertTo-Json) | Out-Null
Invoke-RestMethod -Uri "$baseUrl/accounts/signup" -Method POST -ContentType "application/json" -Body (@{email=$emailCommon; password="Senha@123"; nome="Common"; role="COMMON"; aceitouTermos=$true} | ConvertTo-Json) | Out-Null

$loginOrg = Invoke-RestMethod -Uri "$baseUrl/accounts/login" -Method POST -ContentType "application/json" -Body (@{email=$emailOrg; password="Senha@123"} | ConvertTo-Json)
$TOKEN_ORG = $loginOrg.access_token

$loginCommon = Invoke-RestMethod -Uri "$baseUrl/accounts/login" -Method POST -ContentType "application/json" -Body (@{email=$emailCommon; password="Senha@123"} | ConvertTo-Json)
$TOKEN_COMMON = $loginCommon.access_token

# --- TESTES DE FALHA ---

# 1. TENTAR DELETAR PONTO TURISTICO COMO ORGANIZADOR (Deve falhar 403)
# Primeiro criamos um ponto
$ponto = Invoke-RestMethod -Uri "$baseUrl/pontos-turisticos" -Method POST -ContentType "application/json" -Headers @{"x-user-email"=$emailOrg} -Body (@{titulo="Ponto Teste"; descricao="Desc"} | ConvertTo-Json)
$PONTO_ID = $ponto.id

Run-Step "F1. DELETAR PONTO COMO ORGANIZADOR (EXPECT 403)" "DELETE" "/pontos-turisticos/$PONTO_ID" @{"x-user-email"=$emailOrg} $null 403

# 2. TENTAR CRIAR TRILHA COMO USUARIO COMUM (Deve falhar 403 via RolesGuard)
$headersCommon = @{ Authorization = "Bearer $TOKEN_COMMON" }
Run-Step "F2. CRIAR TRILHA COMO USER COMUM (EXPECT 403)" "POST" "/trilhas" $headersCommon @{
    titulo = "Trilha Proibida"
    descricao = "Nao deve ser criada"
    pontoEncontro = "Lugar nenhum"
    dataInicio = "2026-07-15T08:00:00.000Z"
    vagasMaximas = 10
} 403

# 3. TENTAR CHECK-IN COM CODIGO INVALIDO (Deve falhar 400 ou 403)
# Primeiro criamos uma trilha e inscrição
$headersOrg = @{ Authorization = "Bearer $TOKEN_ORG" }
$trilha = Invoke-RestMethod -Uri "$baseUrl/trilhas" -Method POST -ContentType "application/json" -Headers $headersOrg -Body (@{titulo="Trilha Teste"; descricao="D"; pontoEncontro="P"; dataInicio="2026-08-01T10:00:00.000Z"; vagasMaximas=5} | ConvertTo-Json)
$TRILHA_ID = $trilha.id

$insc = Invoke-RestMethod -Uri "$baseUrl/inscricoes/trilha/$TRILHA_ID" -Method POST -ContentType "application/json" -Headers $headersCommon
$INSC_ID = $insc.id

Invoke-RestMethod -Uri "$baseUrl/inscricoes/$INSC_ID/aceitar" -Method POST -ContentType "application/json" -Headers $headersOrg | Out-Null

Run-Step "F3. CHECK-IN COM CODIGO ERRADO (EXPECT 400)" "POST" "/inscricoes/$INSC_ID/checkin" $headersOrg @{ codigo = "INVALIDO" } 400

Write-Host "`n--- Testes de Negativo Concluidos ---" -ForegroundColor Cyan
