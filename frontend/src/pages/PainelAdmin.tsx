import { useState, useEffect } from 'react'
import { Shield, Users, Activity, Hash, MapPin, MessageSquare, Zap, RefreshCw } from 'lucide-react'
import { promoteUser } from '../api/auth'
import { trilhaStatus, gerarCodigo, validarCodigo, localizacaoPontos } from '../api/trilhas'
import { poolStatus } from '../api/chat'
import { adapterInfo, geocode, route, sendSms, sendWhatsapp, validateAuth } from '../api/adapters'
import { useAuth } from '../contexts/AuthContext'

type JsonResult = Record<string, unknown> | unknown[] | null

function ResultBox({ data }: { data: JsonResult }) {
  if (!data) return null
  return (
    <pre className="mt-3 bg-gray-900 text-green-400 rounded-lg p-3 text-xs overflow-auto max-h-48 whitespace-pre-wrap">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card p-5 mb-4">
      <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
        {icon} {title}
      </h2>
      {children}
    </div>
  )
}

export default function PainelAdmin() {
  const { user } = useAuth()

  // promote
  const [promoteEmail, setPromoteEmail] = useState('')
  const [promoteRole, setPromoteRole] = useState<'ORGANIZER' | 'COMMON_USER'>('ORGANIZER')
  const [promoteMsg, setPromoteMsg] = useState('')

  // sistema
  const [statusData, setStatusData] = useState<JsonResult>(null)
  const [poolData, setPoolData] = useState<JsonResult>(null)

  // códigos
  const [codigoGerado, setCodigoGerado] = useState('')
  const [codigoValidar, setCodigoValidar] = useState('')
  const [codigoResult, setCodigoResult] = useState<JsonResult>(null)

  // composite localizacao
  const [estado, setEstado] = useState('Goiás')
  const [cidade, setCidade] = useState('Alto Paraíso')
  const [pontosTxt, setPontosTxt] = useState('Chapada dos Veadeiros, Vale da Lua, Cachoeira Santa Bárbara')
  const [compositeResult, setCompositeResult] = useState<JsonResult>(null)

  // adapters
  const [adapterInfoData, setAdapterInfoData] = useState<JsonResult>(null)
  const [geocodeAddr, setGeocodeAddr] = useState('Chapada dos Veadeiros, GO')
  const [geocodeResult, setGeocodeResult] = useState<JsonResult>(null)
  const [routeFrom, setRouteFrom] = useState('{"lat":-14.0839,"lng":-47.4987}')
  const [routeTo, setRouteTo] = useState('{"lat":-15.7801,"lng":-47.9292}')
  const [routeResult, setRouteResult] = useState<JsonResult>(null)
  const [smsTo, setSmsTo] = useState('+5561999999999')
  const [smsMsg, setSmsMsg] = useState('Sua inscrição foi aceita!')
  const [smsResult, setSmsResult] = useState<JsonResult>(null)
  const [waTo, setWaTo] = useState('+5561999999999')
  const [waMsg, setWaMsg] = useState('Seu check-in foi confirmado!')
  const [waResult, setWaResult] = useState<JsonResult>(null)
  const [authResult, setAuthResult] = useState<JsonResult>(null)

  const toast = (set: (v: string) => void) => (m: string) => { set(m); setTimeout(() => set(''), 3000) }

  useEffect(() => {
    trilhaStatus().then((r) => setStatusData(r.data)).catch(() => {})
    poolStatus().then((r) => setPoolData(r.data)).catch(() => {})
    adapterInfo().then((r) => setAdapterInfoData(r.data)).catch(() => {})
  }, [])

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Acesso restrito a administradores.</p>
      </div>
    )
  }

  const handlePromote = async () => {
    if (!promoteEmail.trim()) return
    try {
      await promoteUser(promoteEmail.trim(), promoteRole)
      toast(setPromoteMsg)(`Usuário promovido para ${promoteRole}!`)
      setPromoteEmail('')
    } catch {
      toast(setPromoteMsg)('Erro ao promover. Verifique se o e-mail existe.')
    }
  }

  const handleRefreshStatus = async () => {
    const [s, p] = await Promise.all([trilhaStatus(), poolStatus()])
    setStatusData(s.data)
    setPoolData(p.data)
  }

  const handleGerarCodigo = async () => {
    const r = await gerarCodigo()
    setCodigoGerado(r.data.codigo)
    setCodigoValidar(r.data.codigo)
    setCodigoResult(r.data)
  }

  const handleValidarCodigo = async () => {
    if (!codigoValidar) return
    const r = await validarCodigo(codigoValidar)
    setCodigoResult(r.data)
  }

  const handleComposite = async () => {
    const pontos = pontosTxt.split(',').map((p) => p.trim()).filter(Boolean)
    const r = await localizacaoPontos({ estado, cidades: [{ nome: cidade, pontos }] })
    setCompositeResult(r.data)
  }

  const handleGeocode = async () => {
    const r = await geocode(geocodeAddr)
    setGeocodeResult(r.data)
  }

  const handleRoute = async () => {
    try {
      const from = JSON.parse(routeFrom)
      const to = JSON.parse(routeTo)
      const r = await route(from, to)
      setRouteResult(r.data)
    } catch { setRouteResult({ erro: 'JSON inválido nos campos de coordenadas' }) }
  }

  const handleSms = async () => {
    const r = await sendSms(smsTo, smsMsg)
    setSmsResult(r.data)
  }

  const handleWhatsapp = async () => {
    const r = await sendWhatsapp(waTo, waMsg)
    setWaResult(r.data)
  }

  const handleAuthValidate = async () => {
    const r = await validateAuth({ token: 'google-token-demo', provider: 'google' })
    setAuthResult(r.data)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
      </div>

      {/* ── Gestão de Usuários ─────────────────────────────────────── */}
      <Section title="Gestão de Usuários" icon={<Users className="w-5 h-5 text-gray-500" />}>
        <p className="text-sm text-gray-500 mb-3">
          Promova ou rebaixe usuários. Padrão: <strong>Prototype</strong> (user.clone).
        </p>
        {promoteMsg && (
          <div className={`rounded-lg px-3 py-2 mb-3 text-sm ${promoteMsg.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {promoteMsg}
          </div>
        )}
        <div className="space-y-3">
          <input
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            placeholder="email@usuario.com"
            className="input"
          />
          <div className="flex gap-2">
            {(['ORGANIZER', 'COMMON_USER'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setPromoteRole(r)}
                className={`flex-1 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                  promoteRole === r ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {r === 'ORGANIZER' ? 'Organizador' : 'Participante'}
              </button>
            ))}
          </div>
          <button onClick={handlePromote} disabled={!promoteEmail.trim()} className="btn-primary w-full">
            Promover Usuário
          </button>
        </div>
      </Section>

      {/* ── Status do Sistema ──────────────────────────────────────── */}
      <Section title="Status do Sistema" icon={<Activity className="w-5 h-5 text-gray-500" />}>
        <p className="text-sm text-gray-500 mb-3">
          Padrões: <strong>Singleton</strong> (ConfirmationCodeService) · <strong>Object Pool</strong> (ChatObjectPool).
        </p>
        <button onClick={handleRefreshStatus} className="btn-outline flex items-center gap-2 text-sm mb-3">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Singleton — Trilhas</p>
            <ResultBox data={statusData} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Object Pool — Chat</p>
            <ResultBox data={poolData} />
          </div>
        </div>
      </Section>

      {/* ── Gerador de Código ──────────────────────────────────────── */}
      <Section title="Singleton — Gerador de Código" icon={<Hash className="w-5 h-5 text-gray-500" />}>
        <p className="text-sm text-gray-500 mb-3">
          Instância única que gera e revoga códigos de check-in. Normalmente acionado ao aceitar inscrição; aqui demonstrado diretamente.
        </p>
        <div className="flex gap-2 mb-3">
          <button onClick={handleGerarCodigo} className="btn-green text-sm">Gerar Código</button>
          {codigoGerado && (
            <span className="flex items-center text-lg font-mono font-bold text-green-700 bg-green-50 px-4 rounded-lg">
              {codigoGerado}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            value={codigoValidar}
            onChange={(e) => setCodigoValidar(e.target.value)}
            placeholder="Cole o código aqui"
            className="input flex-1 font-mono"
          />
          <button onClick={handleValidarCodigo} className="btn-outline text-sm whitespace-nowrap">Validar</button>
        </div>
        <ResultBox data={codigoResult} />
      </Section>

      {/* ── Composite Localização ─────────────────────────────────── */}
      <Section title="Composite — Localização" icon={<MapPin className="w-5 h-5 text-gray-500" />}>
        <p className="text-sm text-gray-500 mb-3">
          Árvore Estado → Cidade → Pontos Turísticos com contagem recursiva.
        </p>
        <div className="space-y-2 mb-3">
          <input value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Estado" className="input" />
          <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" className="input" />
          <input
            value={pontosTxt}
            onChange={(e) => setPontosTxt(e.target.value)}
            placeholder="Pontos separados por vírgula"
            className="input"
          />
        </div>
        <button onClick={handleComposite} className="btn-primary text-sm">Calcular Pontos</button>
        <ResultBox data={compositeResult} />
      </Section>

      {/* ── Adaptadores Externos ──────────────────────────────────── */}
      <Section title="Adapter — Integrações Externas" icon={<Zap className="w-5 h-5 text-gray-500" />}>
        <p className="text-sm text-gray-500 mb-1">
          Todos os serviços externos implementam a mesma interface. <code className="text-xs bg-gray-100 px-1 rounded">GET /adapters/info</code>:
        </p>
        <ResultBox data={adapterInfoData} />

        <div className="mt-4 space-y-4">
          {/* Geocode */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">GoogleMapsAdapter — Geocode</p>
            <div className="flex gap-2">
              <input value={geocodeAddr} onChange={(e) => setGeocodeAddr(e.target.value)} className="input flex-1 text-sm" />
              <button onClick={handleGeocode} className="btn-outline text-sm whitespace-nowrap">Geocodificar</button>
            </div>
            <ResultBox data={geocodeResult} />
          </div>

          {/* Route */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">GoogleMapsAdapter — Rota (JSON lat/lng)</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input value={routeFrom} onChange={(e) => setRouteFrom(e.target.value)} className="input text-xs font-mono" placeholder='{"lat":0,"lng":0}' />
              <input value={routeTo} onChange={(e) => setRouteTo(e.target.value)} className="input text-xs font-mono" placeholder='{"lat":0,"lng":0}' />
            </div>
            <button onClick={handleRoute} className="btn-outline text-sm">Calcular Rota</button>
            <ResultBox data={routeResult} />
          </div>

          {/* SMS */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">TwilioAdapter — SMS</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input value={smsTo} onChange={(e) => setSmsTo(e.target.value)} className="input text-sm" placeholder="+55..." />
              <input value={smsMsg} onChange={(e) => setSmsMsg(e.target.value)} className="input text-sm" placeholder="Mensagem" />
            </div>
            <button onClick={handleSms} className="btn-outline text-sm">Enviar SMS</button>
            <ResultBox data={smsResult} />
          </div>

          {/* WhatsApp */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">TwilioAdapter — WhatsApp</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input value={waTo} onChange={(e) => setWaTo(e.target.value)} className="input text-sm" placeholder="+55..." />
              <input value={waMsg} onChange={(e) => setWaMsg(e.target.value)} className="input text-sm" placeholder="Mensagem" />
            </div>
            <button onClick={handleWhatsapp} className="btn-outline text-sm">Enviar WhatsApp</button>
            <ResultBox data={waResult} />
          </div>

          {/* Auth */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">GoogleAuthAdapter — Validar Token OAuth</p>
            <button onClick={handleAuthValidate} className="btn-outline text-sm">Validar Callback</button>
            <ResultBox data={authResult} />
          </div>
        </div>
      </Section>

      {/* ── Chat sessions ─────────────────────────────────────────── */}
      <Section title="Object Pool — Chat" icon={<MessageSquare className="w-5 h-5 text-gray-500" />}>
        <p className="text-sm text-gray-500 mb-3">
          Pool de conexões de chat (máx 50). Conexões são adquiridas e liberadas via <code className="text-xs bg-gray-100 px-1 rounded">acquire()</code> / <code className="text-xs bg-gray-100 px-1 rounded">release()</code>.
          O status atual já aparece na seção "Status do Sistema" acima.
        </p>
        <ResultBox data={poolData} />
      </Section>
    </div>
  )
}
