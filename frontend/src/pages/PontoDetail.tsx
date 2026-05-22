import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Edit, Trash2 } from 'lucide-react'
import { buscarPonto, editarPonto, deletarPonto, finalizarPonto } from '../api/pontos'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const HERO = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80'

interface Ponto {
  id: string; titulo: string; descricao?: string
  criadoPor?: string; cidade?: string; estado?: string
}

export default function PontoDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ponto, setPonto] = useState<Ponto | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ titulo: '', descricao: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!id) return
    buscarPonto(id)
      .then((r) => { setPonto(r.data); setEditForm({ titulo: r.data.titulo, descricao: r.data.descricao ?? '' }) })
      .catch(() => setPonto(null))
      .finally(() => setLoading(false))
  }, [id])

  const toast = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const handleEditar = async () => {
    if (!id) return
    try {
      await editarPonto(id, editForm)
      setPonto((p) => p ? { ...p, ...editForm } : p)
      setEditMode(false)
      toast('Ponto atualizado!')
    } catch { toast('Erro ao editar ponto.') }
  }

  const handleDeletar = async () => {
    if (!id || !confirm('Excluir este ponto turístico?')) return
    try {
      await deletarPonto(id)
      navigate('/')
    } catch { toast('Apenas administradores podem excluir pontos.') }
  }

  const handleFinalizar = async () => {
    if (!id || !confirm('Finalizar este ponto turístico? O Mediator será acionado.')) return
    try {
      await finalizarPonto(id)
      toast('Ponto finalizado! Mediator executado.')
    } catch { toast('Erro ao finalizar ponto.') }
  }

  const canEdit = user?.email === ponto?.criadoPor || user?.role === 'ADMIN'
  const canDelete = user?.role === 'ADMIN'

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">Carregando...</div>
  if (!ponto) return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">Ponto não encontrado.</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="h-56 rounded-xl overflow-hidden mb-2">
        <img src={HERO} alt={ponto.titulo} className="w-full h-full object-cover" />
      </div>
      <div className="h-32 rounded-xl overflow-hidden mb-6">
        <img src="https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=900&q=80" alt="" className="w-full h-full object-cover" />
      </div>

      {msg && (
        <div className={`rounded-lg px-4 py-3 mb-4 text-sm ${msg.includes('Erro') || msg.includes('Apenas') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </div>
      )}

      {editMode ? (
        <div className="card p-5 mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input value={editForm.titulo} onChange={(e) => setEditForm((f) => ({ ...f, titulo: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea value={editForm.descricao} onChange={(e) => setEditForm((f) => ({ ...f, descricao: e.target.value }))} className="input resize-none h-24" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleEditar} className="btn-primary text-sm">Salvar</button>
            <button onClick={() => setEditMode(false)} className="btn-outline text-sm">Cancelar</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ponto.titulo}</h1>
              {(ponto.cidade || ponto.estado) && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {[ponto.cidade, ponto.estado].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <button onClick={() => setEditMode(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit className="w-5 h-5" />
                </button>
              )}
              {canDelete && (
                <>
                  <button
                    onClick={handleFinalizar}
                    title="Finalizar ponto (Mediator)"
                    className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg text-xs font-semibold px-3"
                  >
                    Finalizar
                  </button>
                  <button onClick={handleDeletar} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {ponto.descricao && (
            <div className="card p-4">
              <p className="text-gray-700 text-sm leading-relaxed">{ponto.descricao}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
