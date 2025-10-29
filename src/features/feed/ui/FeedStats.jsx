import { Link } from 'react-router-dom'
import { Card, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { TrendingUp, Users, Zap } from '../../../components/ui/Icons'

export function FeedStats() {
  return (
    <div className="space-y-4">
      {/* Card principal de stats */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tu actividad</h3>
            <p className="text-sm text-muted-foreground">Resumen de tu cuenta</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                  <TrendingUp className="h-5 w-5 text-white" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground">Aplicaciones activas</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/30">
                  <Zap className="h-5 w-5 text-white" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Proyectos activos</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg">
                  <Users className="h-5 w-5 text-accent" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-muted-foreground">Vistas de perfil</p>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full shadow-lg" asChild>
            <Link to="/mis-trabajos">
              Ver mis trabajos
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick tips */}
      <Card className="border-accent/20">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" size={20} />
            <h4 className="font-semibold">Consejo rápido</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Los freelancers con perfil completo reciben 3x más invitaciones a proyectos.
          </p>
          <Button variant="outline" size="sm" className="w-full border-accent/50 hover:border-accent hover:text-accent">
            Completar perfil
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
