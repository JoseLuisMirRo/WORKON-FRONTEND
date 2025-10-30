import { useState } from 'react'
import { useEmployerController } from '../controllers/useEmployerController'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { TrendingUp, Briefcase, Users, DollarSign, Clock, CheckCircle2 } from '../../../components/ui/Icons'
import { CreateJobModal } from './CreateJobModal'
import { EmployerJobCard } from './EmployerJobCard'
import { EmployerJobDetailsModal } from './EmployerJobDetailsModal'

export const EmployerDashboard = () => {
  const {
    profile,
    jobs,
    stats,
    loading,
    filter,
    createJob,
    updateJob,
    deleteJob,
    changeFilter
  } = useEmployerController()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData)
      setIsCreateModalOpen(false)
      alert('¡Trabajo publicado exitosamente!')
    } catch (error) {
      alert('Error al crear el trabajo')
    }
  }

  const filters = [
    { value: 'all', label: 'Todos' },
    { value: 'activo', label: 'Activos' },
    { value: 'cerrado', label: 'Cerrados' },
    { value: 'completado', label: 'Completados' }
  ]

  return (
    <div className="bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header con perfil */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 ring-4 ring-primary/20">
              <AvatarImage src={profile?.avatar} alt={profile?.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold">
                {profile?.initials || '??'}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{profile?.name || 'Empresa'}</h1>
                {/* Verified badge removed - not in DB */}
              </div>
              <p className="text-muted-foreground">
                {profile?.industry || 'Industria'} 
                {profile?.location && profile.location !== 'No especificado' && ` • ${profile.location}`}
              </p>
              <div className="flex items-center gap-4 text-sm">
                {profile?.rating > 0 && (
                  <>
                    <span className="flex items-center gap-1">
                      ⭐ {profile.rating.toFixed(1)} {profile.reviewsCount > 0 && `(${profile.reviewsCount} reseñas)`}
                    </span>
                    <span>•</span>
                  </>
                )}
                <span>{profile?.jobsPosted || 0} trabajos publicados</span>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="gap-2 shadow-lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Briefcase className="h-5 w-5" size={20} />
            Publicar Nuevo Trabajo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card hover className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Trabajos Activos
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stats?.activeJobs || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                  <TrendingUp className="h-6 w-6 text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Aplicaciones Totales
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    {stats?.totalApplicants || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/30">
                  <Users className="h-6 w-6 text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Completados
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    {stats?.completedJobs || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg shadow-success/30">
                  <CheckCircle2 className="h-6 w-6 text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Invertido
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    ${((stats?.totalSpent || 0) / 1000).toFixed(1)}k
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg shadow-warning/30">
                  <DollarSign className="h-6 w-6 text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Mis Trabajos Publicados</h2>
          <div className="flex gap-2">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? 'default' : 'outline'}
                onClick={() => changeFilter(f.value)}
                size="sm"
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de trabajos */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" size={64} />
                <h3 className="text-lg font-semibold mb-2">No hay trabajos publicados</h3>
                <p className="text-muted-foreground mb-4">
                  Comienza publicando tu primer trabajo para encontrar freelancers talentosos.
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  Publicar Primer Trabajo
                </Button>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <EmployerJobCard
                key={job.id}
                job={job}
                onUpdate={updateJob}
                onDelete={deleteJob}
                onDetails={(j) => { setSelectedJob(j); setIsDetailsOpen(true); }}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal para crear trabajo */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreateJob}
      />

      {/* Modal de detalles del trabajo */}
      <EmployerJobDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedJob(null); }}
        job={selectedJob}
      />
    </div>
  )
}

