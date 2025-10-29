# Sistema de Autenticación - WorkOn

## Descripción General

El sistema de autenticación utiliza React Context API para manejar el estado global de la sesión del usuario en toda la aplicación.

## Componentes Principales

### 1. AuthContext
**Ubicación**: `src/contexts/AuthContext.jsx`

Contexto de React que proporciona:
- **Estado del usuario**: Información del usuario autenticado
- **Estado de carga**: Indicador mientras se verifica la sesión
- **Estado de autenticación**: Boolean que indica si hay sesión activa
- **Funciones**:
  - `login(email, password)`: Iniciar sesión
  - `register(userData)`: Registrar nuevo usuario
  - `logout()`: Cerrar sesión
  - `checkAuth()`: Verificar sesión actual

### 2. ProtectedRoute
**Ubicación**: `src/components/ProtectedRoute.jsx`

Componente de ruta que protege páginas que requieren autenticación.
- Si NO hay sesión → Redirige a `/login`
- Si hay sesión → Muestra el contenido

**Uso**:
```jsx
<Route path="/perfil" element={
  <ProtectedRoute>
    <Navbar />
    <FreelancerProfilePage />
  </ProtectedRoute>
} />
```

### 3. PublicRoute
**Ubicación**: `src/components/PublicRoute.jsx`

Componente de ruta para páginas públicas (Landing, Login, Registro).
- Si NO hay sesión → Muestra el contenido (Landing, Login, etc.)
- Si hay sesión → Redirige automáticamente:
  - Empleadores → `/empleador`
  - Freelancers → `/feed`

**Uso**:
```jsx
<Route path="/" element={
  <PublicRoute>
    <LandingPage />
  </PublicRoute>
} />
```

## Flujo de Autenticación

### 1. Usuario sin sesión
```
┌─────────────┐
│   Landing   │ ← Usuario puede ver la landing
│   /         │
└─────────────┘
      │
      ▼
┌─────────────┐
│   Login     │ ← Ingresa credenciales
│   /login    │
└─────────────┘
      │
      ▼ (Autenticación exitosa)
┌─────────────┐
│ Freelancer  │ ← Redirige según tipo de usuario
│   /feed     │
└─────────────┘
```

### 2. Usuario con sesión activa
```
┌─────────────┐
│ Intenta ir  │
│ a Landing   │ ← Usuario autenticado
│   /         │
└─────────────┘
      │
      ▼ (Tiene sesión)
┌─────────────┐
│ Freelancer  │ ← Redirección automática
│   /feed     │
└─────────────┘
```

## Implementación en App.jsx

```jsx
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>  {/* Envuelve toda la app */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          
          {/* Rutas Protegidas */}
          <Route path="/feed" element={
            <ProtectedRoute>
              <Navbar />
              <FeedPage />
            </ProtectedRoute>
          } />
          
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Navbar />
              <FreelancerProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

## Uso del Hook useAuth

En cualquier componente puedes acceder al estado de autenticación:

```jsx
import { useAuth } from '../contexts/AuthContext'

function MiComponente() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  
  if (loading) {
    return <div>Cargando...</div>
  }
  
  if (!isAuthenticated) {
    return <div>No autenticado</div>
  }
  
  return (
    <div>
      <p>Hola, {user.email}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  )
}
```

## Persistencia de Sesión

El sistema utiliza `localStorage` para persistir la sesión:
- **authToken**: Token JWT (simulado)
- **userId**: ID del usuario
- **userType**: Tipo de usuario (freelancer/employer)

Cuando la app se carga:
1. `AuthProvider` ejecuta `checkAuth()`
2. Verifica si existe un token en localStorage
3. Si existe y es válido, restaura la sesión
4. Si no existe o es inválido, el usuario debe iniciar sesión

## Tipos de Usuario

El sistema soporta dos tipos:

### Freelancer
- **Tipo**: `freelancer`
- **Ruta inicial**: `/feed`
- **Dashboard**: Feed de trabajos

### Empleador
- **Tipo**: `employer`
- **Ruta inicial**: `/empleador`
- **Dashboard**: Panel de empleador

## Seguridad

⚠️ **Nota**: Esta es una implementación de DEMO con datos mock.

En producción, deberás:
1. Usar JWT reales desde tu backend
2. Implementar refresh tokens
3. Agregar expiración de tokens
4. Usar HTTPS obligatorio
5. Implementar rate limiting
6. Validar tokens en cada request
7. Implementar 2FA (opcional)

## Testing

Para probar el sistema, usa las credenciales de ejemplo:

**Freelancer**:
- Email: `freelancer@example.com`
- Password: `password`

**Empleador**:
- Email: `employer@example.com`
- Password: `password`

## Troubleshooting

### La sesión no persiste al recargar
- Verifica que localStorage no esté bloqueado
- Revisa la consola del navegador por errores

### Redireccionamiento infinito
- Verifica que las rutas estén correctamente configuradas
- Asegúrate de que `PublicRoute` y `ProtectedRoute` no estén anidados incorrectamente

### El usuario no se actualiza después del login
- Verifica que `checkAuth()` se llame después del login
- Revisa que el token se guarde correctamente en localStorage

