import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { CheckCircle2, User, Briefcase, BookOpen, Award, Globe, Plus, X } from '../../../components/ui/Icons'
import * as profileService from '../services/profileService'

export const CreateFreelancerProfile = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
    location: '',
    hourlyRate: 30,
    skills: [],
    languages: [],
    experience: [],
    education: [],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: ''
    }
  })

  const [currentSkill, setCurrentSkill] = useState({ name: '', level: 50 })
  const [currentLanguage, setCurrentLanguage] = useState({ name: '', level: 'Básico' })

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      await profileService.updateFreelancerProfile(formData)
      alert('¡Perfil creado exitosamente!')
      navigate('/perfil')
    } catch (error) {
      alert('Error al crear el perfil')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (currentSkill.name.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill]
      })
      setCurrentSkill({ name: '', level: 50 })
    }
  }

  const removeSkill = (skillName) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s.name !== skillName)
    })
  }

  const addLanguage = () => {
    if (currentLanguage.name.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, currentLanguage]
      })
      setCurrentLanguage({ name: '', level: 'Básico' })
    }
  }

  const removeLanguage = (langName) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l.name !== langName)
    })
  }

  const progress = (step / 4) * 100

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header con progreso */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Crear Perfil de Freelancer</h1>
              <p className="text-muted-foreground mt-1">
                Paso {step} de 4 - {step === 1 ? 'Información Básica' : step === 2 ? 'Habilidades' : step === 3 ? 'Experiencia' : 'Enlaces'}
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
            {/* Paso 1: Información Básica */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="h-5 w-5 text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Información Personal</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Juan"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Apellido *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Pérez"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Título Profesional *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="ej: Full Stack Developer & Blockchain Specialist"
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+52 123 456 7890"
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
                    <label className="text-sm font-medium">Tarifa por Hora (USD) *</label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      min="5"
                      step="5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2: Habilidades */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Habilidades y Lenguajes</h2>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Habilidades Técnicas</h3>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentSkill.name}
                      onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                      placeholder="Nombre de la habilidad (ej: React)"
                      className="flex-1 px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="w-32">
                      <input
                        type="number"
                        value={currentSkill.level}
                        onChange={(e) => setCurrentSkill({ ...currentSkill, level: Number(e.target.value) })}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Nivel %"
                      />
                    </div>
                    <Button onClick={addSkill} className="gap-2">
                      <Plus className="h-4 w-4" size={16} />
                      Agregar
                    </Button>
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="space-y-2">
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

                {/* Languages */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold">Idiomas</h3>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentLanguage.name}
                      onChange={(e) => setCurrentLanguage({ ...currentLanguage, name: e.target.value })}
                      placeholder="Idioma (ej: Español)"
                      className="flex-1 px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                      value={currentLanguage.level}
                      onChange={(e) => setCurrentLanguage({ ...currentLanguage, level: e.target.value })}
                      className="px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Básico</option>
                      <option>Intermedio</option>
                      <option>Avanzado</option>
                      <option>Nativo</option>
                    </select>
                    <Button onClick={addLanguage} className="gap-2">
                      <Plus className="h-4 w-4" size={16} />
                      Agregar
                    </Button>
                  </div>

                  {formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((lang, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm px-3 py-1.5 cursor-pointer hover:bg-destructive/20"
                          onClick={() => removeLanguage(lang.name)}
                        >
                          {lang.name} - {lang.level} ✕
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 3: Experiencia */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Experiencia y Educación</h2>
                </div>

                <p className="text-muted-foreground">
                  Puedes agregar tu experiencia y educación después de crear tu perfil. Por ahora, asegúrate de que tu información básica y habilidades estén completas.
                </p>

                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" size={20} />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Completa tu perfil después</p>
                        <p className="text-xs text-muted-foreground">
                          Podrás agregar experiencia laboral, educación, certificaciones y proyectos de portfolio desde tu perfil.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Paso 4: Enlaces Sociales */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Enlaces y Redes Sociales</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub</label>
                    <input
                      type="url"
                      value={formData.socialLinks.github}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, github: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://github.com/tuusuario"
                    />
                  </div>

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
                      placeholder="https://linkedin.com/in/tuusuario"
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
                      placeholder="https://twitter.com/tuusuario"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sitio Web Personal</label>
                    <input
                      type="url"
                      value={formData.socialLinks.website}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, website: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://tusitioweb.com"
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

              {step < 4 ? (
                <Button onClick={handleNext} className="gap-2">
                  Siguiente
                  <CheckCircle2 className="h-4 w-4" size={16} />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={saving || !formData.firstName || !formData.email}
                  className="gap-2"
                >
                  {saving ? 'Guardando...' : 'Crear Perfil'}
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

