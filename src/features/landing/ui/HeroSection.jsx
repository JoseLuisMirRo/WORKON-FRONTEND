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
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-slide-up" style={{ backgroundSize: '200% auto' }}>
              El futuro del freelancing
            </span>
            <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.1s' }}>
              es descentralizado
            </span>
          </h1>

          {/* Descripción */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Conecta con clientes de todo el mundo, cobra al instante con criptomonedas y 
            construye tu reputación verificable en la blockchain.
          </p>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="group w-full sm:w-auto">
              <Link to="/feed" className="flex items-center gap-2">
                Explorar Proyectos
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" size={20} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-accent/50 hover:border-accent">
              <Link to="/feed">
                Publicar Trabajo
              </Link>
            </Button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-8 pt-12 md:grid-cols-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="space-y-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                50K+
              </p>
              <p className="text-sm text-muted-foreground">Freelancers activos</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                $10M+
              </p>
              <p className="text-sm text-muted-foreground">Pagos procesados</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                15K+
              </p>
              <p className="text-sm text-muted-foreground">Proyectos completados</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                99.8%
              </p>
              <p className="text-sm text-muted-foreground">Satisfacción</p>
            </div>
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
