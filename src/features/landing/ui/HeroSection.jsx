import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { ArrowRight, Zap, Shield } from '../../../components/ui/Icons'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center space-y-8 animate-fade-in">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 rounded-full glass border border-primary/30 px-4 py-2 text-sm font-medium shadow-lg shadow-primary/20">
            <Zap className="h-4 w-4 text-accent" size={16} />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Powered by Stellar
            </span>
          </div>

          {/* Título principal */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block text-white animate-slide-up">
              El futuro del freelancing es
            </span>
            <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.1s' }}>
              descentralizado
            </span>
          </h1>

          {/* Descripción */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Conecta con talento global mediante contratos inteligentes. Pagos seguros, transparentes y sin intermediarios en la blockchain de Stellar.
          </p>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="group w-full sm:w-auto bg-gradient-to-r from-primary via-accent to-primary hover:shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300 border-0" style={{ backgroundSize: '200% auto' }}>
              <Link to="/feed" className="flex items-center gap-2">
                Crear Perfil
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" size={20} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto glass border-2 border-white/30 hover:border-white/60 hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <Link to="/feed">
                Publicar Trabajo
              </Link>
            </Button>
          </div>
          {/* Logo Stellar */}
          <div className="flex items-center justify-center gap-2">
            <img src="/stellar.png" alt="Stellar" className="h-10 w-10" />
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 pt-8 text-sm text-muted-foreground">
            <Shield className="h-5 w-5 text-accent" size={20} />
            <span>Pagos seguros con contratos inteligentes auditados</span>
          </div>
        </div>
      </div>
    </section>
  )
}
