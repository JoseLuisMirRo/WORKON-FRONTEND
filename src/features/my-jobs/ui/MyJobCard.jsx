import { Card, CardHeader, CardContent } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Button } from '../../../components/ui/Button'
import { Separator } from '../../../components/ui/Separator'
import { Briefcase, Calendar, DollarSign, MessageCircle, CheckCircle2 } from '../../../components/ui/Icons'
import { statusLabels } from '../services/myJobsService'

const statusColors = {
  applied: 'secondary',
  in_progress: 'default',
  completed: 'outline',
  cancelled: 'destructive',
}

export const MyJobCard = ({ job, onToggleDeliverable }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarImage src={job.companyLogo} alt={job.company} />
            <AvatarFallback>{job.company[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <Badge variant={statusColors[job.status]}>
                {statusLabels[job.status]}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{job.description}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Progress bar for in_progress jobs */}
        {job.status === 'in_progress' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso</span>
              <span className="text-sm text-muted-foreground">{job.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all" 
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Deliverables for in_progress jobs */}
        {job.status === 'in_progress' && job.deliverables && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Entregables:</span>
            {job.deliverables.map((deliverable) => (
              <div key={deliverable.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={deliverable.completed}
                  onChange={() => onToggleDeliverable(job.id, deliverable.id, deliverable.completed)}
                  className="rounded border-border"
                />
                <span className={`text-sm ${deliverable.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {deliverable.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Review for completed jobs */}
        {job.status === 'completed' && job.review && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-primary" />
              <span className="text-sm font-medium">Calificación: {job.rating}/5 ⭐</span>
            </div>
            <p className="text-sm text-muted-foreground italic">&quot;{job.review}&quot;</p>
          </div>
        )}

        {/* Job Details */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="h-4 w-4 text-primary" size={16} />
            <span className="font-semibold text-primary">{job.budget}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" size={16} />
            <span>Aplicado: {new Date(job.appliedDate).toLocaleDateString('es')}</span>
          </div>
          {job.deadline && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Briefcase className="h-4 w-4" size={16} />
              <span>Entrega: {new Date(job.deadline).toLocaleDateString('es')}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageCircle className="h-4 w-4" size={16} />
            <span>{job.messages} mensajes</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm">
            <MessageCircle size={16} />
            Ver Mensajes
          </Button>
          <Button size="sm">
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

