import { Card, CardContent } from '../../../components/ui/Card'
import { TrendingUp, CheckCircle2, Clock, DollarSign } from '../../../components/ui/Icons'

export function JobStats({ stats }) {
  const statItems = [
    {
      icon: TrendingUp,
      label: 'En Progreso',
      value: stats.inProgress,
      gradient: 'from-primary to-primary/80',
      shadowColor: 'shadow-primary/30'
    },
    {
      icon: CheckCircle2,
      label: 'Completados',
      value: stats.completed,
      gradient: 'from-accent to-accent/80',
      shadowColor: 'shadow-accent/30'
    },
    {
      icon: Clock,
      label: 'En Revisión',
      value: stats.inReview,
      gradient: 'from-warning to-warning/80',
      shadowColor: 'shadow-warning/30'
    },
    {
      icon: DollarSign,
      label: 'Ganado este mes',
      value: `$${stats.monthlyEarnings.toLocaleString()}`,
      gradient: 'from-success to-success/80',
      shadowColor: 'shadow-success/30'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => {
        const Icon = item.icon
        return (
          <Card 
            key={index} 
            hover
            className="animate-slide-up" 
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    {item.value}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg ${item.shadowColor}`}>
                  <Icon className="h-6 w-6 text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
