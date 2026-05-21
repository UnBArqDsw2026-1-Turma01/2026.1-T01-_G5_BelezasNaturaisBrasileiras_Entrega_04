import api from './axios'

export interface CriarTrilhaPayload {
  titulo: string
  descricao: string
  pontoEncontro: string
  dataInicio: string
  vagasMaximas: number
}

export const listarTrilhas = (params?: { status?: string; page?: number; limit?: number }) =>
  api.get('/trilhas', { params })

export const buscarTrilha = (id: string) =>
  api.get(`/trilhas/${id}`)

export const criarTrilha = (data: CriarTrilhaPayload) =>
  api.post('/trilhas', data)

export const editarTrilha = (id: string, data: Partial<CriarTrilhaPayload>) =>
  api.patch(`/trilhas/${id}`, data)

export const finalizarTrilha = (id: string) =>
  api.post(`/trilhas/${id}/finalizar`)

export const restaurarTrilha = (id: string) =>
  api.post(`/trilhas/${id}/restaurar`)

export const listarInscricoesDaTrilha = (trilhaId: string) =>
  api.get(`/trilhas/${trilhaId}/inscricoes`)

export const buscarBadges = () =>
  api.get('/trilhas/badges/minhas')

export const trilhaStatus = () =>
  api.get('/trilhas/status')

export const gerarCodigo = () =>
  api.post('/trilhas/codigos/gerar')

export const validarCodigo = (codigo: string) =>
  api.post('/trilhas/codigos/validar', { codigo })

export const localizacaoPontos = (body: {
  estado: string
  cidades: { nome: string; pontos: string[] }[]
}) => api.post('/trilhas/localizacao/pontos', body)
