import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { buscarBadges } from '../api/trilhas'
import { minhasInscricoes } from '../api/inscricoes'
import { Mail, Award, MapPin, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Badge { id: string; tipo: string; trilhaId?: string; conqueredAt?: string }
interface Inscricao { id: string; trilhaId: string; status: string; trilha?: { titulo: string } }

export default function Perfil() {
  const { user } = useAuth()
  const [badges, setBadges] = useState<Badge[]>([])
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [tab, setTab] = useState<'info' | 'badges' | 'inscricoes'>('info')

  useEffect(() => {
    buscarBadges().then((r) => setBadges(r.data)).catch(() => {})
    minhasInscricoes().then((r) => setInscricoes(r.data)).catch(() => {})
  }, [])

  if (!user) return null

  const roleLabel: Record<string, string> = {
    COMMON_USER: 'Participante',
    ORGANIZER: 'Organizador',
    ADMIN: 'Administrador',
  }

  const roleColor: Record<string, string> = {
    COMMON_USER: 'bg-gray-100 text-gray-700',
    ORGANIZER: 'bg-green-100 text-green-700',
    ADMIN: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
            {user.nome?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{user.nome}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[user.role]}`}>
              {roleLabel[user.role]}
            </span>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" /> {user.email}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{inscricoes.length}</p>
            <p className="text-xs text-gray-500">Inscrições</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{inscricoes.filter((i) => i.status === 'PRESENTE').length}</p>
            <p className="text-xs text-gray-500">Concluídas</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{badges.length}</p>
            <p className="text-xs text-gray-500">Badges</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {([['info', 'Informações'], ['badges', `Badges (${badges.length})`], ['inscricoes', `Inscrições (${inscricoes.length})`]] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Informações de Contato</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" /> {user.email}
            </p>
            <p className="text-sm text-gray-500">ID: {user.id ?? '—'}</p>
          </div>
        </div>
      )}

      {tab === 'badges' && (
        <div>
          {badges.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Nenhum badge ainda. Conclua trilhas para ganhar!</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div key={b.id} className="card p-4 border-2 border-amber-200 bg-amber-50">
                  <Award className="w-8 h-8 text-amber-500 mb-2" />
                  <p className="font-semibold text-sm text-gray-900">{b.tipo}</p>
                  {b.conqueredAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Conquistado em {new Date(b.conqueredAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  <p className="text-xs text-amber-700 font-medium mt-1">Badge Oficial</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'inscricoes' && (
        <div className="space-y-3">
          {inscricoes.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Nenhuma inscrição ainda.</p>
          ) : (
            inscricoes.map((i) => (
              <Link key={i.id} to={`/trilhas/${i.trilhaId}`} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{i.trilha?.titulo ?? i.trilhaId}</p>
                    <p className="text-xs text-gray-500">{i.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  i.status === 'PRESENTE' ? 'bg-green-100 text-green-700' :
                  i.status === 'ACEITA' ? 'bg-blue-100 text-blue-700' :
                  i.status === 'PENDENTE' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>{i.status}</span>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Admin quick access */}
      {user.role === 'ADMIN' && (
        <div className="mt-6">
          <Link to="/admin" className="btn-primary w-full text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> Painel Administrativo
          </Link>
        </div>
      )}
    </div>
  )
}
