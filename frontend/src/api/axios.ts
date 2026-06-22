import axios, { AxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const cfg: any = config ?? {}
  const headers = (cfg.headers as Record<string, any>) ?? {}
  const token = localStorage.getItem('token')
  if (token) headers['Authorization'] = `Bearer ${token}`
  const email = localStorage.getItem('userEmail')
  if (email) headers['x-user-email'] = email
  cfg.headers = headers
  return cfg
})

export default api
