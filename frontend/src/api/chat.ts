import api from './axios'

export const iniciarSessao = (userAId: string, userBId: string) =>
  api.post('/chat/sessions', { userAId, userBId })

export const buscarMensagens = (sessionId: string) =>
  api.get(`/chat/sessions/${sessionId}/messages`)

export const enviarMensagem = (sessionId: string, message: string, from: string) =>
  api.post(`/chat/sessions/${sessionId}/messages`, { message, from })

export const encerrarSessao = (sessionId: string) =>
  api.delete(`/chat/sessions/${sessionId}`)

export const poolStatus = () =>
  api.get('/chat/pool/status')
