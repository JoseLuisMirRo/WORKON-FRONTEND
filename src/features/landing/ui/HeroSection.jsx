import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { ArrowRight, Zap, Shield } from '../../../components/ui/Icons'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32">
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

          {/* Botones CTA - Acciones Core */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {/* Botón Crear Perfil - Freelancers */}
            <Button 
              asChild 
              size="lg" 
              className="group relative w-full sm:w-auto px-8 py-6 text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary hover:shadow-2xl hover:shadow-primary/60 transition-all duration-500 border-0 overflow-hidden animate-shimmer"
              style={{ backgroundSize: '200% auto' }}
            >
              <Link to="/registro?type=freelancer" className="flex items-center gap-3">
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="h-6 w-6 animate-pulse" size={24} />
                  Crear Perfil
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2 group-hover:scale-110" size={24} />
                </span>
              </Link>
            </Button>

            {/* Botón Publicar Trabajo - Empleadores */}
            <Button 
              asChild 
              size="lg" 
              className="group relative w-full sm:w-auto px-8 py-6 text-lg font-bold bg-gradient-to-r from-accent via-secondary to-accent hover:shadow-2xl hover:shadow-accent/60 transition-all duration-500 border-0 overflow-hidden"
              style={{ backgroundSize: '200% auto' }}
            >
              <Link to="/registro?type=employer" className="flex items-center gap-3">
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <span className="relative z-10 flex items-center gap-3">
                  <Shield className="h-6 w-6 animate-pulse" size={24} />
                  Publicar Trabajo
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2 group-hover:scale-110" size={24} />
                </span>
              </Link>
            </Button>
          </div>

          {/* Texto adicional para clarificar - Justo debajo de los botones */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-xs text-muted-foreground -mt-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span>Para Freelancers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
              <span>Para Empresas</span>
            </div>
          </div>

          {/* Logo Stellar */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <img src="/stellar.png" alt="Stellar" className="h-10 w-10" />
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 pt-4 text-sm text-muted-foreground">
            <Shield className="h-5 w-5 text-accent" size={20} />
            <span>Pagos seguros con contratos inteligentes auditados</span>
          </div>
        </div>
      </div>
    </section>
  )
}
