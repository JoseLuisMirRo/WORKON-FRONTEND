import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RoleProtectedRoute } from './components/RoleProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { Navbar } from './components/Navbar'
import { LandingPage } from './features/landing'
import { FeedPage } from './features/feed'
import { MyJobsPage } from './features/my-jobs'
import { MessagesPage } from './features/messages'
import { EmployerDashboard } from './features/employer'
import { CreateFreelancerProfile, CreateEmployerProfile, FreelancerProfilePage } from './features/profile'
import { LoginPage, RegisterPage } from './features/auth'

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
            
            {/* Rutas para FREELANCERS */}
            <Route path="/feed" element={
              <RoleProtectedRoute allowedRoles={['freelancer']}>
                <Navbar />
                <FeedPage />
              </RoleProtectedRoute>
            } />
            <Route path="/mis-trabajos" element={
              <RoleProtectedRoute allowedRoles={['freelancer']}>
                <Navbar />
                <MyJobsPage />
              </RoleProtectedRoute>
            } />
            <Route path="/perfil" element={
              <RoleProtectedRoute allowedRoles={['freelancer']}>
                <Navbar />
                <FreelancerProfilePage />
              </RoleProtectedRoute>
            } />
            <Route path="/crear-perfil-freelancer" element={
              <RoleProtectedRoute allowedRoles={['freelancer']}>
                <Navbar />
                <CreateFreelancerProfile />
              </RoleProtectedRoute>
            } />
            <Route path="/perfil-freelancer" element={
              <RoleProtectedRoute allowedRoles={['freelancer']}>
                <Navbar />
                <FreelancerProfilePage />
              </RoleProtectedRoute>
            } />
            
            {/* Rutas para EMPLOYERS */}
            <Route path="/empleador" element={
              <RoleProtectedRoute allowedRoles={['employer']}>
                <Navbar />
                <EmployerDashboard />
              </RoleProtectedRoute>
            } />
            <Route path="/crear-perfil-empresa" element={
              <RoleProtectedRoute allowedRoles={['employer']}>
                <Navbar />
                <CreateEmployerProfile />
              </RoleProtectedRoute>
            } />
            
            {/* Rutas COMPARTIDAS - Accesibles para ambos roles */}
            <Route path="/mensajes" element={
              <RoleProtectedRoute allowedRoles={['freelancer', 'employer']}>
                <Navbar />
                <MessagesPage />
              </RoleProtectedRoute>
            } />
            <Route path="/tokens" element={
              <RoleProtectedRoute allowedRoles={['freelancer', 'employer']}>
                <Navbar />
                <div className="container mx-auto py-20 px-4 text-center">
                  <h1 className="text-4xl font-bold mb-4">Tokens</h1>
                  <p className="text-muted-foreground">Esta sección está en desarrollo</p>
                </div>
              </RoleProtectedRoute>
            } />
            <Route path="/configuracion" element={
              <RoleProtectedRoute allowedRoles={['freelancer', 'employer']}>
                <Navbar />
                <div className="container mx-auto py-20 px-4 text-center">
                  <h1 className="text-4xl font-bold mb-4">Configuración</h1>
                  <p className="text-muted-foreground">Esta sección está en desarrollo</p>
                </div>
              </RoleProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
