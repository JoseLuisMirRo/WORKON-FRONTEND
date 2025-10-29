import { Card, CardContent } from '../../../components/ui/Card'
import { Wallet, Shield, Zap } from '../../../components/ui/Icons'

const features = [
  {
    icon: Wallet,
    title: 'Pagos Instantáneos',
    description: 'Recibe tus pagos en USDC o XLM al instante cuando completes un proyecto. Sin esperas, sin intermediarios.',
    gradient: 'from-primary to-primary/80',
    iconColor: 'text-primary',
  },
  {
    icon: Shield,
    title: 'Contratos Inteligentes',
    description: 'Tus fondos están protegidos en contratos inteligentes auditados hasta que se complete el trabajo.',
    gradient: 'from-accent to-accent/80',
    iconColor: 'text-accent',
  },
  {
    icon: Zap,
    title: 'Comisiones Bajas',
    description: 'Solo 2% de comisión en lugar del 20% de otras plataformas. Maximiza tus ganancias.',
    gradient: 'from-secondary to-secondary/80',
    iconColor: 'text-accent',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ¿Por qué WorkOn?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            La primera plataforma freelance construida sobre blockchain, diseñada para freelancers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                hover 
                className="relative overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradiente de fondo */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <CardContent className="p-8 space-y-4 relative">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
