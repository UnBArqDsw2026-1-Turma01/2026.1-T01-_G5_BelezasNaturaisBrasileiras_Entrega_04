import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { criarTrilha } from '../api/trilhas'

export default function CriarTrilha() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    pontoEncontro: '',
    dataInicio: '',
    vagasMaximas: 10,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: string, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await criarTrilha({
        ...form,
        dataInicio: new Date(form.dataInicio).toISOString(),
        vagasMaximas: Number(form.vagasMaximas),
      })
      navigate(`/trilhas/${res.data.id}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erro ao criar trilha.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Criar Nova Trilha</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Trilha *</label>
            <input
              value={form.titulo}
              onChange={(e) => set('titulo', e.target.value)}
              placeholder="Ex: Trilha da Pedra Grande - Amanhecer"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ponto de Encontro *</label>
            <input
              value={form.pontoEncontro}
              onChange={(e) => set('pontoEncontro', e.target.value)}
              placeholder="Ex: Portaria do Parque Nacional"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <textarea
              value={form.descricao}
              onChange={(e) => set('descricao', e.target.value)}
              placeholder="Descreva a trilha, o que os participantes podem esperar..."
              className="input resize-none h-28"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora *</label>
              <input
                type="datetime-local"
                value={form.dataInicio}
                onChange={(e) => set('dataInicio', e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Participantes *</label>
              <input
                type="number"
                min={1}
                value={form.vagasMaximas}
                onChange={(e) => set('vagasMaximas', e.target.value)}
                className="input"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
            <strong>Nota:</strong> Apenas você pode editar esta trilha. Ao finalizar, badges serão automaticamente distribuídos aos participantes com presença confirmada.
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Link to="/" className="btn-outline flex-1 text-center">Cancelar</Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Criando...' : 'Criar Trilha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
