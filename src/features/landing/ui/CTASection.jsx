import { Card, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { CheckCircle2, Wallet } from '../../../components/ui/Icons'

export const CTASection = () => {
  return (
    <section className="container mx-auto py-24 px-4">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
          <CheckCircle2 size={64} className="text-primary" />
          <div>
            <h2 className="mb-3 text-3xl font-bold tracking-tight">
              Únete a la revolución del trabajo descentralizado
            </h2>
            <p className="text-lg text-muted-foreground">
              Miles de freelancers y empleadores ya confían en WorkOn
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Wallet size={20} />
            Comenzar Ahora
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
