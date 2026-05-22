import api from './axios'

export const adapterInfo = () =>
  api.get('/adapters/info')

export const geocode = (address: string) =>
  api.post('/adapters/geocode', { address })

export const route = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) =>
  api.post('/adapters/route', { from, to })

export const sendSms = (to: string, message: string) =>
  api.post('/adapters/notify/sms', { to, message })

export const sendWhatsapp = (to: string, message: string) =>
  api.post('/adapters/notify/whatsapp', { to, message })

export const validateAuth = (data: Record<string, unknown>) =>
  api.post('/adapters/auth/validate', data)
