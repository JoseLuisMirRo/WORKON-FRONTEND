import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { useMyJobsController } from '../controllers/useMyJobsController'
import { MyJobCard } from './MyJobCard'
import { JobStats } from './JobStats'
import { JobDetailsModal } from './JobDetailsModal'

export const MyJobsPage = () => {
  const {
    jobs,
    stats,
    loading,
    filter,
    changeFilter,
    toggleDeliverable,
    milestoneFiles,
    loadMilestoneFiles,
    onUploadDeliverables,
  } = useMyJobsController()

  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const filters = [
    { value: 'all', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_revision', label: 'En Revisión' },
    { value: 'liberado', label: 'Liberados' },
    { value: 'rechazado', label: 'Rechazados' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  console.log(jobs);
  

  return (
    <div className="bg-background">

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
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      <JobDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
        milestoneFiles={milestoneFiles}
        onLoadMilestoneFiles={loadMilestoneFiles}
        onUploadDeliverables={onUploadDeliverables}
      />
    </div>
  )
}

