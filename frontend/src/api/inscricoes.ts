import api from './axios'

export const solicitarInscricao = (trilhaId: string) =>
  api.post(`/inscricoes/trilha/${trilhaId}`)

export const aceitarInscricao = (inscricaoId: string) =>
  api.post(`/inscricoes/${inscricaoId}/aceitar`)

export const rejeitarInscricao = (inscricaoId: string) =>
  api.post(`/inscricoes/${inscricaoId}/rejeitar`)

export const fazerCheckin = (inscricaoId: string, codigo: string) =>
  api.post(`/inscricoes/${inscricaoId}/checkin`, { codigo })

export const minhasInscricoes = () =>
  api.get('/inscricoes/minhas')
