import { Mountain, User, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-green-600 font-bold text-lg">
          <Mountain className="w-6 h-6" />
          <span>Trilhas Brasil</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/perfil"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <User className="w-4 h-4" />
                <span>{user?.nome ?? user?.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
