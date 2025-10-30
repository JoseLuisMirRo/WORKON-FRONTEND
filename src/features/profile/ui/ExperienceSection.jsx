import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Briefcase, Calendar, MapPin, Edit, Plus, Trash2 } from '../../../components/ui/Icons'
import { AddExperienceModal } from './AddExperienceModal'

export const ExperienceSection = ({ profile, onEdit }) => {
  const [showAddModal, setShowAddModal] = useState(false)

  const formatDate = (dateString) => {
    if (dateString === 'Presente') return 'Presente'
    const [year, month] = dateString.split('-')
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  const calculateDuration = (start, end) => {
    const startDate = new Date(start + '-01')
    const endDate = end === 'Presente' ? new Date() : new Date(end + '-01')
    
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth())
    
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years === 0) return `${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'año' : 'años'}`
    return `${years} ${years === 1 ? 'año' : 'años'} ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" size={20} />
              </div>
              <CardTitle>Experiencia Profesional</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus className="h-4 w-4" size={16} />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Use work_history from DB */}
            {profile.work_history && profile.work_history.length > 0 ? (
              profile.work_history.map((work, index) => (
                <div key={work.id} className="relative">
                  {/* Timeline line */}
                  {index < profile.work_history.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border"></div>
                  )}
                  
                  <div className="flex gap-4 group">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-primary" size={24} />
                      </div>
                      {work.project_status === 'completed' && work.finished_at && (
                        <div className="absolute -top-1 -right-1">
                          <div className="h-3 w-3 rounded-full bg-green-400"></div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{work.title}</h4>
                          {work.project_status && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {work.project_status === 'completed' ? 'Completado' : 
                               work.project_status === 'in_progress' ? 'En progreso' : 
                               work.project_status}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={onEdit}
                        >
                          <Edit className="h-4 w-4" size={16} />
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                        {work.finished_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" size={16} />
                            <span>Finalizado: {new Date(work.finished_at).toLocaleDateString('es-MX', { 
                              year: 'numeric', 
                              month: 'short' 
                            })}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        {work.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" size={48} />
                <p className="text-muted-foreground mb-4">
                  Aún no tienes historial de proyectos completados
                </p>
                <p className="text-xs text-muted-foreground">
                  Los proyectos que completes aparecerán aquí automáticamente
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showAddModal && (
        <AddExperienceModal 
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            console.log('Nueva experiencia:', data)
            setShowAddModal(false)
          }}
        />
      )}
    </>
  )
}

