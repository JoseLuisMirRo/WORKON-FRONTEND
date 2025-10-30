import { Card, CardHeader, CardContent } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Calendar, Wallet, MessageCircle, Clock } from '../../../components/ui/Icons'

export function MyJobCard({ job, onViewDetails }) {
  const getStatusColor = (status) => {
    const colors = {
      'pendiente': 'secondary',
      'en_revision': 'warning',
      'liberado': 'success',
      'rechazado': 'destructive',
      'seleccionado': 'accent',
      'postulado': 'primary',
      // Legacy statuses for backward compatibility
      'en-progreso': 'default',
      'completado': 'success',
      'revision': 'warning',
      'cancelado': 'destructive'
    }
    return colors[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pendiente': '🚀 Pendiente',
      'en_revision': '👀 En Revisión',
      'liberado': '✅ Liberado',
      'rechazado': '❌ Rechazado',
      // Legacy statuses for backward compatibility
      'en-progreso': '🚀 En Progreso',
      'completado': '✅ Completado',
      'revision': '👀 En Revisión',
      'cancelado': '❌ Cancelado'
    }
    return labels[status] || status
  }

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-gradient-to-r from-accent to-accent/80'
    if (progress >= 50) return 'bg-gradient-to-r from-primary to-primary/80'
    if (progress >= 25) return 'bg-gradient-to-r from-warning to-warning/80'
    return 'bg-gradient-to-r from-muted to-muted/80'
  }

  return (
    <Card hover className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Badge variant={getStatusColor(job.status)} className="font-medium">
              {getStatusLabel(job.status)}
            </Badge>
            <h3 className="text-xl font-semibold leading-tight group-hover:text-accent transition-colors">
              {job.title}
            </h3>
          </div>
          <Avatar className="h-12 w-12 ring-2 ring-primary/20 group-hover:ring-accent/50 transition-all">
            <AvatarImage src={job.client.avatar} alt={job.client.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
              {job.client.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cliente */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Cliente:</span>
          <span className="text-sm font-medium">{job.client.name}</span>
          {job.client.verified && (
            <Badge variant="accent" className="text-xs px-1.5 py-0">
              ✓
            </Badge>
          )}
        </div>

        {/* Progreso */}
        {(job.status === 'pendiente' || job.status === 'en_revision' || job.status === 'en-progreso') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-semibold">{job.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor(job.progress)} transition-all duration-500 shadow-lg`}
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" size={14} />
              <span>Inicio</span>
            </div>
            <p className="text-sm font-medium">{job.startDate}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" size={14} />
              <span>{(job.status === 'liberado' || job.status === 'completado') ? 'Finalizado' : 'Entrega'}</span>
            </div>
            <p className="text-sm font-medium">{job.deadline}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-accent" size={20} />
            <span className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              ${job.amount.toLocaleString()} USDC
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-accent/50 hover:border-accent hover:text-accent"
            >
              <MessageCircle className="h-4 w-4" size={16} />
            </Button>
            <Button 
              size="sm" 
              className="shadow-lg"
              onClick={() => onViewDetails && onViewDetails(job)}
            >
              Ver detalles
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
