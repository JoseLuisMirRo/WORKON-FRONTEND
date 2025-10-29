import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Wallet, Calendar, Clock, MessageCircle, CheckCircle2, FileText, AlertCircle, User } from '../../../components/ui/Icons'
import { Separator } from '../../../components/ui/Separator'

export function JobDetailsModal({ isOpen, onClose, job }) {
  const [activeTab, setActiveTab] = useState('overview') // overview, deliverables, messages

  if (!job) return null

  const getStatusColor = (status) => {
    const colors = {
      'en-progreso': 'default',
      'completado': 'success',
      'revision': 'warning',
      'cancelado': 'destructive'
    }
    return colors[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'en-progreso': '🚀 En Progreso',
      'completado': '✅ Completado',
      'revision': '👀 En Revisión',
      'cancelado': '❌ Cancelado'
    }
    return labels[status] || status
  }

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'from-accent to-accent/80'
    if (progress >= 50) return 'from-primary to-primary/80'
    if (progress >= 25) return 'from-warning to-warning/80'
    return 'from-muted to-muted/80'
  }

  const getInitials = (name) => {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Mock deliverables si no existen
  const deliverables = job.deliverables || [
    { id: 1, name: 'Diseño inicial', completed: true, dueDate: '15 Ene' },
    { id: 2, name: 'Desarrollo backend', completed: true, dueDate: '25 Ene' },
    { id: 3, name: 'Frontend UI', completed: false, dueDate: '5 Feb' },
    { id: 4, name: 'Testing y deploy', completed: false, dueDate: '15 Feb' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={job.title}
      description={`Proyecto con ${job.client?.name}`}
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-border/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('deliverables')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'deliverables'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Entregables
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 relative ${
              activeTab === 'messages'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Mensajes
            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              3
            </Badge>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Estado y progreso */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusColor(job.status)} className="font-medium">
                    {getStatusLabel(job.status)}
                  </Badge>
                  <span className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    ${job.amount?.toLocaleString()} USDC
                  </span>
                </div>

                {job.status === 'en-progreso' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso del proyecto</span>
                      <span className="font-semibold">{job.progress}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getProgressColor(job.progress)} transition-all duration-500 shadow-lg`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info del cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src={job.client?.avatar} alt={job.client?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-lg">
                      {getInitials(job.client?.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold">{job.client?.name}</h4>
                      {job.client?.verified && (
                        <Badge variant="accent" className="text-xs px-1.5 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Cliente desde hace 2 años</p>
                  </div>

                  <Button size="sm" className="gap-2">
                    <MessageCircle className="h-4 w-4" size={16} />
                    Enviar mensaje
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Descripción del proyecto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descripción del proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tecnologías utilizadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-secondary/30 border border-secondary/50"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fechas importantes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fechas importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" size={16} />
                      <span className="text-sm">Fecha de inicio</span>
                    </div>
                    <p className="text-base font-semibold">{job.startDate}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" size={16} />
                      <span className="text-sm">Fecha de entrega</span>
                    </div>
                    <p className="text-base font-semibold">{job.deadline}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Deliverables Tab */}
        {activeTab === 'deliverables' && (
          <div className="space-y-4">
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" size={20} />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Entregables del proyecto</p>
                  <p className="text-xs text-muted-foreground">
                    Completa todos los entregables para finalizar el proyecto y recibir tu pago.
                  </p>
                </div>
              </CardContent>
            </Card>

            {deliverables.map((deliverable, index) => (
              <Card key={deliverable.id} hover className="group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      deliverable.completed 
                        ? 'bg-accent/20 text-accent' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {deliverable.completed ? (
                        <CheckCircle2 className="h-5 w-5" size={20} />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${deliverable.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {deliverable.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fecha límite: {deliverable.dueDate}
                      </p>
                    </div>

                    {!deliverable.completed && (
                      <Button size="sm" variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" size={16} />
                        Subir
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold mb-2">Mensajes del proyecto</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Los mensajes relacionados con este proyecto aparecerán aquí.
                </p>
                <Button className="gap-2">
                  <MessageCircle className="h-4 w-4" size={16} />
                  Ir a mensajes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          
          <div className="flex items-center gap-2">
            {job.status === 'en-progreso' && (
              <>
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" size={16} />
                  Subir entregable
                </Button>
                <Button className="gap-2">
                  <CheckCircle2 className="h-4 w-4" size={16} />
                  Marcar como completo
                </Button>
              </>
            )}
            {job.status === 'revision' && (
              <Button variant="accent" className="gap-2">
                <Clock className="h-4 w-4" size={16} />
                Esperando aprobación
              </Button>
            )}
            {job.status === 'completado' && (
              <Button variant="success" className="gap-2">
                <CheckCircle2 className="h-4 w-4" size={16} />
                Proyecto completado
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

