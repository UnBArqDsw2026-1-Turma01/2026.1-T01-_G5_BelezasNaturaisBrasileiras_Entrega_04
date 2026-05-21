import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Hash, Users, CheckCircle, XCircle, MessageCircle, Edit } from 'lucide-react'
import { buscarTrilha, listarInscricoesDaTrilha, finalizarTrilha, editarTrilha, restaurarTrilha } from '../api/trilhas'
import { aceitarInscricao, rejeitarInscricao, fazerCheckin } from '../api/inscricoes'
import { useAuth } from '../contexts/AuthContext'

interface Trilha {
  id: string; titulo: string; status: string
  dataInicio?: string; vagasMaximas?: number
}
interface Inscricao {
  id: string; usuarioId?: string; usuarioNome?: string; status: string
  createdAt?: string; codigoConfirmacao?: string
}

export default function PainelOrganizador() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trilha, setTrilha] = useState<Trilha | null>(null)
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [codigoCheckin, setCodigoCheckin] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ titulo: '', vagasMaximas: 0 })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!id) return
    Promise.all([buscarTrilha(id), listarInscricoesDaTrilha(id)])
      .then(([t, i]) => {
        setTrilha(t.data)
        setEditForm({ titulo: t.data.titulo, vagasMaximas: t.data.vagasMaximas ?? 0 })
        setInscricoes(i.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const toast = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const handleAceitar = async (inscId: string) => {
    try { await aceitarInscricao(inscId); toast('Inscrição aceita!'); load() }
    catch { toast('Erro ao aceitar inscrição.') }
  }

  const handleRejeitar = async (inscId: string) => {
    try { await rejeitarInscricao(inscId); toast('Inscrição rejeitada.'); load() }
    catch { toast('Erro ao rejeitar inscrição.') }
  }

  const handleCheckin = async () => {
    const insc = inscricoes.find((i) => i.codigoConfirmacao === codigoCheckin || i.id.startsWith(codigoCheckin))
    if (!insc) { toast('Inscrição com esse código não encontrada.'); return }
    try {
      await fazerCheckin(insc.id, codigoCheckin)
      toast('Check-in realizado com sucesso!')
      setCodigoCheckin('')
      load()
    } catch { toast('Código inválido ou já utilizado.') }
  }

  const handleFinalizar = async () => {
    if (!id || !confirm('Finalizar a trilha? Badges serão distribuídos automaticamente.')) return
    try { await finalizarTrilha(id); toast('Trilha finalizada!'); load() }
    catch { toast('Erro ao finalizar trilha.') }
  }

  const handleSalvarEdicao = async () => {
    if (!id) return
    try {
      await editarTrilha(id, { titulo: editForm.titulo, vagasMaximas: editForm.vagasMaximas })
      toast('Trilha editada!')
      setEditMode(false)
      load()
    } catch { toast('Erro ao editar trilha.') }
  }

  const handleRestaurar = async () => {
    if (!id) return
    try { await restaurarTrilha(id); toast('Estado anterior restaurado!'); load() }
    catch { toast('Erro ao restaurar estado.') }
  }

  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">Acesso restrito a organizadores.</div>
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Carregando...</div>
  if (!trilha) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Trilha não encontrada.</div>

  const pendentes = inscricoes.filter((i) => i.status === 'PENDENTE')
  const aceitas = inscricoes.filter((i) => i.status === 'ACEITA' || i.status === 'PRESENTE')

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to={`/trilhas/${id}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar para a trilha
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Painel do Organizador</h1>

      {msg && (
        <div className={`rounded-lg px-4 py-3 mb-4 text-sm ${msg.includes('Erro') || msg.includes('inválido') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </div>
      )}

      {/* Trilha card */}
      <div className="card p-5 mb-4">
        {editMode ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input value={editForm.titulo} onChange={(e) => setEditForm((f) => ({ ...f, titulo: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vagas Máximas</label>
              <input type="number" value={editForm.vagasMaximas} onChange={(e) => setEditForm((f) => ({ ...f, vagasMaximas: Number(e.target.value) }))} className="input" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSalvarEdicao} className="btn-primary text-sm">Salvar</button>
              <button onClick={() => setEditMode(false)} className="btn-outline text-sm">Cancelar</button>
              <button onClick={handleRestaurar} className="btn-outline text-sm text-amber-600 border-amber-300 hover:bg-amber-50">Restaurar anterior</button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{trilha.titulo}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {trilha.dataInicio && new Date(trilha.dataInicio).toLocaleDateString('pt-BR')} •{' '}
                {aceitas.length}/{trilha.vagasMaximas} participantes
              </p>
            </div>
            <div className="flex gap-2">
              {trilha.status === 'ATIVA' && (
                <>
                  <button onClick={() => setEditMode(true)} className="btn-outline flex items-center gap-1 text-sm">
                    <Edit className="w-4 h-4" /> Editar
                  </button>
                  <button onClick={handleFinalizar} className="btn-green flex items-center gap-1 text-sm">
                    <CheckCircle className="w-4 h-4" /> Finalizar Trilha
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Check-in */}
      {trilha.status === 'ATIVA' && (
        <div className="card p-5 mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <Hash className="w-5 h-5 text-gray-500" /> Validar Presença
          </h3>
          <div className="flex gap-2">
            <input
              value={codigoCheckin}
              onChange={(e) => setCodigoCheckin(e.target.value)}
              placeholder="Digite o código do participante"
              className="input flex-1"
            />
            <button onClick={handleCheckin} className="btn-green whitespace-nowrap">Validar</button>
          </div>
        </div>
      )}

      {/* Inscricoes */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-500" /> Solicitações e Participantes
        </h3>

        {inscricoes.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Nenhuma inscrição ainda.</p>
        )}

        <div className="space-y-3">
          {inscricoes.map((insc) => (
            <div key={insc.id} className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-sm text-gray-900">{insc.usuarioNome ?? insc.usuarioId ?? insc.id.slice(0, 8)}</p>
                {insc.createdAt && (
                  <p className="text-xs text-gray-500">
                    Solicitado em {new Date(insc.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/chat?org=${user?.id}&part=${insc.usuarioId ?? insc.id}`)}
                  className="btn-primary text-xs py-1 px-3 flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" /> Ver Chat
                </button>
                {insc.status === 'PENDENTE' && (
                  <>
                    <button onClick={() => handleAceitar(insc.id)} className="p-1 text-green-600 hover:bg-green-50 rounded-full">
                      <CheckCircle className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleRejeitar(insc.id)} className="p-1 text-red-500 hover:bg-red-50 rounded-full">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </>
                )}
                {insc.status !== 'PENDENTE' && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    insc.status === 'ACEITA' ? 'bg-blue-100 text-blue-700' :
                    insc.status === 'PRESENTE' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {insc.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {pendentes.length > 0 && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700 space-y-1">
            <p className="font-medium">Como funciona o processo:</p>
            <ul className="space-y-0.5 text-xs list-disc list-inside">
              <li>Participantes enviam solicitações</li>
              <li>Você aceita ou recusa as solicitações</li>
              <li>Ao aceitar, um código único é gerado</li>
              <li>No dia da trilha, valide o código acima</li>
              <li>Ao finalizar, badges são distribuídos automaticamente</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
