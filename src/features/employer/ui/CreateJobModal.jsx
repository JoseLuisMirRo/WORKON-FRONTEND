import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Card, CardContent } from '../../../components/ui/Card'
import { CheckCircle2, AlertCircle, Wallet, Calendar, Plus, X, FileText } from '../../../components/ui/Icons'

export function CreateJobModal({ isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Desarrollo',
    budget: 1000,
    urgency: 'media',
    deadline: '',
    skills: [],
    deliverables: []
  })

  const [currentSkill, setCurrentSkill] = useState('')
  const [currentDeliverable, setCurrentDeliverable] = useState({
    title: '',
    description: '',
    deadline: ''
  })

  const categories = ['Desarrollo', 'Diseño', 'Marketing', 'Contenido', 'Otro']
  const urgencyLevels = [
    { value: 'baja', label: 'Baja', icon: '📅', color: 'secondary' },
    { value: 'media', label: 'Media', icon: '⚡', color: 'warning' },
    { value: 'alta', label: 'Alta', icon: '🔥', color: 'destructive' }
  ]

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.deadline) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    onConfirm(formData)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'Desarrollo',
      budget: 1000,
      urgency: 'media',
      deadline: '',
      skills: [],
      deliverables: []
    })
    setCurrentDeliverable({ title: '', description: '', deadline: '' })
  }

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      })
      setCurrentSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleAddDeliverable = () => {
    if (currentDeliverable.title.trim()) {
      setFormData({
        ...formData,
        deliverables: [...formData.deliverables, {
          ...currentDeliverable,
          id: Date.now()
        }]
      })
      setCurrentDeliverable({ title: '', description: '', deadline: '' })
    }
  }

  const handleRemoveDeliverable = (deliverableId) => {
    setFormData({
      ...formData,
      deliverables: formData.deliverables.filter(d => d.id !== deliverableId)
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Publicar Nuevo Trabajo"
      description="Crea una oferta de trabajo para encontrar al freelancer perfecto"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="gap-2"
            disabled={!formData.title || !formData.description || !formData.deadline}
          >
            <CheckCircle2 className="h-4 w-4" size={16} />
            Publicar Trabajo
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Alerta informativa */}
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <p className="text-sm font-medium">Atrae a los mejores freelancers</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Describe claramente el proyecto, incluye las habilidades necesarias y ofrece un presupuesto competitivo para recibir propuestas de calidad.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Título del trabajo */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Título del Trabajo <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="ej: Desarrollador Full Stack para App de Finanzas"
            className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Categoría y Urgencia */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Urgencia</label>
            <div className="flex gap-2">
              {urgencyLevels.map(level => (
                <Button
                  key={level.value}
                  type="button"
                  variant={formData.urgency === level.value ? level.color : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, urgency: level.value })}
                  className="flex-1"
                >
                  {level.icon} {level.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Descripción Detallada <span className="text-destructive">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe los detalles del proyecto, objetivos, entregables esperados y cualquier requisito específico..."
            rows="6"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
          />
          <p className="text-xs text-muted-foreground">
            {formData.description.length}/2000 caracteres
          </p>
        </div>

        {/* Habilidades requeridas */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Habilidades Requeridas</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Agrega habilidades (presiona Enter)"
              className="flex-1 px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <Button type="button" onClick={handleAddSkill} variant="outline">
              Agregar
            </Button>
          </div>
          
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20 transition-colors"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  {skill} ✕
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Entregables */}
        <div className="space-y-4 p-4 border border-accent/20 rounded-xl bg-accent/5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" size={20} />
            <label className="text-sm font-medium">Entregables del Proyecto</label>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            Define los entregables específicos que esperas del freelancer
          </p>

          {/* Formulario para agregar entregable */}
          <div className="space-y-3">
            <input
              type="text"
              value={currentDeliverable.title}
              onChange={(e) => setCurrentDeliverable({ ...currentDeliverable, title: e.target.value })}
              placeholder="Título del entregable (ej: Diseño de la interfaz)"
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            
            <textarea
              value={currentDeliverable.description}
              onChange={(e) => setCurrentDeliverable({ ...currentDeliverable, description: e.target.value })}
              placeholder="Descripción del entregable (opcional)"
              rows="2"
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
            />

            <div className="flex gap-2">
              <input
                type="date"
                value={currentDeliverable.deadline}
                onChange={(e) => setCurrentDeliverable({ ...currentDeliverable, deadline: e.target.value })}
                placeholder="Fecha de entrega (opcional)"
                className="flex-1 px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                min={new Date().toISOString().split('T')[0]}
              />
              <Button 
                type="button" 
                onClick={handleAddDeliverable}
                disabled={!currentDeliverable.title.trim()}
                className="gap-2"
              >
                <Plus className="h-4 w-4" size={16} />
                Agregar Entregable
              </Button>
            </div>
          </div>

          {/* Lista de entregables agregados */}
          {formData.deliverables.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-accent/20">
              <p className="text-xs font-medium text-muted-foreground">
                Entregables agregados ({formData.deliverables.length})
              </p>
              {formData.deliverables.map((deliverable) => (
                <Card key={deliverable.id} className="border-secondary/30">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" size={16} />
                          <h5 className="font-medium text-sm">{deliverable.title}</h5>
                        </div>
                        {deliverable.description && (
                          <p className="text-xs text-muted-foreground ml-6">
                            {deliverable.description}
                          </p>
                        )}
                        {deliverable.deadline && (
                          <div className="flex items-center gap-1 ml-6">
                            <Calendar className="h-3 w-3 text-muted-foreground" size={12} />
                            <p className="text-xs text-muted-foreground">
                              Entrega: {new Date(deliverable.deadline).toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDeliverable(deliverable.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Presupuesto y Fecha límite */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4 text-accent" size={16} />
              Presupuesto (USDC)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              min="100"
              step="100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" size={16} />
              Fecha Límite <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Resumen */}
        {formData.title && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-2">
              <h4 className="text-sm font-semibold">Vista Previa</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Título:</span> <span className="font-medium">{formData.title}</span></p>
                <p><span className="text-muted-foreground">Presupuesto:</span> <span className="font-medium">${formData.budget.toLocaleString()} USDC</span></p>
                <p><span className="text-muted-foreground">Categoría:</span> <span className="font-medium">{formData.category}</span></p>
                {formData.skills.length > 0 && (
                  <p><span className="text-muted-foreground">Skills:</span> <span className="font-medium">{formData.skills.join(', ')}</span></p>
                )}
                {formData.deliverables.length > 0 && (
                  <p><span className="text-muted-foreground">Entregables:</span> <span className="font-medium">{formData.deliverables.length} definidos</span></p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Modal>
  )
}

