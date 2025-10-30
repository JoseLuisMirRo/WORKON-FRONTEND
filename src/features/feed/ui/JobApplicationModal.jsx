import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Wallet, Calendar, Clock, Star, AlertCircle, FileText, CheckCircle2 } from '../../../components/ui/Icons'
import { Card, CardContent } from '../../../components/ui/Card'
import { createProposalApplicant } from '../../employer/services/employerService'

export function JobApplicationModal({ isOpen, onClose, job, onConfirm }) {
  const [coverLetter, setCoverLetter] = useState('')
  const [proposedBudget, setProposedBudget] = useState(job?.budgetRaw || 0)
  const [estimatedDays, setEstimatedDays] = useState(14)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!job) return null

  const handleSubmit = async () => {
    // Validar carta de presentación
    if (coverLetter.trim().length < 50) {
      setError('La carta de presentación debe tener al menos 50 caracteres')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      // Persistir postulación en Supabase
      const freelancerId = localStorage.getItem('userId')
      if (!freelancerId) {
        throw new Error('No se encontró tu sesión. Inicia sesión para postularte.')
      }

      console.log("sending");
      const { application, alreadyApplied } = await createProposalApplicant({
        proposal_id: job.id,
        freelancer_id: freelancerId,
        cover_letter: coverLetter.trim(),
        time_estimation: estimatedDays,
        propossed_budget: proposedBudget,
        status: 'postulado',
      })

      console.log("application", application);
      // Si ya había aplicado, mostrar error y NO resetear campos
      console.log("alreadyApplied", alreadyApplied);
      if (alreadyApplied) {
        setError('Ya has aplicado a esta propuesta anteriormente')
        setSuccess('')
        return
      }

      // Notificar al padre (mantiene compatibilidad) solo en éxito real
      await onConfirm?.({
        jobId: job.id,
        coverLetter: coverLetter.trim(),
        proposedBudget,
        estimatedDays,
        application,
      })

      // Éxito: resetear y mostrar mensaje
      setCoverLetter('')
      setProposedBudget(job?.budgetRaw || 0)
      setEstimatedDays(14)
      setError('')
      setSuccess('¡Tu postulación fue enviada correctamente!')

      // Cerrar luego de un breve delay
      setTimeout(() => {
        setSuccess('')
        setError('')
        onClose()
      }, 3000)
    } catch (err) {
      setError(err.message || 'Error al enviar la aplicación')
      setSuccess('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Aplicar a Trabajo"
      description="Revisa los detalles y envía tu propuesta"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!coverLetter.trim() || isSubmitting || coverLetter.trim().length < 50}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" size={16} />
            {isSubmitting ? 'Enviando...' : 'Enviar Aplicación'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mensajes del servidor */}
        {success && (
          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" size={16} />
              <p className="text-sm text-success font-medium">{success}</p>
            </CardContent>
          </Card>
        )}
        {/* Mensaje de error */}
        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" size={16} />
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Detalles del trabajo */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 space-y-4">
            {/* Header del trabajo */}
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                <AvatarImage src={job.client?.avatar} alt={job.client?.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                  {getInitials(job.client?.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold leading-tight">{job.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{job.client?.name}</span>
                      {job.client?.verified && (
                        <Badge variant="accent" className="text-xs px-1.5 py-0">
                          ✓
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" size={14} />
                        <span className="text-sm font-medium">{job.client?.rating}</span>
                        <span className="text-xs text-muted-foreground">({job.client?.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{job.category}</Badge>
                  <Badge 
                    variant={job.urgency === 'alta' ? 'destructive' : job.urgency === 'media' ? 'warning' : 'secondary'}
                    className="text-xs"
                  >
                    {job.urgency === 'alta' ? '🔥' : job.urgency === 'media' ? '⚡' : '📅'} {job.urgency?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Descripción del proyecto</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Skills requeridas */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Habilidades requeridas</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-secondary/30 border border-secondary/50"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Info adicional */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-accent" size={16} />
                <div>
                  <p className="text-xs text-muted-foreground">Presupuesto</p>
                  <p className="text-sm font-semibold">{job.budget?.toLocaleString()} USDC</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" size={16} />
                <div>
                  <p className="text-xs text-muted-foreground">Publicado</p>
                  <p className="text-sm font-semibold">Hace {job.postedTime}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerta informativa */}
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <p className="text-sm font-medium">Fondos en Contrato Inteligente</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                El presupuesto se bloqueará en un contrato inteligente y se liberará automáticamente cuando completes el trabajo satisfactoriamente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de propuesta */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" size={16} />
            Tu Propuesta
          </h4>

          {/* Presupuesto propuesto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Presupuesto Propuesto (USDC)
            </label>
            <input
              type="number"
              value={proposedBudget}
              onChange={(e) => setProposedBudget(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              min="0"
              step="100"
            />
            <p className="text-xs text-muted-foreground">
              Presupuesto del cliente: {job.budget?.toLocaleString()} USDC
            </p>
          </div>

          {/* Tiempo estimado */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" size={16} />
              Tiempo Estimado (días)
            </label>
            <input
              type="number"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              min="1"
              max="365"
            />
          </div>

          {/* Carta de presentación */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Carta de Presentación <span className="text-destructive">*</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explica por qué eres el candidato ideal para este proyecto. Menciona tu experiencia relevante y cómo planeas abordar el trabajo..."
              rows="6"
              maxLength="1000"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
            />
            <div className="flex justify-between items-center text-xs">
              <span className={coverLetter.trim().length < 50 ? 'text-destructive' : 'text-muted-foreground'}>
                Mínimo 50 caracteres {coverLetter.trim().length < 50 ? `(faltan ${50 - coverLetter.trim().length})` : '✓'}
              </span>
              <span className="text-muted-foreground">
                {coverLetter.length}/1000 caracteres
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

