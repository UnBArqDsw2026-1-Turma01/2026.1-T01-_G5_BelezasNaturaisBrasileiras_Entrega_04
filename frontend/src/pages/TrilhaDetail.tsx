import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Users, CheckCircle, Settings, MessageCircle } from 'lucide-react'
import { buscarTrilha } from '../api/trilhas'
import { solicitarInscricao, minhasInscricoes } from '../api/inscricoes'
import { useAuth } from '../contexts/AuthContext'

const HERO = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'

interface Trilha {
  id: string
  titulo: string
  descricao?: string
  pontoEncontro?: string
  dataInicio?: string
  vagasMaximas?: number
  status?: string
  organizadorId?: string
}

export default function TrilhaDetail() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [trilha, setTrilha] = useState<Trilha | null>(null)
  const [loading, setLoading] = useState(true)
  const [inscricaoStatus, setInscricaoStatus] = useState<string | null>(null)
  const [codigoConfirmacao, setCodigoConfirmacao] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!id) return
    buscarTrilha(id)
      .then((r) => setTrilha(r.data))
      .catch(() => setTrilha(null))
      .finally(() => setLoading(false))

    if (isAuthenticated) {
      minhasInscricoes()
        .then((r) => {
          const found = r.data.find((i: { trilhaId: string; status: string; codigoConfirmacao?: string }) => i.trilhaId === id)
          if (found) {
            setInscricaoStatus(found.status)
            setCodigoConfirmacao(found.codigoConfirmacao ?? null)
          }
        })
        .catch(() => {})
    }
  }, [id, isAuthenticated])

  const handleInscricao = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!id) return
    setSubmitting(true)
    setMsg('')
    try {
      await solicitarInscricao(id)
      setInscricaoStatus('PENDENTE')
      setMsg('Inscrição solicitada com sucesso!')
    } catch {
      setMsg('Erro ao solicitar inscrição.')
    } finally {
      setSubmitting(false)
    }
  }

  const isOrganizer = user?.id === trilha?.organizadorId || user?.role === 'ADMIN'
  const isOrganizerRole = user?.role === 'ORGANIZER' || user?.role === 'ADMIN'

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">Carregando...</div>
  if (!trilha) return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">Trilha não encontrada.</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      {/* Hero image */}
      <div className="h-56 rounded-xl overflow-hidden mb-6">
        <img src={HERO} alt={trilha.titulo} className="w-full h-full object-cover" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{trilha.titulo}</h1>
          {trilha.pontoEncontro && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {trilha.pontoEncontro}
            </p>
          )}
        </div>
        {isOrganizer && isOrganizerRole && (
          <Link
            to={`/trilhas/${trilha.id}/painel`}
            className="btn-outline flex items-center gap-2 text-sm shrink-0"
          >
            <Settings className="w-4 h-4" /> Painel
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {trilha.dataInicio && (
          <div className="card p-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Data</p>
              <p className="text-sm font-medium">{new Date(trilha.dataInicio).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        )}
        {trilha.vagasMaximas && (
          <div className="card p-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Vagas</p>
              <p className="text-sm font-medium">{trilha.vagasMaximas}</p>
            </div>
          </div>
        )}
        {trilha.status && (
          <div className="card p-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-medium">{trilha.status}</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {trilha.descricao && (
        <div className="card p-4 mb-6">
          <p className="text-gray-700 text-sm leading-relaxed">{trilha.descricao}</p>
        </div>
      )}

      {/* Action */}
      {msg && (
        <div className={`rounded-lg px-4 py-3 mb-4 text-sm ${msg.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </div>
      )}

      {trilha.status === 'ATIVA' && user?.role !== 'ORGANIZER' && user?.role !== 'ADMIN' && (
        <>
          {inscricaoStatus ? (
            <div className="card p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center">
                Sua inscrição:{' '}
                <span className={`font-bold ${inscricaoStatus === 'ACEITA' ? 'text-green-600' : inscricaoStatus === 'REJEITADA' ? 'text-red-600' : 'text-amber-600'}`}>
                  {inscricaoStatus}
                </span>
              </p>

              {inscricaoStatus === 'ACEITA' && codigoConfirmacao && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-green-600 font-medium mb-1">Seu código de presença</p>
                  <p className="text-3xl font-mono font-bold tracking-widest text-green-700">
                    {codigoConfirmacao}
                  </p>
                  <p className="text-xs text-green-500 mt-1">Mostre este código ao organizador no dia da trilha</p>
                </div>
              )}

              <button
                onClick={() => navigate(`/chat?org=${trilha.organizadorId}&part=${user?.id}`)}
                className="btn-outline w-full flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Chat com o Organizador
              </button>
            </div>
          ) : (
            <button onClick={handleInscricao} disabled={submitting} className="btn-green w-full py-3">
              {submitting ? 'Solicitando...' : 'Solicitar Inscrição'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
