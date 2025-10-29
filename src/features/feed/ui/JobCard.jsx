import { Card, CardHeader, CardContent } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Wallet, Calendar, Star, Clock } from '../../../components/ui/Icons'

export function JobCard({ job, onApply }) {
  const getBudgetColor = (budget) => {
    if (budget >= 3000) return 'success'
    if (budget >= 1000) return 'accent'
    return 'default'
  }

  const getUrgencyColor = (urgency) => {
    const colors = {
      alta: 'destructive',
      media: 'warning',
      baja: 'secondary'
    }
    return colors[urgency] || 'default'
  }

  const getUrgencyIcon = (urgency) => {
    const icons = {
      alta: '🔥',
      media: '⚡',
      baja: '📅'
    }
    return icons[urgency] || '📋'
  }

  // Valores por defecto seguros
  const safeJob = {
    urgency: job?.urgency || 'media',
    category: job?.category || 'General',
    title: job?.title || 'Sin título',
    description: job?.description || '',
    skills: job?.skills || [],
    budget: job?.budget || 0,
    postedTime: job?.postedTime || 'Recientemente',
    client: {
      name: job?.client?.name || 'Cliente',
      avatar: job?.client?.avatar || '/placeholder.svg',
      verified: job?.client?.verified || false,
      rating: job?.client?.rating || 0,
      reviews: job?.client?.reviews || 0
    }
  }

  return (
    <Card hover className="group animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getUrgencyColor(safeJob.urgency)} className="font-medium">
                {getUrgencyIcon(safeJob.urgency)} {safeJob.urgency.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {safeJob.category}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold leading-tight group-hover:text-accent transition-colors">
              {safeJob.title}
            </h3>
          </div>
          <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-accent/50 transition-all">
            <AvatarImage src={safeJob.client.avatar} alt={safeJob.client.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-bold">
              {safeJob.client.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descripción */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {safeJob.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {safeJob.skills.slice(0, 4).map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-secondary/30 hover:bg-secondary/50 border border-secondary/50"
            >
              {skill}
            </Badge>
          ))}
          {safeJob.skills.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{safeJob.skills.length - 4}
            </Badge>
          )}
        </div>

        {/* Info del cliente */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-sm font-medium">{safeJob.client.name}</span>
          {safeJob.client.verified && (
            <Badge variant="accent" className="text-xs px-1.5 py-0">
              ✓
            </Badge>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" size={14} />
            <span className="text-sm font-medium">{safeJob.client.rating}</span>
            <span className="text-xs text-muted-foreground">({safeJob.client.reviews})</span>
          </div>
        </div>

        {/* Footer con presupuesto y acciones */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-accent" size={16} />
              <span className="text-lg font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                ${safeJob.budget.toLocaleString()} USDC
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" size={12} />
              <span>Publicado hace {safeJob.postedTime}</span>
            </div>
          </div>

          <Button 
            size="sm" 
            className="group/btn shadow-lg"
            onClick={() => onApply && onApply(job)}
          >
            Aplicar
            <svg 
              className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
