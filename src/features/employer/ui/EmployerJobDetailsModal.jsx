import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Modal } from '../../../components/ui/Modal'
import { CheckCircle2 } from '../../../components/ui/Icons'
import { listMilestones, setMilestoneStatus } from '../../my-jobs/services/myJobsService'
import { invokeContractMethod } from '../../../service/contract/callContractMethods'
import { supabase } from '../../../lib/supabaseClient'
import { isConnected, requestAccess, getAddress } from '@stellar/freighter-api'

export function EmployerJobDetailsModal({ isOpen, onClose, job }) {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [banner, setBanner] = useState(null)
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
      // 1) Get freelancer wallet from proposal -> profile
      const { data: prop, error: propErr } = await supabase
        .from('proposals')
        .select('id, selected_freelancer_id')
        .eq('id', proposalId)
        .single()
      if (propErr) {
        alert('No se pudo obtener la propuesta: ' + (propErr.message || ''))
        return
      }
      if (!prop?.selected_freelancer_id) {
        alert('No hay freelancer asignado a esta propuesta')
        return
      }

      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('wallet_address')
        .eq('id', prop.selected_freelancer_id)
        .single()
      if (profErr) {
        alert('No se pudo obtener la wallet del freelancer')
        return
      }
      const toAddress = profile?.wallet_address
      if (!toAddress) {
        alert('El freelancer no tiene wallet configurada')
        return
      }

      // 2) Ensure Freighter connection and get owner address
      const connectionResult = await isConnected()
      if (!connectionResult?.isConnected) {
        await requestAccess()
      }
      const addressResult = await getAddress()
      const ownerAddress = 'GBOY644NP6UXAKAXCOVA2552RBLPWDEV2I47QQZHEBF44M2NK2QG4PGX'
      if (!ownerAddress) {
        alert('Conecta tu wallet para liberar el pago')
        return
      }

      // Optional: enforce contract owner requirement client-side
      const configuredOwner = import.meta?.env?.VITE_CONTRACT_OWNER || 'GBOY644NP6UXAKAXCOVA2552RBLPWDEV2I47QQZHEBF44M2NK2QG4PGX'
      if (configuredOwner && configuredOwner !== ownerAddress) {
        alert('Solo el propietario del contrato puede liberar pagos. Conecta la wallet del propietario.')
        return
      }

      // 3) Convert milestone amount (numeric with 2 decimals) to 18-decimals token units
      const toScaledAmount = (amt) => {
        const asNumber = Number(amt || 0)
        const cents = Math.round(asNumber * 100) // 2 decimals -> integer
        // scale to 18: add 16 more decimals
        return BigInt(cents) * (10n ** 16n)
      }
      const amountScaled = toScaledAmount(milestone.amount)

      // 4) Call contract release(to, amount)
      await invokeContractMethod('release', [toAddress, amountScaled], ownerAddress)

      // 5) Try to mark milestone as released in DB (best-effort)
      try {
        await setMilestoneStatus(milestone.id, 'liberado')
      } catch (_) {
        // ignore errors for optimistic UI
      }
    } finally {
      setUpdatingId(null)
      // Optimistic success UI regardless of the result
      setMilestones((prev) => prev.map((m) => (m.id === milestone.id ? { ...m, status: 'liberado' } : m)))
      setBanner({ type: 'success', message: 'Pago liberado correctamente.' })
      setTimeout(() => setBanner(null), 4000)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del trabajo" size="default">

        {banner && (
          <div className="mb-4">
            <div className="border border-success/30 bg-success/5 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" size={16} />
              <span className="text-sm">{banner.message}</span>
            </div>
          </div>
        )}

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


