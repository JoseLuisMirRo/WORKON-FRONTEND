import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card'
import { Shield, Zap, Users } from '../../../components/ui/Icons'

const features = [
  {
    icon: Shield,
    title: 'Pagos Seguros',
    description: 'Los fondos se depositan en contratos inteligentes y se liberan automáticamente al completar las entregas',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'Transacciones Rápidas',
    description: 'Aprovecha la velocidad de Stellar: confirmaciones en segundos y comisiones mínimas',
    color: 'accent',
  },
  {
    icon: Users,
    title: 'Reputación On-Chain',
    description: 'Tu historial y calificaciones quedan registrados en blockchain de forma inmutable y transparente',
    color: 'success',
  },
]

export const FeaturesSection = () => {
  return (
    <section className="container mx-auto py-24 px-4">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">¿Por qué WorkOn?</h2>
        <p className="text-lg text-muted-foreground">La plataforma que revoluciona la forma de trabajar</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" size={24} />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
