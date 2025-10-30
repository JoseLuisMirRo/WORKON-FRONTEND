import { Card, CardHeader, CardContent } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Users, Calendar, Wallet, Eye, MoreVertical } from '../../../components/ui/Icons'

export function EmployerJobCard({ job, onUpdate, onDelete, onDetails }) {
  const getStatusColor = (status) => {
    const colors = {
      activo: 'success',
      cerrado: 'secondary',
      completado: 'default',
      cancelado: 'destructive'
    }
    return colors[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      activo: '🟢 Activo',
      cerrado: '🔒 Cerrado',
      completado: '✅ Completado',
      cancelado: '❌ Cancelado'
    }
    return labels[status] || status
  }

  const getUrgencyColor = (urgency) => {
    const colors = {
      alta: 'destructive',
      media: 'warning',
      baja: 'secondary'
    }
    return colors[urgency] || 'default'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <Card hover className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getStatusColor(job.status)} className="font-medium">
                {getStatusLabel(job.status)}
              </Badge>
              <Badge variant={getUrgencyColor(job.urgency)} className="text-xs">
                {job.urgency === 'alta' ? '🔥' : job.urgency === 'media' ? '⚡' : '📅'} {job.urgency?.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {job.category}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold leading-tight group-hover:text-accent transition-colors">
              {job.title}
            </h3>
          </div>

          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" size={20} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descripción */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-xs bg-secondary/30 border border-secondary/50"
              >
                {skill}
              </Badge>
            ))}
            {job.skills.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{job.skills.length - 5}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" size={16} />
            <div>
              <p className="text-xs text-muted-foreground">Aplicaciones</p>
              <p className="text-sm font-semibold">{job.applicants || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-accent" size={16} />
            <div>
              <p className="text-xs text-muted-foreground">Vistas</p>
              <p className="text-sm font-semibold">{job.views || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-accent" size={16} />
            <div>
              <p className="text-xs text-muted-foreground">Presupuesto</p>
              <p className="text-sm font-semibold">${job.budget?.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" size={16} />
            <div>
              <p className="text-xs text-muted-foreground">Fecha límite</p>
              <p className="text-sm font-semibold">{formatDate(job.deadline)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            Publicado el {formatDate(job.createdAt)}
          </span>

          <div className="flex items-center gap-2">
            {onDetails && (
              <Button size="sm" variant="default" onClick={() => onDetails(job)}>
                Ver detalles
              </Button>
            )}
            {job.applicants > 0 && (
              <Button size="sm" variant="accent" className="gap-2">
                <Users className="h-4 w-4" size={16} />
                Ver Aplicaciones ({job.applicants})
              </Button>
            )}
            
            {job.status === 'activo' && (
              <>
                <Button size="sm" variant="outline">
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    if (confirm('¿Estás seguro de cerrar este trabajo?')) {
                      onUpdate(job.id, { status: 'cerrado' })
                    }
                  }}
                >
                  Cerrar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

