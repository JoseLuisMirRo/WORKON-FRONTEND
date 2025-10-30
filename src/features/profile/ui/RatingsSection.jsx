import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Button } from '../../../components/ui/Button'
import { 
  Star, ThumbsUp, MessageSquare, Award, TrendingUp,
  CheckCircle2, Calendar, Briefcase
} from '../../../components/ui/Icons'

export const RatingsSection = ({ profile }) => {
  const [showAllReviews, setShowAllReviews] = useState(false)

  // Mock de reseñas de empleadores
  const reviews = [
    {
      id: 1,
      employer: {
        name: 'María González',
        company: 'TechCorp',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      rating: 5,
      date: '2024-10-15',
      project: 'Desarrollo de DApp para NFT Marketplace',
      comment: 'Excelente trabajo, muy profesional y cumplió con todos los plazos. Su conocimiento en blockchain es sobresaliente. Definitivamente trabajaré con él nuevamente.',
      skills: {
        communication: 5,
        quality: 5,
        expertise: 5,
        professionalism: 5,
        deadline: 5
      },
      helpful: 12
    },
    {
      id: 2,
      employer: {
        name: 'Carlos Rodríguez',
        company: 'StartupXYZ',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      rating: 5,
      date: '2024-09-28',
      project: 'Integración de Smart Contracts en Stellar',
      comment: 'Superó mis expectativas. No solo entregó el proyecto a tiempo, sino que también sugirió mejoras que agregaron mucho valor. Altamente recomendado.',
      skills: {
        communication: 5,
        quality: 5,
        expertise: 5,
        professionalism: 5,
        deadline: 4
      },
      helpful: 8
    },
    {
      id: 3,
      employer: {
        name: 'Ana Martínez',
        company: 'CryptoFinance',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      rating: 4,
      date: '2024-09-10',
      project: 'Desarrollo de Dashboard Analytics',
      comment: 'Muy buen trabajo en general. La comunicación fue excelente y el resultado final fue muy bueno. Solo hubo algunos pequeños ajustes al final pero se resolvieron rápidamente.',
      skills: {
        communication: 5,
        quality: 4,
        expertise: 4,
        professionalism: 5,
        deadline: 4
      },
      helpful: 5
    },
    {
      id: 4,
      employer: {
        name: 'Jorge López',
        company: 'BlockchainLabs',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      rating: 5,
      date: '2024-08-22',
      project: 'Auditoría de Contratos Inteligentes',
      comment: 'Profesional excepcional. Identificó varios problemas de seguridad que nosotros no habíamos visto. Su expertise en Stellar es notable.',
      skills: {
        communication: 4,
        quality: 5,
        expertise: 5,
        professionalism: 5,
        deadline: 5
      },
      helpful: 15
    }
  ]

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  // Calcular promedios de habilidades
  const skillAverages = {
    communication: (reviews.reduce((sum, r) => sum + r.skills.communication, 0) / reviews.length).toFixed(1),
    quality: (reviews.reduce((sum, r) => sum + r.skills.quality, 0) / reviews.length).toFixed(1),
    expertise: (reviews.reduce((sum, r) => sum + r.skills.expertise, 0) / reviews.length).toFixed(1),
    professionalism: (reviews.reduce((sum, r) => sum + r.skills.professionalism, 0) / reviews.length).toFixed(1),
    deadline: (reviews.reduce((sum, r) => sum + r.skills.deadline, 0) / reviews.length).toFixed(1)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('es-ES', options)
  }

  const SkillBar = ({ label, value }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}/5</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
            <Star className="h-5 w-5 text-white fill-white" size={20} />
          </div>
          <div>
            <CardTitle className="text-lg">Calificaciones</CardTitle>
            <CardDescription>Opiniones de empleadores</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Overview - From Real DB */}
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" size={32} />
            <span className="text-4xl font-bold">{profile.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-5 w-5 ${i < Math.floor(profile.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
                size={20}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {reviews.length > 0 ? `Basado en ${reviews.length} reseñas` : 'Sin reseñas aún'}
          </p>
        </div>

        {/* Skill Ratings */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" size={20} />
            Evaluación por Categorías
          </h4>
          <SkillBar label="Comunicación" value={skillAverages.communication} />
          <SkillBar label="Calidad del Trabajo" value={skillAverages.quality} />
          <SkillBar label="Expertise Técnico" value={skillAverages.expertise} />
          <SkillBar label="Profesionalismo" value={skillAverages.professionalism} />
          <SkillBar label="Cumplimiento de Plazos" value={skillAverages.deadline} />
        </div>

        {/* Reviews List */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-accent" size={20} />
            Reseñas de Clientes ({reviews.length})
          </h4>

          {displayedReviews.map((review) => (
            <div key={review.id} className="p-4 rounded-xl border border-border/50 bg-card/50 space-y-3">
              {/* Reviewer Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.employer.avatar} alt={review.employer.name} />
                    <AvatarFallback>{review.employer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.employer.name}</p>
                    <p className="text-sm text-muted-foreground">{review.employer.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
                      size={16}
                    />
                  ))}
                </div>
              </div>

              {/* Project Info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Briefcase className="h-3 w-3" size={12} />
                <span>{review.project}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" size={12} />
                <span>{formatDate(review.date)}</span>
              </div>

              {/* Comment */}
              <p className="text-sm leading-relaxed">{review.comment}</p>

              {/* Mini Skill Ratings */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="text-xs">
                  Comunicación: {review.skills.communication}/5
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Calidad: {review.skills.quality}/5
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Expertise: {review.skills.expertise}/5
                </Badge>
              </div>

              {/* Helpful */}
              <div className="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
                <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs gap-1 hover:text-primary">
                  <ThumbsUp className="h-3 w-3" size={12} />
                  Útil ({review.helpful})
                </Button>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" size={12} />
                  Verificado
                </Badge>
              </div>
            </div>
          ))}

          {reviews.length > 3 && !showAllReviews && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAllReviews(true)}
            >
              Ver todas las reseñas ({reviews.length})
            </Button>
          )}

          {showAllReviews && reviews.length > 3 && (
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setShowAllReviews(false)}
            >
              Mostrar menos
            </Button>
          )}
        </div>

        {/* Stats Summary - From Real DB */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <div className="text-center p-3 rounded-xl bg-muted/30">
            <p className="text-2xl font-bold text-green-400">
              {profile.rating ? `${(profile.rating * 20).toFixed(0)}%` : '0%'}
            </p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/30">
            <p className="text-2xl font-bold text-primary">{profile.work_history?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Proyectos Completados</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

