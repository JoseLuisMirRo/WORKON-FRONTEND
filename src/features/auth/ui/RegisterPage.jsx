import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { CheckCircle2, AlertCircle, User, Briefcase } from '../../../components/ui/Icons'
import { Logo } from '../../../components/Logo'
import { useAuth } from '../../../contexts/AuthContext'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register: registerUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [userType, setUserType] = useState(searchParams.get('type') || 'freelancer')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam) {
      setUserType(typeParam)
    }
  }, [searchParams])

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido'
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Debes aceptar los términos y condiciones'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: userType
      })
      
      // Redirigir a la página de creación de perfil según el tipo
      if (result.user.type === 'employer') {
        navigate('/crear-perfil-empresa')
      } else {
        navigate('/crear-perfil-freelancer')
      }
    } catch (err) {
      setError(err.message || 'Error al registrarse')
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo y título */}
        <div className="flex flex-col items-center space-y-4">
          <Logo size="xl" showText={false} />
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground tracking-wider">POWERED BY STELLAR</p>
            <p className="text-muted-foreground">
              Crea tu cuenta
            </p>
          </div>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">Registro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selector de tipo de usuario */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de cuenta</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={userType === 'freelancer' ? 'default' : 'outline'}
                  onClick={() => setUserType('freelancer')}
                  className="gap-2"
                >
                  <User className="h-4 w-4" size={16} />
                  Freelancer
                </Button>
                <Button
                  type="button"
                  variant={userType === 'employer' ? 'default' : 'outline'}
                  onClick={() => setUserType('employer')}
                  className="gap-2"
                >
                  <Briefcase className="h-4 w-4" size={16} />
                  Empresa
                </Button>
              </div>
            </div>

            {/* Mensaje de error general */}
            {error && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" size={16} />
                  <p className="text-sm text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Información sobre el tipo de cuenta */}
            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" size={16} />
                  <p className="text-xs font-medium">
                    {userType === 'freelancer' 
                      ? 'Como Freelancer podrás:'
                      : 'Como Empresa podrás:'
                    }
                  </p>
                </div>
                <ul className="text-xs text-muted-foreground ml-6 space-y-0.5">
                  {userType === 'freelancer' ? (
                    <>
                      <li>• Buscar trabajos y proyectos</li>
                      <li>• Aplicar a ofertas</li>
                      <li>• Gestionar tus trabajos activos</li>
                    </>
                  ) : (
                    <>
                      <li>• Publicar ofertas de trabajo</li>
                      <li>• Recibir propuestas de freelancers</li>
                      <li>• Gestionar proyectos y pagos</li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {userType === 'employer' ? 'Nombre de la Empresa' : 'Nombre Completo'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={userType === 'employer' ? 'TechCorp SA' : 'Juan Pérez'}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    validationErrors.name ? 'border-destructive' : 'border-input'
                  } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {validationErrors.name && (
                  <p className="text-xs text-destructive">{validationErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className={`w-full px-4 py-2 rounded-xl border ${
                    validationErrors.email ? 'border-destructive' : 'border-input'
                  } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {validationErrors.email && (
                  <p className="text-xs text-destructive">{validationErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 rounded-xl border ${
                    validationErrors.password ? 'border-destructive' : 'border-input'
                  } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {validationErrors.password && (
                  <p className="text-xs text-destructive">{validationErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 rounded-xl border ${
                    validationErrors.confirmPassword ? 'border-destructive' : 'border-input'
                  } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-destructive">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and conditions */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="mt-1 rounded border-input"
                  />
                  <span className="text-sm text-muted-foreground">
                    Acepto los{' '}
                    <Link to="/terminos" className="text-primary hover:underline">
                      términos y condiciones
                    </Link>
                    {' '}y la{' '}
                    <Link to="/privacidad" className="text-primary hover:underline">
                      política de privacidad
                    </Link>
                  </span>
                </label>
                {validationErrors.acceptTerms && (
                  <p className="text-xs text-destructive">{validationErrors.acceptTerms}</p>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            {/* Login link */}
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Iniciar Sesión
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

