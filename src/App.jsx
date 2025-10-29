import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './features/landing'
import { FeedPage } from './features/feed'
import { MyJobsPage } from './features/my-jobs'
import { MessagesPage } from './features/messages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/mis-trabajos" element={<MyJobsPage />} />
        <Route path="/mensajes" element={<MessagesPage />} />
        <Route path="/perfil" element={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Perfil - Próximamente</div>} />
        <Route path="/tokens" element={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Tokens - Próximamente</div>} />
        <Route path="/configuracion" element={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Configuración - Próximamente</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
