import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { X, Save, Plus } from '../../../components/ui/Icons'

export const AddExperienceModal = ({ onClose, onSave, experience = null }) => {
  const [formData, setFormData] = useState(experience || {
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
    skills: []
  })
  const [currentSkill, setCurrentSkill] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!formData.title || !formData.company || !formData.startDate) {
      alert('Por favor completa los campos requeridos')
      return
    }

    try {
      setSaving(true)
      await onSave(formData)
      onClose()
    } catch (error) {
      alert('Error al guardar experiencia')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      })
      setCurrentSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    })
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {experience ? 'Editar Experiencia' : 'Agregar Experiencia Profesional'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Título del Puesto <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Senior Full Stack Developer"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Empresa <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: TechCorp"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ubicación</label>
              <input
                type="text"
                placeholder="Ej: Ciudad de México, México o Remoto"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Fecha de Inicio <span className="text-destructive">*</span>
                </label>
                <input
                  type="month"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Término</label>
                <input
                  type="month"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.currentlyWorking ? '' : formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.currentlyWorking}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="currentlyWorking"
                checked={formData.currentlyWorking}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  currentlyWorking: e.target.checked,
                  endDate: e.target.checked ? 'Presente' : ''
                })}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <label htmlFor="currentlyWorking" className="text-sm">
                Actualmente trabajo aquí
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                rows="4"
                placeholder="Describe tus responsabilidades, logros y proyectos importantes..."
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tecnologías y Habilidades</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: React, Node.js, TypeScript"
                  className="flex-1 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
                <Button onClick={addSkill} type="button" className="gap-2">
                  <Plus className="h-4 w-4" size={16} />
                  Agregar
                </Button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm px-3 py-1.5 cursor-pointer hover:bg-destructive/20"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ✕
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" size={16} />
              {saving ? 'Guardando...' : experience ? 'Guardar Cambios' : 'Agregar Experiencia'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

