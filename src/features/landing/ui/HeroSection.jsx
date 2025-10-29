import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Wallet, Zap, ArrowRight } from '../../../components/ui/Icons'

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="container relative mx-auto py-24 md:py-32 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-4 w-4" size={16} />
            Powered by Stellar Blockchain
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            El futuro del freelancing es <span className="text-primary">descentralizado</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            Conecta con talento global mediante contratos inteligentes. Pagos seguros, transparentes y sin
            intermediarios en la blockchain de Stellar.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2">
              <Wallet size={20} />
              Conectar Wallet
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
              <Link to="/feed">
                Explorar Trabajos
                <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
