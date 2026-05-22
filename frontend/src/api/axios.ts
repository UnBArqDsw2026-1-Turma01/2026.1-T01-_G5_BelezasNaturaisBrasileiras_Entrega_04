import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  const email = localStorage.getItem('userEmail')
  if (email) config.headers['x-user-email'] = email
  return config
})

export default api
