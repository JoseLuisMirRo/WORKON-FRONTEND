import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { X, Save, Plus } from '../../../components/ui/Icons'

export const EditProfileModal = ({ section, profile, onClose, onSave }) => {
  const getInitialData = () => {
    switch(section) {
      case 'interests':
        return profile.workInterests || {}
      case 'basic':
        return {
          full_name: profile.full_name || '',
          bio: profile.bio || '',
          email: profile.email || '',
          wallet_address: profile.wallet_address || '',
          portfolio_summary: profile.portfolio_summary || ''
        }
      case 'skills':
        // Skills not in DB yet - return empty
        return { 
          skills: [],
          currentSkill: { name: '', level: 50 }
        }
      default:
        return {}
    }
  }

  const [formData, setFormData] = useState(getInitialData())
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Preparar los datos según la sección
      let dataToSave = {}
      if (section === 'skills') {
        dataToSave = { skills: formData.skills }
      } else {
        dataToSave = formData
      }
      
      await onSave(dataToSave)
      onClose()
    } catch (error) {
      alert('Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  // Funciones para manejar skills
  const addSkill = () => {
    const { currentSkill } = formData
    if (currentSkill.name.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { name: currentSkill.name, level: currentSkill.level }],
        currentSkill: { name: '', level: 50 }
      })
    }
  }

  const removeSkill = (skillName) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s.name !== skillName)
    })
  }

  const renderBasicForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre Completo *</label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Juan Pérez García"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Biografía *</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows="4"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Cuéntanos sobre ti, tu experiencia y qué te apasiona..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Resumen de Portfolio</label>
        <textarea
          value={formData.portfolio_summary}
          onChange={(e) => setFormData({ ...formData, portfolio_summary: e.target.value })}
          rows="3"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Breve descripción de tu portafolio y especialidades..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Wallet Address (Stellar)</label>
        <input
          type="text"
          value={formData.wallet_address}
          onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          placeholder="GABC..."
        />
        <p className="text-xs text-muted-foreground">
          Dirección de tu wallet en Stellar para recibir pagos
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email (solo lectura)</label>
        <input
          type="email"
          value={formData.email}
          disabled
          className="w-full px-4 py-3 rounded-xl border border-input bg-muted text-muted-foreground cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">
          El email no se puede cambiar desde aquí
        </p>
      </div>
    </div>
  )

  const renderSkillsForm = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="text-sm font-medium">Agregar Habilidad</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.currentSkill?.name || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              currentSkill: { ...formData.currentSkill, name: e.target.value }
            })}
            placeholder="Nombre de la habilidad (ej: React)"
            className="flex-1 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="w-32">
            <input
              type="number"
              value={formData.currentSkill?.level || 50}
              onChange={(e) => setFormData({ 
                ...formData, 
                currentSkill: { ...formData.currentSkill, level: Number(e.target.value) }
              })}
              min="0"
              max="100"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nivel %"
            />
          </div>
          <Button onClick={addSkill} className="gap-2">
            <Plus className="h-4 w-4" size={16} />
            Agregar
          </Button>
        </div>
      </div>

      {formData.skills && formData.skills.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Habilidades actuales</label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-primary"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(skill.name)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderInterestsForm = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium">Áreas de Especialización</label>
        <input
          type="text"
          placeholder="Ej: Desarrollo Web, Blockchain, Smart Contracts (separados por coma)"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.categories?.join(', ') || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Tipos de Proyecto Preferidos</label>
        <input
          type="text"
          placeholder="Ej: Proyecto Completo, Consultoría, Soporte (separados por coma)"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.projectTypes?.join(', ') || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            projectTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Modalidad de Trabajo</label>
        <input
          type="text"
          placeholder="Ej: Remoto, Tiempo Completo, Tiempo Parcial (separados por coma)"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.workArrangement?.join(', ') || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            workArrangement: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Industrias de Interés</label>
        <input
          type="text"
          placeholder="Ej: Fintech, Tecnología, Startups (separados por coma)"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.preferredIndustries?.join(', ') || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            preferredIndustries: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-sm font-medium">Rango de Presupuesto</label>
          <input
            type="text"
            placeholder="Ej: $5,000 - $20,000"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.budgetRange || ''}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Disponibilidad</label>
          <input
            type="text"
            placeholder="Ej: 40 hrs/semana"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.availability || ''}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-sm font-medium">Tamaño de Proyecto</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.projectSize || ''}
            onChange={(e) => setFormData({ ...formData, projectSize: e.target.value })}
          >
            <option value="">Selecciona...</option>
            <option value="Pequeño">Pequeño (menos de $5k)</option>
            <option value="Mediano">Mediano ($5k - $20k)</option>
            <option value="Grande">Grande ($20k - $50k)</option>
            <option value="Empresarial">Empresarial (más de $50k)</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Compromiso Preferido</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.commitment || ''}
            onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
          >
            <option value="">Selecciona...</option>
            <option value="Corto plazo">Corto plazo (1-3 meses)</option>
            <option value="Mediano plazo">Mediano plazo (3-6 meses)</option>
            <option value="Largo plazo">Largo plazo (6+ meses)</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {section === 'interests' && 'Editar Intereses y Preferencias'}
              {section === 'basic' && 'Editar Información Básica'}
              {section === 'skills' && 'Editar Habilidades'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" size={20} />
            </Button>
          </div>

          {section === 'interests' && renderInterestsForm()}

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" size={16} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

