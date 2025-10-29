import { Card, CardContent } from '../../../components/ui/Card'
import { CheckCircle2 } from '../../../components/ui/Icons'

const steps = [
  {
    number: '01',
    title: 'Crea tu perfil',
    description: 'Conecta tu wallet de Stellar y completa tu perfil profesional en minutos.',
  },
  {
    number: '02',
    title: 'Encuentra proyectos',
    description: 'Explora cientos de proyectos o recibe invitaciones directas de clientes.',
  },
  {
    number: '03',
    title: 'Trabaja seguro',
    description: 'Los fondos se bloquean en un contrato inteligente hasta completar el trabajo.',
  },
  {
    number: '04',
    title: 'Recibe tu pago',
    description: 'Una vez aprobado, recibe el pago instantáneamente en tu wallet.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-full max-w-5xl rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cómo funciona
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comienza a trabajar en 4 simples pasos
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              hover
              className="relative animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                {/* Número con gradiente */}
                <div className="flex items-start justify-between">
                  <span className="text-6xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent opacity-30">
                    {step.number}
                  </span>
                  <CheckCircle2 className="h-6 w-6 text-accent" size={24} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
              
              {/* Conector entre cards (oculto en el último) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
