import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mountain, Mail, Lock } from 'lucide-react'
import { login as loginApi } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from '../hooks/jwtDecode'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi({ email, password })
      const token = res.data.access_token
      const payload = jwtDecode(token) as { sub: string; email: string; role: string; nome?: string }
      login(token, {
        id: payload.sub,
        email: payload.email ?? email,
        nome: payload.nome ?? email.split('@')[0],
        role: payload.role as 'COMMON_USER' | 'ORGANIZER' | 'ADMIN',
      })
      navigate('/')
    } catch {
      setError('E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <Mountain className="w-8 h-8 text-green-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo!</h1>
          <p className="text-sm text-gray-500 mt-1">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pl-9"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-green w-full py-2.5">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="text-blue-600 hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
