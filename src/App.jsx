import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { Navbar } from './components/Navbar'
import { LandingPage } from './features/landing'
import { FeedPage } from './features/feed'
import { MyJobsPage } from './features/my-jobs'
import { MessagesPage } from './features/messages'
import { EmployerDashboard } from './features/employer'
import { CreateFreelancerProfile, CreateEmployerProfile } from './features/profile'
import { LoginPage, RegisterPage } from './features/auth'
import { FreelancerProfilePage } from './features/profile'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Rutas Públicas - Solo accesibles sin sesión */}
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/registro" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />

            
            {/* Rutas Protegidas - Solo accesibles con sesión */}
            <Route path="/feed" element={
              <ProtectedRoute>
                <Navbar />
                <FeedPage />
              </ProtectedRoute>
            } />
            <Route path="/mis-trabajos" element={
              <ProtectedRoute>
                <Navbar />
                <MyJobsPage />
              </ProtectedRoute>
            } />
            <Route path="/mensajes" element={
              <ProtectedRoute>
                <Navbar />
                <MessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <Navbar />
                <FreelancerProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/tokens" element={
              <ProtectedRoute>
                <Navbar />
                <div className="container mx-auto py-20 px-4 text-center">
                  <h1 className="text-4xl font-bold mb-4">Tokens</h1>
                  <p className="text-muted-foreground">Esta sección está en desarrollo</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/configuracion" element={
              <ProtectedRoute>
                <Navbar />
                <div className="container mx-auto py-20 px-4 text-center">
                  <h1 className="text-4xl font-bold mb-4">Configuración</h1>
                  <p className="text-muted-foreground">Esta sección está en desarrollo</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/empleador" element={
              <ProtectedRoute>
                <Navbar />
                <EmployerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/crear-perfil-freelancer" element={
              <ProtectedRoute>
                <Navbar />
                <CreateFreelancerProfile />
              </ProtectedRoute>
            } />
            <Route path="/crear-perfil-empresa" element={
              <ProtectedRoute>
                <Navbar />
                <CreateEmployerProfile />
              </ProtectedRoute>
            } />
            <Route path="/perfil-freelancer" element={
              <ProtectedRoute>
                <Navbar />
                <FreelancerProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
