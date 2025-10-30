import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Modal } from '../../../components/ui/Modal'
import { listMilestones, setMilestoneStatus } from '../../my-jobs/services/myJobsService'

export function EmployerJobDetailsModal({ isOpen, onClose, job }) {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const proposalId = job?.proposalId || job?.id

  useEffect(() => {
    if (!isOpen || !proposalId) return
    let mounted = true
    setLoading(true)
    listMilestones(proposalId)
      .then((res) => {
        if (!mounted) return
        if (res?.ok) setMilestones(res.data || [])
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [isOpen, proposalId])

  const getStatusBadge = (status) => {
    const map = {
      pendiente: 'secondary',
      en_revision: 'warning',
      liberado: 'success',
      rechazado: 'destructive'
    }
    return map[status] || 'default'
  }

  const handleRelease = async (milestone) => {
    try {
      setUpdatingId(milestone.id)
      const res = await setMilestoneStatus(milestone.id, 'liberado')
      if (res?.ok) {
        setMilestones((prev) => prev.map((m) => (m.id === milestone.id ? { ...m, status: 'liberado' } : m)))
      } else {
        alert(res?.error?.message || 'No se pudo liberar el hito')
      }
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del trabajo" size="default">

        {!job ? (
          <div className="p-6 text-sm text-muted-foreground">No hay trabajo seleccionado.</div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{job.description || 'Sin descripción'}</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Entregables</h3>
              {loading ? (
                <div className="p-4 text-sm text-muted-foreground">Cargando entregables…</div>
              ) : milestones.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No hay entregables.</div>
              ) : (
                <div className="space-y-3">
                  {milestones.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-md border border-border/60 p-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{m.title || 'Entregable'}</span>
                          <Badge variant={getStatusBadge(m.status)} className="text-xs">{m.status}</Badge>
                        </div>
                        {m.amount != null && (
                          <div className="text-xs text-muted-foreground">Monto: ${Number(m.amount).toLocaleString()}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          disabled={m.status === 'liberado' || updatingId === m.id}
                          onClick={() => handleRelease(m)}
                        >
                          {updatingId === m.id ? 'Liberando…' : m.status === 'liberado' ? 'Liberado' : 'Liberar pago'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
    </Modal>
  )
}


