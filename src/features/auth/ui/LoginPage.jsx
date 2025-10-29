import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { CheckCircle2, AlertCircle, User, Briefcase } from '../../../components/ui/Icons'
import { Logo } from '../../../components/Logo'
import { useAuth } from '../../../contexts/AuthContext'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      const result = await login(formData.email, formData.password)
      
      // Redirigir según el tipo de usuario
      if (result.user.type === 'employer') {
        navigate('/empleador')
      } else {
        navigate('/feed')
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    // Aquí iría la lógica de reset de password
    setResetSuccess(true)
    setTimeout(() => {
      setShowResetPassword(false)
      setResetSuccess(false)
      setResetEmail('')
    }, 3000)
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
              Bienvenido de vuelta
            </p>
          </div>
        </div>

        {/* Formulario de login */}
        {!showResetPassword ? (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Iniciar Sesión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mensajes de error */}
              {error && (
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="p-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" size={16} />
                    <p className="text-sm text-destructive">{error}</p>
                  </CardContent>
                </Card>
              )}

              {/* Datos de prueba */}
              <Card className="border-accent/30 bg-accent/5">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" size={16} />
                    <p className="text-xs font-medium">Usuarios de prueba:</p>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground ml-6">
                    <p><strong>Freelancer:</strong> freelancer@workon.com</p>
                    <p><strong>Empleador:</strong> empleador@workon.com</p>
                    <p className="text-accent">Contraseña: password123</p>
                  </div>
                </CardContent>
              </Card>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Forgot password */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    ¿No tienes cuenta?
                  </span>
                </div>
              </div>

              {/* Register link */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Regístrate como:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/registro?type=freelancer">
                    <Button variant="outline" className="w-full gap-2">
                      <User className="h-4 w-4" size={16} />
                      Freelancer
                    </Button>
                  </Link>
                  <Link to="/registro?type=employer">
                    <Button variant="outline" className="w-full gap-2">
                      <Briefcase className="h-4 w-4" size={16} />
                      Empresa
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Formulario de reset password */
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Recuperar Contraseña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resetSuccess ? (
                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-medium">Email enviado</p>
                      <p className="text-xs text-muted-foreground">
                        Revisa tu bandeja de entrada
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                  </p>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowResetPassword(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1">
                      Enviar enlace
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

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

