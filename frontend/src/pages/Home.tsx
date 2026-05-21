import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, MapPin, Calendar, Users, AlertTriangle, Mountain } from 'lucide-react'
import { listarPontos } from '../api/pontos'
import { listarTrilhas } from '../api/trilhas'
import { useAuth } from '../contexts/AuthContext'

const TRAIL_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
  'https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=400&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
]

function statusBadge(status: string) {
  const map: Record<string, string> = {
    ATIVA: 'bg-green-100 text-green-700',
    FINALIZADA: 'bg-gray-100 text-gray-600',
    CANCELADA: 'bg-red-100 text-red-600',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const [tab, setTab] = useState<'pontos' | 'trilhas'>('pontos')
  const [pontos, setPontos] = useState<unknown[]>([])
  const [trilhas, setTrilhas] = useState<unknown[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (tab === 'pontos') {
      listarPontos(search ? { titulo: search } : undefined)
        .then((r) => setPontos(r.data))
        .catch(() => setPontos([]))
        .finally(() => setLoading(false))
    } else {
      listarTrilhas({ page: 1, limit: 20 })
        .then((r) => setTrilhas(r.data))
        .catch(() => setTrilhas([]))
        .finally(() => setLoading(false))
    }
  }, [tab, search])

  const canCreatePonto = isAuthenticated                                              // RF03: qualquer usuário logado
  const canCreateTrilha = isAuthenticated && (user?.role === 'ORGANIZER' || user?.role === 'ADMIN')

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Descubra as Melhores Trilhas do Brasil</h1>
        <p className="text-gray-500 mt-1">Explore pontos turísticos incríveis e participe de trilhas organizadas</p>
      </div>

      {/* Alert */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-medium">Aviso de Segurança:</span> Nunca faça pagamentos fora da plataforma para participar de trilhas. Reporte qualquer suspeita de fraude.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {(['pontos', 'trilhas'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSearch('') }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'pontos' ? <MapPin className="w-4 h-4" /> : <Mountain className="w-4 h-4" />}
            {t === 'pontos' ? 'Pontos Turísticos' : 'Trilhas'}
          </button>
        ))}
      </div>

      {/* Search + Create */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === 'pontos' ? 'Buscar pontos turísticos...' : 'Buscar trilhas...'}
            className="input pl-9"
          />
        </div>
        {canCreatePonto && tab === 'pontos' && (
          <Link to="/pontos/criar" className="btn-green flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Criar Ponto
          </Link>
        )}
        {canCreateTrilha && tab === 'trilhas' && (
          <Link to="/trilhas/criar" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Criar Trilha
          </Link>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-44 bg-gray-200 rounded-t-xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : tab === 'pontos' ? (
        <PontosGrid pontos={pontos as PontoItem[]} />
      ) : (
        <TrilhasGrid trilhas={trilhas as TrilhaItem[]} />
      )}
    </div>
  )
}

interface PontoItem {
  id: string
  titulo: string
  descricao?: string
  cidade?: string
  estado?: string
  criadoPor?: string
}

function PontosGrid({ pontos }: { pontos: PontoItem[] }) {
  if (!pontos.length)
    return <p className="text-center text-gray-400 py-12">Nenhum ponto turístico encontrado.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pontos.map((p, i) => (
        <Link key={p.id} to={`/pontos/${p.id}`} className="card hover:shadow-md transition-shadow group">
          <div className="h-44 overflow-hidden rounded-t-xl bg-gray-100">
            <img
              src={TRAIL_IMAGES[i % TRAIL_IMAGES.length]}
              alt={p.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{p.titulo}</h3>
            {(p.cidade || p.estado) && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {[p.cidade, p.estado].filter(Boolean).join(', ')}
              </p>
            )}
            {p.descricao && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.descricao}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

interface TrilhaItem {
  id: string
  titulo: string
  descricao?: string
  pontoEncontro?: string
  dataInicio?: string
  vagasMaximas?: number
  status?: string
  organizadorId?: string
}

function TrilhasGrid({ trilhas }: { trilhas: TrilhaItem[] }) {
  if (!trilhas.length)
    return <p className="text-center text-gray-400 py-12">Nenhuma trilha encontrada.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trilhas.map((t, i) => (
        <Link key={t.id} to={`/trilhas/${t.id}`} className="card hover:shadow-md transition-shadow group">
          <div className="h-44 overflow-hidden rounded-t-xl bg-gray-100">
            <img
              src={TRAIL_IMAGES[i % TRAIL_IMAGES.length]}
              alt={t.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{t.titulo}</h3>
              {t.status && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusBadge(t.status)}`}>
                  {t.status}
                </span>
              )}
            </div>
            {t.pontoEncontro && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {t.pontoEncontro}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              {t.dataInicio && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(t.dataInicio).toLocaleDateString('pt-BR')}
                </span>
              )}
              {t.vagasMaximas && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {t.vagasMaximas} vagas
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
