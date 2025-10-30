import { useState } from 'react'
import { useProfileController } from '../controllers/useProfileController'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { 
  User, Briefcase, Award, Star, MapPin, Clock, DollarSign, 
  Mail, Phone, Globe, Github, Linkedin, Twitter, 
  Edit, Plus, Calendar, TrendingUp, CheckCircle2, Target,
  Heart, Code, Zap, Shield, Trash2, ExternalLink, Wallet
} from '../../../components/ui/Icons'
import { ExperienceSection } from './ExperienceSection'
import { InterestsSection } from './InterestsSection'
import { RatingsSection } from './RatingsSection'
import { EditProfileModal } from './EditProfileModal'
import { AddPortfolioModal } from './AddPortfolioModal'

export const FreelancerProfilePage = () => {
  const { 
    profile, 
    loading, 
    updateProfile,
    portfolio,
    portfolioLoading,
    createPortfolioEntry,
    uploadPortfolioFile,
    deletePortfolioEntry,
    refreshPortfolio
  } = useProfileController('freelancer')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No se encontró el perfil</p>
      </div>
    )
  }

  const handleEdit = (section) => {
    if (section === 'portfolio') {
      setShowPortfolioModal(true)
    } else {
      setEditingSection(section)
      setShowEditModal(true)
    }
  }

  const handleSavePortfolio = async ({ title, description, files }) => {
    try {
      // Create entry
      const entry = await createPortfolioEntry({ title, description })
      
      // Upload files
      if (files && files.length > 0) {
        for (const file of files) {
          await uploadPortfolioFile({ entryId: entry.id, file })
        }
      }
      
      // Refresh portfolio list
      await refreshPortfolio()
    } catch (error) {
      console.error('Error saving portfolio:', error)
      throw error
    }
  }

  const handleDeletePortfolio = async (entryId) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return
    }
    
    try {
      await deletePortfolioEntry(entryId)
    } catch (error) {
      console.error('Error deleting portfolio:', error)
      alert('Error al eliminar el proyecto')
    }
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header Banner */}
      <div className="relative h-64 bg-gradient-to-r from-primary via-accent to-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={profile.avatar} alt={profile.displayName || profile.full_name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-4xl">
                    {profile.initials || '??'}
                  </AvatarFallback>
                </Avatar>
                {profile.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-2 shadow-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" size={24} />
                  </div>
                )}
              </div>

              {/* Info Principal */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-3xl font-bold">
                        {profile.displayName || profile.full_name || 'Freelancer'}
                      </h1>
                    </div>
                    {profile.portfolio_summary && (
                      <p className="text-lg text-muted-foreground">{profile.portfolio_summary}</p>
                    )}
                  </div>
                  <Button onClick={() => handleEdit('basic')} variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" size={16} />
                    Editar Perfil
                  </Button>
                </div>

                {/* Rating (from DB) */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(profile.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
                          size={20}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-lg">{profile.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  
                  {profile.work_history && profile.work_history.length > 0 && (
                    <>
                      <div className="h-6 w-px bg-border"></div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-accent" size={20} />
                        <span>{profile.work_history.length} proyectos completados</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Wallet Address (if exists) */}
                {profile.wallet_address && (
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Wallet className="h-4 w-4" size={16} />
                      <span className="font-mono text-xs">{profile.wallet_address.substring(0, 8)}...{profile.wallet_address.substring(profile.wallet_address.length - 4)}</span>
                    </div>
                  </div>
                )}

                {/* Bio */}
                <p className="text-muted-foreground leading-relaxed pt-2">
                  {profile.bio}
                </p>

                {/* Contact */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.email && (
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Mail className="h-4 w-4" size={16} />
                      {profile.email}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
              {profile.socialLinks?.github && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Github className="h-4 w-4" size={16} />
                    GitHub
                  </a>
                </Button>
              )}
              {profile.socialLinks?.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Linkedin className="h-4 w-4" size={16} />
                    LinkedIn
                  </a>
                </Button>
              )}
              {profile.socialLinks?.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Twitter className="h-4 w-4" size={16} />
                    Twitter
                  </a>
                </Button>
              )}
              {profile.socialLinks?.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Globe className="h-4 w-4" size={16} />
                    Sitio Web
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Intereses y Preferencias */}
            <InterestsSection profile={profile} onEdit={() => handleEdit('interests')} />

            {/* Experiencia Profesional */}
            <ExperienceSection profile={profile} onEdit={() => handleEdit('experience')} />

            {/* Educación - Hidden (not in DB yet) */}
            {profile.education && profile.education.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Award className="h-5 w-5 text-white" size={20} />
                      </div>
                      <CardTitle>Educación</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('education')} className="gap-2">
                      <Edit className="h-4 w-4" size={16} />
                      Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="flex gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Award className="h-6 w-6 text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{edu.degree}</h4>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" size={12} />
                            {edu.startDate} - {edu.endDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certificaciones */}
            {profile.certifications && profile.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" size={20} />
                      </div>
                      <CardTitle>Certificaciones</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('certifications')} className="gap-2">
                      <Plus className="h-4 w-4" size={16} />
                      Agregar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profile.certifications.map((cert) => (
                      <div key={cert.id} className="p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-colors">
                        <h4 className="font-semibold">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Portfolio */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Code className="h-5 w-5 text-white" size={20} />
                    </div>
                    <CardTitle>Portfolio</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit('portfolio')} className="gap-2">
                    <Plus className="h-4 w-4" size={16} />
                    Agregar Proyecto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {portfolioLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : portfolio.length === 0 ? (
                  <div className="text-center py-12">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-3" size={48} />
                    <p className="text-muted-foreground mb-4">No hay proyectos en el portfolio</p>
                    <Button onClick={() => handleEdit('portfolio')} className="gap-2">
                      <Plus className="h-4 w-4" size={16} />
                      Agregar tu primer proyecto
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolio.map((project) => (
                      <Card key={project.id} hover className="overflow-hidden group relative">
                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePortfolio(project.id)}
                          className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" size={16} />
                        </Button>

                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-48 object-cover"
                        />
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-lg mb-2">{project.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                          
                          {project.files && project.files.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                              <span>{project.files.length} archivo{project.files.length !== 1 ? 's' : ''}</span>
                              <span className="text-border">•</span>
                              <span>{project.files.filter(f => f.mime_type?.startsWith('image/')).length} imagen{project.files.filter(f => f.mime_type?.startsWith('image/')).length !== 1 ? 'es' : ''}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Stats Card - From Real DB */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Proyectos completados</span>
                  <span className="font-bold text-lg">{profile.work_history?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-bold text-lg text-yellow-400">
                    {profile.rating ? `${profile.rating.toFixed(1)} ⭐` : 'Sin calificaciones'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Proyectos en portfolio</span>
                  <span className="font-bold text-lg">{portfolio?.length || 0}</span>
                </div>
                {profile.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Miembro desde</span>
                    <span className="font-bold text-lg">
                      {new Date(profile.created_at).toLocaleDateString('es-MX', { 
                        year: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills - Hidden (not in DB yet) */}
            {profile.skills && profile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Habilidades</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('skills')} className="gap-2">
                      <Edit className="h-4 w-4" size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{skill.name}</span>
                          <span className="text-xs text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages - Hidden (not in DB yet) */}
            {profile.languages && profile.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Idiomas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <span className="font-medium">{lang.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {lang.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ratings y Reseñas */}
            <RatingsSection profile={profile} />
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <EditProfileModal
          section={editingSection}
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={updateProfile}
        />
      )}

      {/* Modal de Portfolio */}
      {showPortfolioModal && (
        <AddPortfolioModal
          onClose={() => setShowPortfolioModal(false)}
          onSave={handleSavePortfolio}
        />
      )}
    </div>
  )
}

