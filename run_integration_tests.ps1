
$baseUrl = "http://localhost:3000"
$globalResults = New-Object System.Collections.Generic.List[PSObject]

function Run-Step {
    param($title, $method, $path, $headers, $body)
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
        Write-Host ($response | ConvertTo-Json) -ForegroundColor Green
        
        $obj = New-Object PSObject -Property @{ Title = $title; Status = "PASS" }
        $globalResults.Add($obj)
        
        return $response
    } catch {
        Write-Host "FAILED: $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Body: $errorBody" -ForegroundColor Red
        }
        
        $obj = New-Object PSObject -Property @{ Title = $title; Status = "FAIL" }
        $globalResults.Add($obj)
        
        return $null
    }
}

$rand = Get-Random -Minimum 1000 -Maximum 9999
$emailOrg = "organizador.$rand@teste.com"
$emailPart = "participante.$rand@teste.com"
$emailAdmin = "admin.$rand@teste.com"

# 1. CRIAR CONTA DO ORGANIZADOR
$step1 = Run-Step "1. CRIAR CONTA DO ORGANIZADOR" "POST" "/accounts/signup" @{} @{
    email = $emailOrg
    password = "Senha@123"
    nome = "Organizador Teste"
    role = "ORGANIZER"
    aceitouTermos = $true
}

# 2a. CRIAR CONTA DO PARTICIPANTE
$step2 = Run-Step "2a. CRIAR CONTA DO PARTICIPANTE" "POST" "/accounts/signup" @{} @{
    email = $emailPart
    password = "Senha@123"
    nome = "Participante Teste"
    role = "COMMON"
    aceitouTermos = $true
}

# 2b. CRIAR CONTA DO ADMINISTRADOR
$stepAdmin = Run-Step "2b. CRIAR CONTA DO ADMINISTRADOR" "POST" "/accounts/signup" @{} @{
    email = $emailAdmin
    password = "Senha@123"
    nome = "Admin Teste"
    role = "ADMIN"
    aceitouTermos = $true
}

# 3. LOGIN DO ORGANIZADOR
$loginOrg = Run-Step "3. LOGIN DO ORGANIZADOR" "POST" "/accounts/login" @{} @{
    email = $emailOrg
    password = "Senha@123"
}
$TOKEN_ORG = $loginOrg.access_token

# 4. LOGIN DO PARTICIPANTE
$loginPart = Run-Step "4. LOGIN DO PARTICIPANTE" "POST" "/accounts/login" @{} @{
    email = $emailPart
    password = "Senha@123"
}
$TOKEN_PART = $loginPart.access_token

# 5. CRIAR TRILHA
$headersOrg = @{ Authorization = "Bearer $TOKEN_ORG" }
$step5 = Run-Step "5. CRIAR TRILHA" "POST" "/trilhas" $headersOrg @{
    titulo = "Chapada dos Veadeiros"
    descricao = "Trilha pelas cachoeiras do cerrado"
    pontoEncontro = "Portaria do Parque Nacional"
    dataInicio = "2026-07-15T08:00:00.000Z"
    vagasMaximas = 20
}
$TRILHA_ID = $step5.id

# 6. LISTAR TRILHAS
Run-Step "6a. LISTAR TRILHAS" "GET" "/trilhas?page=1&limit=10" @{} $null
Run-Step "6b. LISTAR TRILHAS COM FILTRO" "GET" "/trilhas?status=ATIVA&page=1&limit=5" @{} $null

# 7. DEMONSTRAR COMPOSITE
Run-Step "7. DEMONSTRAR COMPOSITE" "POST" "/trilhas/localizacao/pontos" @{} @{
    estado = "Goias"
    cidades = @(
        @{
            nome = "Alto Paraiso de Goias"
            pontos = @("Cachoeira dos Cristais", "Vale da Lua", "Mirante do Parque")
        },
        @{
            nome = "Cavalcante"
            pontos = @("Cachoeira Santa Barbara", "Cachoeira do Segredo")
        }
    )
}

# 8. DEMONSTRAR SINGLETON
$step8a = Run-Step "8a. GERAR CODIGO SINGLETON" "POST" "/trilhas/codigos/gerar" @{} @{ dummy = "data" }
$CODIGO_DEMO = $step8a.codigo
Run-Step "8b. VALIDAR CODIGO SINGLETON" "POST" "/trilhas/codigos/validar" @{} @{ codigo = $CODIGO_DEMO }
Run-Step "8c. STATUS SINGLETON" "GET" "/trilhas/status" @{} $null

# 9. PARTICIPANTE SOLICITA INSCRIÇÃO
$headersPart = @{ Authorization = "Bearer $TOKEN_PART" }
$step9 = Run-Step "9. PARTICIPANTE SOLICITA INSCRIÇÃO" "POST" "/inscricoes/trilha/$TRILHA_ID" $headersPart $null
$INSCRICAO_ID = $step9.id

# 10. ORGANIZADOR LISTA INSCRIÇÕES DA TRILHA
Run-Step "10. ORGANIZADOR LISTA INSCRIÇÕES DA TRILHA" "GET" "/trilhas/$TRILHA_ID/inscricoes" $headersOrg $null

# 11. ORGANIZADOR ACEITA A INSCRIÇÃO
$step11 = Run-Step "11. ORGANIZADOR ACEITA A INSCRIÇÃO" "POST" "/inscricoes/$INSCRICAO_ID/aceitar" $headersOrg $null
$CODIGO_CHECKIN = $step11.codigoConfirmacao

# 12. ORGANIZADOR FAZ CHECK-IN DO PARTICIPANTE
Run-Step "12. ORGANIZADOR FAZ CHECK-IN DO PARTICIPANTE" "POST" "/inscricoes/$INSCRICAO_ID/checkin" $headersOrg @{ codigo = $CODIGO_CHECKIN }

# 13. EDITAR TRILHA (Memento)
Run-Step "13. EDITAR TRILHA (Memento)" "PATCH" "/trilhas/$TRILHA_ID" $headersOrg @{ titulo = "Chapada Editada"; vagasMaximas = 30 }

# 14. RESTAURAR ESTADO ANTERIOR (Memento)
Run-Step "14. RESTAURAR ESTADO ANTERIOR (Memento)" "POST" "/trilhas/$TRILHA_ID/restaurar" $headersOrg $null

# 15. FINALIZAR TRILHA (Observer)
Run-Step "15. FINALIZAR TRILHA (Observer)" "POST" "/trilhas/$TRILHA_ID/finalizar" $headersOrg $null

# 16. VER BADGES RECEBIDOS
Run-Step "16. VER BADGES RECEBIDOS" "GET" "/trilhas/badges/minhas" $headersPart $null

# 17. LISTAR MINHAS INSCRIÇÕES
Run-Step "17. LISTAR MINHAS INSCRIÇÕES" "GET" "/inscricoes/minhas" $headersPart $null

# 18. CRIAR PONTO TURÍSTICO (Proxy)
$step18 = Run-Step "18. CRIAR PONTO TURÍSTICO (Proxy)" "POST" "/pontos-turisticos" @{ "x-user-email" = $emailOrg } @{
    titulo = "Cachoeira dos Cristais"
    descricao = "Cachoeira de aguas cristalinas no cerrado goiano"
}
$PONTO_ID = $step18.id

# 19. LISTAR PONTOS TURÍSTICOS (Cache Proxy)
Run-Step "19a. LISTAR PONTOS TURÍSTICOS (Cache MISS)" "GET" "/pontos-turisticos" @{} $null
Run-Step "19b. LISTAR PONTOS TURÍSTICOS (Cache HIT)" "GET" "/pontos-turisticos" @{} $null
Run-Step "19c. LISTAR PONTOS TURÍSTICOS COM FILTRO" "GET" "/pontos-turisticos?titulo=Cachoeira%20dos%20Cristais" @{} $null

# 20. EDITAR PONTO TURÍSTICO (Proxy)
Run-Step "20. EDITAR PONTO TURÍSTICO (Proxy)" "PUT" "/pontos-turisticos/$PONTO_ID" @{ "x-user-email" = $emailOrg } @{
    titulo = "Cachoeira dos Cristais - Trilha Longa"
    descricao = "Percurso completo de 12 km"
}

# 21. DEMONSTRAR OBJECT POOL STATUS
Run-Step "21. DEMONSTRAR OBJECT POOL STATUS" "GET" "/chat/pool/status" @{} $null

# 22. INICIAR SESSÃO DE CHAT
$step22 = Run-Step "22. INICIAR SESSÃO DE CHAT" "POST" "/chat/sessions" @{} @{
    userAId = $emailOrg
    userBId = $emailPart
}
$SESSION_ID = $step22.id

# 23. ENVIAR MENSAGEM (Object Pool)
Run-Step "23. ENVIAR MENSAGEM (Object Pool)" "POST" "/chat/sessions/$SESSION_ID/messages" @{} @{ message = "Confirmado presenca na trilha?" }

# 24. ENCERRAR SESSÃO DE CHAT
Run-Step "24. ENCERRAR SESSÃO DE CHAT" "DELETE" "/chat/sessions/$SESSION_ID" @{} $null

# 25. DEMONSTRAR ADAPTER INFO
Run-Step "25. DEMONSTRAR ADAPTER INFO" "GET" "/adapters/info" @{} $null

# 26. ADAPTER DE MAPA
Run-Step "26a. ADAPTER DE MAPA (Geocode)" "POST" "/adapters/geocode" @{} @{ address = "Chapada dos Veadeiros, Alto Paraiso de Goias, GO" }
Run-Step "26b. ADAPTER DE MAPA (Route)" "POST" "/adapters/route" @{} @{
    from = @{ lat = -14.13; lng = -47.51 }
    to = @{ lat = -13.99; lng = -47.49 }
}

# 27. ADAPTER DE NOTIFICAÇÃO
Run-Step "27a. ADAPTER DE NOTIFICAÇÃO (SMS)" "POST" "/adapters/notify/sms" @{} @{ to = "+5561999999999"; message = "Sua inscricao na trilha Chapada dos Veadeiros foi confirmada!" }
Run-Step "27b. ADAPTER DE NOTIFICAÇÃO (WhatsApp)" "POST" "/adapters/notify/whatsapp" @{} @{ to = "+5561999999999"; message = "Lembre-se: trilha comeca as 08h na Portaria do Parque." }

# 28. ADAPTER DE AUTENTICAÇÃO
Run-Step "28. ADAPTER DE AUTENTICAÇÃO" "POST" "/adapters/auth/validate" @{} @{ sub = "google-uid-organizador"; email = $emailOrg }

# 29. FINALIZAR PONTO TURÍSTICO (Mediator — orquestra 4 handlers)
Run-Step "29. FINALIZAR PONTO TURÍSTICO (Mediator)" "POST" "/pontos-turisticos/$PONTO_ID/finalizar" @{ "x-user-id" = $emailAdmin } $null

# 30. DELETAR PONTO TURÍSTICO (Proxy — somente ADMIN pode deletar)
Run-Step "30. DELETAR PONTO TURÍSTICO (Proxy)" "DELETE" "/pontos-turisticos/$PONTO_ID" @{ "x-user-email" = $emailAdmin } $null

# 31. PROMOVER USUÁRIO (RolesGuard + Prototype — user.clone com nova role)
$loginAdmin = Run-Step "31a. LOGIN DO ADMIN" "POST" "/accounts/login" @{} @{
    email = $emailAdmin
    password = "Senha@123"
}
$TOKEN_ADMIN = $loginAdmin.access_token
$headersAdmin = @{ Authorization = "Bearer $TOKEN_ADMIN" }
Run-Step "31b. PROMOVER PARTICIPANTE PARA ORGANIZER (Prototype)" "POST" "/accounts/promote" $headersAdmin @{
    email = $emailPart
    newRole = "ORGANIZER"
}

# --- RELATÓRIO FINAL ---
Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "       RESUMO DOS TESTES" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Magenta

$passCount = ($globalResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($globalResults | Where-Object { $_.Status -eq "FAIL" }).Count

Write-Host "TOTAL DE PASSOS: $($globalResults.Count)" -ForegroundColor Gray
Write-Host "SUCESSO: $passCount" -ForegroundColor Green
Write-Host "FALHA:   $failCount" -ForegroundColor Red

if ($failCount -gt 0) {
    Write-Host "`nDETALHE DAS FALHAS:" -ForegroundColor Red
    $i = 1
    foreach ($res in $globalResults) {
        if ($res.Status -eq "FAIL") {
            Write-Host "$i. $($res.Title)" -ForegroundColor Yellow
        }
        $i++
    }
} else {
    Write-Host "`nPARABÉNS! TODOS OS PASSOS FORAM CONCLUÍDOS." -ForegroundColor Green
}

Write-Host "========================================`n" -ForegroundColor Magenta
