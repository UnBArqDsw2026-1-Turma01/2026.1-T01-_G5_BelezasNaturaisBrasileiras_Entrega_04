import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mountain, Mail, Lock, User } from 'lucide-react'
import { signup, login as loginApi } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from '../hooks/jwtDecode'

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    aceitouTermos: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (field: string, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (!form.aceitouTermos) {
      setError('Você precisa aceitar os termos.')
      return
    }
    setLoading(true)
    try {
      await signup({
        email: form.email,
        password: form.password,
        nome: form.nome,
        aceitouTermos: true,
      })
      const res = await loginApi({ email: form.email, password: form.password })
      const token = res.data.access_token
      const payload = jwtDecode(token) as { sub: string; email: string; role: string; nome?: string }
      login(token, {
        id: payload.sub,
        email: payload.email ?? form.email,
        nome: form.nome,
        role: payload.role as 'COMMON_USER' | 'ORGANIZER' | 'ADMIN',
      })
      navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(typeof msg === 'string' ? msg : 'Erro ao criar conta. Tente outro e-mail.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <Mountain className="w-8 h-8 text-green-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
          <p className="text-sm text-gray-500 mt-1">Junte-se à nossa comunidade</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={form.nome}
                onChange={(e) => set('nome', e.target.value)}
                placeholder="Seu nome"
                className="input pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="seu@email.com"
                className="input pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Mín. 8 caracteres"
                className="input pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className="input pl-9"
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.aceitouTermos}
              onChange={(e) => set('aceitouTermos', e.target.checked)}
              className="mt-0.5"
            />
            <span>Aceito os termos de uso e a política de privacidade</span>
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
