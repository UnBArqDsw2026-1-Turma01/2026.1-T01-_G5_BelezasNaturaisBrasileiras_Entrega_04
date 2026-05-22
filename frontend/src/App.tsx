import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import TrilhaDetail from './pages/TrilhaDetail'
import CriarTrilha from './pages/CriarTrilha'
import PainelOrganizador from './pages/PainelOrganizador'
import PontoDetail from './pages/PontoDetail'
import CriarPonto from './pages/CriarPonto'
import Chat from './pages/Chat'
import Perfil from './pages/Perfil'
import PainelAdmin from './pages/PainelAdmin'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Main layout */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/trilhas/:id"
            element={
              <Layout>
                <TrilhaDetail />
              </Layout>
            }
          />
          <Route
            path="/pontos/:id"
            element={
              <Layout>
                <PontoDetail />
              </Layout>
            }
          />

          {/* Protected — authenticated */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Layout>
                  <Perfil />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Layout>
                  <Chat />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Protected — ORGANIZER or ADMIN */}
          <Route
            path="/trilhas/criar"
            element={
              <ProtectedRoute roles={['ORGANIZER', 'ADMIN']}>
                <Layout>
                  <CriarTrilha />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trilhas/:id/painel"
            element={
              <ProtectedRoute roles={['ORGANIZER', 'ADMIN']}>
                <Layout>
                  <PainelOrganizador />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pontos/criar"
            element={
              <ProtectedRoute>
                <Layout>
                  <CriarPonto />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Protected — ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Layout>
                  <PainelAdmin />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
