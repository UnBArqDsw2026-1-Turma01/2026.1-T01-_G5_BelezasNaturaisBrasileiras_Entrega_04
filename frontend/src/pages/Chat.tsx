import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { iniciarSessao, buscarMensagens, enviarMensagem, encerrarSessao } from '../api/chat'
import { useAuth } from '../contexts/AuthContext'

interface StoredMessage {
  id: string
  payload: { message: string; from: string }
  createdAt: string
}

export default function Chat() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  // Both sides pass org=<orgId>&part=<partId> using UUIDs
  const orgId = params.get('org') ?? ''
  const partId = params.get('part') ?? ''
  const myId = user?.id ?? ''

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<StoredMessage[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [starting, setStarting] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Start or reuse existing session between these two users
  useEffect(() => {
    if (!orgId || !partId) { setStarting(false); return }
    iniciarSessao(orgId, partId)
      .then((r) => setSessionId(r.data.id))
      .catch(() => {})
      .finally(() => setStarting(false))
  }, [orgId, partId])

  // Poll for messages every 2s once session is established
  useEffect(() => {
    if (!sessionId) return

    const fetch = () =>
      buscarMensagens(sessionId)
        .then((r) => setMessages(r.data))
        .catch(() => {})

    fetch()
    pollRef.current = setInterval(fetch, 2000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [sessionId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || !sessionId) return
    const content = text.trim()
    setText('')
    setSending(true)
    try {
      await enviarMensagem(sessionId, content, myId)
      // immediate refetch so sender sees it right away
      const r = await buscarMensagens(sessionId)
      setMessages(r.data)
    } catch {
      setText(content)
    } finally {
      setSending(false)
    }
  }

  const handleEncerrar = async () => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (sessionId) await encerrarSessao(sessionId).catch(() => {})
    navigate(-1)
  }

  const otherLabel = myId === orgId ? partId : orgId

  if (starting) return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">
      Iniciando sessão de chat...
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm truncate max-w-xs">{otherLabel}</p>
            <p className="text-xs text-gray-500">Chat privado 1-para-1</p>
          </div>
          <button onClick={handleEncerrar} className="text-xs text-red-500 hover:underline shrink-0">
            Encerrar
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 h-80 overflow-y-auto space-y-3 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-400 pt-8">
              Nenhuma mensagem ainda. Diga olá!
            </p>
          )}
          {messages.map((m) => {
            const isMe = m.payload.from === myId
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-2xl px-4 py-2 ${isMe ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                  {!isMe && (
                    <p className="text-xs font-semibold mb-1 text-gray-500 truncate">
                      {m.payload.from.slice(0, 8)}...
                    </p>
                  )}
                  <p className="text-sm">{m.payload.message}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(m.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Digite sua mensagem..."
            className="input flex-1"
            disabled={!sessionId}
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim() || !sessionId}
            className="btn-primary flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Enviar
          </button>
        </div>

        <div className="px-4 pb-3">
          <p className="text-xs text-blue-600 bg-blue-50 rounded-lg p-2">
            <strong>Comunicação 1-para-1:</strong> Chat privado entre participante e organizador. Atualiza a cada 2 segundos.
          </p>
        </div>
      </div>
    </div>
  )
}
