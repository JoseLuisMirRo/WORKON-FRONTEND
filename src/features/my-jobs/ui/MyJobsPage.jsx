import { Navbar } from '../../../components/Navbar'
import { Button } from '../../../components/ui/Button'
import { useMyJobsController } from '../controllers/useMyJobsController'
import { MyJobCard } from './MyJobCard'
import { JobStats } from './JobStats'

export const MyJobsPage = () => {
  const {
    jobs,
    stats,
    loading,
    filter,
    changeFilter,
    toggleDeliverable,
  } = useMyJobsController()

  const filters = [
    { value: 'all', label: 'Todos' },
    { value: 'applied', label: 'Aplicados' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completados' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mis Trabajos</h1>
          <p className="text-muted-foreground">
            Gestiona todos tus proyectos y aplicaciones
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <JobStats stats={stats} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
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

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tienes trabajos en esta categoría</p>
            </div>
          ) : (
            jobs.map((job) => (
              <MyJobCard
                key={job.id}
                job={job}
                onToggleDeliverable={toggleDeliverable}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

