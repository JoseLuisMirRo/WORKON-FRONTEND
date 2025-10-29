import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { ArrowRight } from '../../../components/ui/Icons'

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-12 md:p-16 lg:p-20 shadow-2xl shadow-primary/30">
          {/* Patrón de fondo */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Comienza a trabajar en el futuro
            </h2>
            <p className="text-lg text-white/90 md:text-xl">
              Únete a miles de freelancers que ya están ganando más con comisiones más bajas 
              y pagos instantáneos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild 
                size="lg" 
                className="group w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl"
              >
                <Link to="/feed" className="flex items-center gap-2">
                  Comenzar Ahora
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" size={20} />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white"
              >
                <Link to="/feed">
                  Ver Demo
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-white/70">
              Sin tarjeta de crédito requerida • Configura tu cuenta en minutos
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
