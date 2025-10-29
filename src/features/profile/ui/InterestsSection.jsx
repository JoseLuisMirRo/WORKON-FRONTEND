import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { 
  Target, Heart, Code, Palette, Rocket, Globe, 
  DollarSign, Clock, Users, Zap, Edit
} from '../../../components/ui/Icons'

export const InterestsSection = ({ profile, onEdit }) => {
  // Intereses y preferencias de trabajo del freelancer
  const workInterests = profile.workInterests || {
    categories: ['Desarrollo Web', 'Blockchain', 'Smart Contracts', 'DApps'],
    projectTypes: ['Proyecto Completo', 'Consultoría', 'Soporte Técnico'],
    workArrangement: ['Remoto', 'Tiempo Completo', 'Tiempo Parcial'],
    preferredIndustries: ['Fintech', 'Tecnología', 'Startups', 'Criptomonedas'],
    projectSize: 'Mediano a Grande',
    budgetRange: '$5,000 - $20,000',
    availability: '40 hrs/semana',
    commitment: 'Largo plazo preferido'
  }

  const categoryIcons = {
    'Desarrollo Web': Code,
    'Blockchain': Zap,
    'Smart Contracts': Code,
    'DApps': Rocket,
    'UI/UX Design': Palette,
    'Consultoría': Users
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Target className="h-5 w-5 text-white" size={20} />
            </div>
            <div>
              <CardTitle>Intereses y Preferencias de Trabajo</CardTitle>
              <CardDescription>Proyectos y áreas de especialización</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" size={16} />
            Editar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categorías de Interés */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-accent" size={20} />
            <h4 className="font-semibold">Áreas de Especialización</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {workInterests.categories.map((category, index) => {
              const Icon = categoryIcons[category] || Code
              return (
                <Badge 
                  key={index} 
                  variant="default" 
                  className="text-sm px-3 py-1.5 bg-primary/10 border-primary/30 hover:bg-primary/20 transition-colors"
                >
                  <Icon className="h-4 w-4 mr-1" size={16} />
                  {category}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Tipos de Proyecto */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="h-5 w-5 text-accent" size={20} />
            <h4 className="font-semibold">Tipos de Proyecto Preferidos</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {workInterests.projectTypes.map((type, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-sm px-3 py-1.5"
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Modalidad de Trabajo */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-accent" size={20} />
            <h4 className="font-semibold">Modalidad de Trabajo</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {workInterests.workArrangement.map((arrangement, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-sm px-3 py-1.5"
              >
                {arrangement}
              </Badge>
            ))}
          </div>
        </div>

        {/* Industrias Preferidas */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-accent" size={20} />
            <h4 className="font-semibold">Industrias de Interés</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {workInterests.preferredIndustries.map((industry, index) => (
              <Badge 
                key={index} 
                variant="default" 
                className="text-sm px-3 py-1.5 bg-accent/10 border-accent/30 hover:bg-accent/20 transition-colors"
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>

        {/* Detalles de Compromiso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-5 w-5 text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rango de Presupuesto</p>
              <p className="font-semibold">{workInterests.budgetRange}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-accent" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disponibilidad</p>
              <p className="font-semibold">{workInterests.availability}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tamaño de Proyecto</p>
              <p className="font-semibold">{workInterests.projectSize}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-accent" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Compromiso Preferido</p>
              <p className="font-semibold">{workInterests.commitment}</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex items-center justify-center p-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
          <div className="text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" size={32} />
            <p className="text-sm text-muted-foreground mb-3">
              Mantén tus preferencias actualizadas para recibir mejores oportunidades
            </p>
            <Button onClick={onEdit} variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" size={16} />
              Actualizar Preferencias
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

