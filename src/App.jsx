import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { LandingPage } from './features/landing'
import { FeedPage } from './features/feed'
import { MyJobsPage } from './features/my-jobs'
import { MessagesPage } from './features/messages'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Landing sin Navbar */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Rutas con Navbar */}
          <Route path="/feed" element={
            <>
              <Navbar />
              <FeedPage />
            </>
          } />
          <Route path="/mis-trabajos" element={
            <>
              <Navbar />
              <MyJobsPage />
            </>
          } />
          <Route path="/mensajes" element={
            <>
              <Navbar />
              <MessagesPage />
            </>
          } />
          <Route path="/perfil" element={
            <>
              <Navbar />
              <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Perfil</h1>
                <p className="text-muted-foreground">Esta sección está en desarrollo</p>
              </div>
            </>
          } />
          <Route path="/tokens" element={
            <>
              <Navbar />
              <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Tokens</h1>
                <p className="text-muted-foreground">Esta sección está en desarrollo</p>
              </div>
            </>
          } />
          <Route path="/configuracion" element={
            <>
              <Navbar />
              <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Configuración</h1>
                <p className="text-muted-foreground">Esta sección está en desarrollo</p>
              </div>
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
