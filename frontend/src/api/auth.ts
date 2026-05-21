import api from './axios'

export interface SignupPayload {
  email: string
  password: string
  nome: string
  aceitouTermos: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export const signup = (data: SignupPayload) =>
  api.post('/accounts/signup', data)

export const login = (data: LoginPayload) =>
  api.post<{ access_token: string }>('/accounts/login', data)

export const promoteUser = (email: string, newRole: string) =>
  api.post('/accounts/promote', { email, newRole })
