const steps = [
  {
    number: 1,
    title: 'Conecta tu Wallet',
    description: 'Usa tu wallet de Stellar para crear tu cuenta de forma segura y descentralizada',
    color: 'primary',
  },
  {
    number: 2,
    title: 'Publica o Aplica',
    description: 'Empleadores publican trabajos, freelancers aplican y son seleccionados',
    color: 'accent',
  },
  {
    number: 3,
    title: 'Trabaja y Cobra',
    description: 'Completa entregas, recibe aprobaciones y los tokens se liberan automáticamente',
    color: 'success',
  },
]

export const HowItWorksSection = () => {
  return (
    <section className="border-y border-border bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">¿Cómo funciona?</h2>
          <p className="text-lg text-muted-foreground">Tres simples pasos para empezar</p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {step.number}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
