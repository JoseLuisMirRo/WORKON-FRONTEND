import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { CheckCircle2, Briefcase, Globe, Award, Plus, X } from '../../../components/ui/Icons'
import * as profileService from '../services/profileService'

export const CreateEmployerProfile = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    industry: 'Tecnología',
    companySize: '1-10',
    founded: '',
    website: '',
    description: '',
    location: '',
    headquarters: '',
    benefits: [],
    techStack: [],
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  })

  const [currentBenefit, setCurrentBenefit] = useState('')
  const [currentTech, setCurrentTech] = useState('')

  const industries = [
    'Tecnología',
    'Finanzas',
    'Salud',
    'Educación',
    'E-commerce',
    'Marketing',
    'Manufactura',
    'Servicios',
    'Otro'
  ]

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+']

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      await profileService.updateEmployerProfile(formData)
      alert('¡Perfil de empresa creado exitosamente!')
      navigate('/empleador')
    } catch (error) {
      alert('Error al crear el perfil')
    } finally {
      setSaving(false)
    }
  }

  const addBenefit = () => {
    if (currentBenefit.trim() && !formData.benefits.includes(currentBenefit.trim())) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, currentBenefit.trim()]
      })
      setCurrentBenefit('')
    }
  }

  const removeBenefit = (benefit) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter(b => b !== benefit)
    })
  }

  const addTech = () => {
    if (currentTech.trim() && !formData.techStack.includes(currentTech.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, currentTech.trim()]
      })
      setCurrentTech('')
    }
  }

  const removeTech = (tech) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    })
  }

  const progress = (step / 3) * 100

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header con progreso */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Crear Perfil de Empresa</h1>
              <p className="text-muted-foreground mt-1">
                Paso {step} de 3 - {step === 1 ? 'Información de la Empresa' : step === 2 ? 'Beneficios y Tecnologías' : 'Enlaces y Redes Sociales'}
              </p>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              {Math.round(progress)}% Completado
            </Badge>
          </div>

          {/* Barra de progreso */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Paso 1: Información de la Empresa */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Información de la Empresa</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre de la Empresa *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="TechCorp SA"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción de la Empresa *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Describe tu empresa, qué hace, su misión y valores..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Corporativo *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="contact@empresa.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+52 555 123 4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industria *</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tamaño *</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size} empleados</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fundada</label>
                    <input
                      type="number"
                      value={formData.founded}
                      onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ubicación *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ciudad, País"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Oficinas Principales</label>
                    <input
                      type="text"
                      value={formData.headquarters}
                      onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Polanco, CDMX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sitio Web</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://tuempresa.com"
                  />
                </div>
              </div>
            )}

            {/* Paso 2: Beneficios y Tecnologías */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Beneficios y Tecnologías</h2>
                </div>

                {/* Beneficios */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Beneficios para Freelancers</h3>
                  <p className="text-sm text-muted-foreground">
                    Agrega los beneficios que ofreces a los freelancers que trabajan contigo
                  </p>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentBenefit}
                      onChange={(e) => setCurrentBenefit(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                      placeholder="ej: Pagos puntuales"
                      className="flex-1 px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={addBenefit} className="gap-2">
                      <Plus className="h-4 w-4" size={16} />
                      Agregar
                    </Button>
                  </div>

                  {formData.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.benefits.map((benefit, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm px-3 py-1.5 cursor-pointer hover:bg-destructive/20"
                          onClick={() => removeBenefit(benefit)}
                        >
                          {benefit} ✕
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold">Stack Tecnológico</h3>
                  <p className="text-sm text-muted-foreground">
                    ¿Qué tecnologías utiliza tu empresa?
                  </p>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentTech}
                      onChange={(e) => setCurrentTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                      placeholder="ej: React, Node.js, AWS"
                      className="flex-1 px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={addTech} className="gap-2">
                      <Plus className="h-4 w-4" size={16} />
                      Agregar
                    </Button>
                  </div>

                  {formData.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.techStack.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm px-3 py-1.5 cursor-pointer hover:bg-destructive/20 bg-secondary/30 border border-secondary/50"
                          onClick={() => removeTech(tech)}
                        >
                          {tech} ✕
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 3: Enlaces Sociales */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Enlaces y Redes Sociales</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://linkedin.com/company/tuempresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Twitter</label>
                    <input
                      type="url"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://twitter.com/tuempresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Facebook</label>
                    <input
                      type="url"
                      value={formData.socialLinks.facebook}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://facebook.com/tuempresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instagram</label>
                    <input
                      type="url"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://instagram.com/tuempresa"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                Atrás
              </Button>

              {step < 3 ? (
                <Button onClick={handleNext} className="gap-2">
                  Siguiente
                  <CheckCircle2 className="h-4 w-4" size={16} />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={saving || !formData.companyName || !formData.email}
                  className="gap-2"
                >
                  {saving ? 'Guardando...' : 'Crear Perfil de Empresa'}
                  <CheckCircle2 className="h-4 w-4" size={16} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

