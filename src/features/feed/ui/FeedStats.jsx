import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card'
import { Avatar, AvatarFallback } from '../../../components/ui/Avatar'
import { Button } from '../../../components/ui/Button'
import { Separator } from '../../../components/ui/Separator'

export const FeedStats = ({ userStats, savedJobsCount, suggestedCompanies }) => {
  return (
    <div className="space-y-6 sticky top-6">
      {/* User Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Tu Actividad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Aplicaciones enviadas</span>
            <span className="text-lg font-bold text-primary">{userStats.applicationsSubmitted}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Trabajos guardados</span>
            <span className="text-lg font-bold text-primary">{savedJobsCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Perfil visto</span>
            <span className="text-lg font-bold text-primary">{userStats.profileViews}</span>
          </div>

          <Separator />

          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link to="/perfil">Ver mi perfil</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Suggested Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Sugeridas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedCompanies.map((company) => (
            <div key={company.name} className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback>{company.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{company.name}</p>
                <p className="text-xs text-muted-foreground">{company.jobs} trabajos activos</p>
              </div>
              <Button variant="ghost" size="sm">
                Seguir
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
