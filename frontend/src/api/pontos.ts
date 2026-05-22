import api from './axios'

export interface CriarPontoPayload {
  titulo: string
  descricao: string
}

export const listarPontos = (params?: { titulo?: string }) =>
  api.get('/pontos-turisticos', { params })

export const buscarPonto = (id: string) =>
  api.get(`/pontos-turisticos/${id}`)

export const criarPonto = (data: CriarPontoPayload) =>
  api.post('/pontos-turisticos', data)

export const editarPonto = (id: string, data: CriarPontoPayload) =>
  api.put(`/pontos-turisticos/${id}`, data)

export const deletarPonto = (id: string) =>
  api.delete(`/pontos-turisticos/${id}`)

export const finalizarPonto = (id: string) =>
  api.post(`/pontos-turisticos/${id}/finalizar`, null, {
    headers: { 'x-user-id': localStorage.getItem('userEmail') ?? '' },
  })
