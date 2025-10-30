# 🔐 Sistema de Validación de Roles - Frontend

## ✅ Cambios Implementados

He actualizado completamente el sistema de autenticación para validar vistas y rutas según el **rol** del usuario (`employer` o `freelancer`).

### 📋 Estructura de Datos de Usuario

El sistema ahora espera esta estructura de perfil desde la base de datos:

```json
{
  "id": "46c91b8f-fa7e-4fe9-a218-67f957cfe679",
  "role": "employer",
  "full_name": "Daniela Carrate",
  "email": "daniela@freelancechain.com",
  "wallet_address": "0xD4n13L4C4rr4t3",
  "rating": 0.00,
  "bio": "Empleadora enfocada en proyectos de software y marketing digital.",
  "portfolio_summary": null,
  "created_at": "2025-10-29T21:16:05.603996+00:00",
  "updated_at": "2025-10-29T21:16:05.603996+00:00"
}
```

**Campos clave:**
- `role`: "employer" | "freelancer"
- `full_name`: Nombre completo del usuario
- `email`: Email del usuario
- `wallet_address`: Dirección de wallet (puede ser null)

---

## 🔧 Archivos Modificados

### 1. **authService.js** - Servicio de Autenticación

**Cambios:**
- ✅ Cambió `user_type` por `role`
- ✅ Cambió `name` por `full_name`
- ✅ Cambió `avatar` por `avatar_url`
- ✅ LocalStorage ahora usa `userRole` en lugar de `userType`
- ✅ Función `getUserType()` renombrada a `getUserRole()`

**Ubicación:** `src/features/auth/services/authService.js`

### 2. **RoleProtectedRoute.jsx** - Nuevo Componente

**Funcionalidad:**
- ✅ Protege rutas según el rol del usuario
- ✅ Permite especificar múltiples roles permitidos
- ✅ Redirige automáticamente según el rol del usuario
- ✅ Muestra loader mientras verifica autenticación

**Ubicación:** `src/components/RoleProtectedRoute.jsx`

**Uso:**
```jsx
// Solo para freelancers
<RoleProtectedRoute allowedRoles={['freelancer']}>
  <FeedPage />
</RoleProtectedRoute>

// Solo para employers
<RoleProtectedRoute allowedRoles={['employer']}>
  <EmployerDashboard />
</RoleProtectedRoute>

// Para ambos roles
<RoleProtectedRoute allowedRoles={['freelancer', 'employer']}>
  <MessagesPage />
</RoleProtectedRoute>
```

### 3. **App.jsx** - Rutas de la Aplicación

**Cambios:**
- ✅ Todas las rutas ahora usan `RoleProtectedRoute`
- ✅ Rutas organizadas por rol:
  - **Freelancers:** `/feed`, `/mis-trabajos`, `/perfil`, etc.
  - **Employers:** `/empleador`, `/crear-perfil-empresa`
  - **Compartidas:** `/mensajes`, `/tokens`, `/configuracion`

**Ubicación:** `src/App.jsx`

### 4. **Navbar.jsx** - Navegación Dinámica

**Cambios:**
- ✅ Menú desktop varía según el rol del usuario
- ✅ Menú móvil varía según el rol del usuario
- ✅ Enlaces de perfil dinámicos:
  - Freelancer → `/perfil`
  - Employer → `/empleador`

**Ubicación:** `src/components/Navbar.jsx`

**Navegación por rol:**
- **Freelancer:** Feed, Mis Trabajos, Mensajes
- **Employer:** Dashboard, Mensajes

### 5. **LoginPage.jsx** - Página de Inicio de Sesión

**Cambios:**
- ✅ Redirige según el rol después del login:
  - `employer` → `/empleador`
  - `freelancer` → `/feed`

**Ubicación:** `src/features/auth/ui/LoginPage.jsx`

### 6. **RegisterPage.jsx** - Página de Registro

**Cambios:**
- ✅ Usa `role` en lugar de `type`
- ✅ Redirige según el rol después del registro:
  - `employer` → `/crear-perfil-empresa`
  - `freelancer` → `/crear-perfil-freelancer`

**Ubicación:** `src/features/auth/ui/RegisterPage.jsx`

---

## 🚀 Cómo Funciona

### 1. **Flujo de Autenticación**

```
Usuario → Login/Register → Supabase Auth
                                ↓
                    Obtiene perfil de BD
                                ↓
                    Extrae el campo "role"
                                ↓
                    Guarda en localStorage y Context
                                ↓
                    Redirige según el rol
```

### 2. **Validación de Rutas**

Cada vez que un usuario intenta acceder a una ruta:

1. `RoleProtectedRoute` verifica si está autenticado
2. Extrae el `role` del usuario desde el contexto
3. Compara con `allowedRoles` de la ruta
4. Si el rol coincide → Muestra la página
5. Si no coincide → Redirige a la página correspondiente

### 3. **Redirecciones Automáticas**

| Rol Usuario | Intenta acceder a... | Se redirige a... |
|-------------|----------------------|------------------|
| freelancer  | `/empleador`         | `/feed`          |
| employer    | `/feed`              | `/empleador`     |
| employer    | `/mis-trabajos`      | `/empleador`     |

---

## 📊 Rutas por Rol

### 🎨 Rutas para FREELANCERS

```javascript
✅ /feed                      // Feed de trabajos
✅ /mis-trabajos              // Mis trabajos activos
✅ /perfil                    // Perfil de freelancer
✅ /crear-perfil-freelancer   // Crear perfil inicial
✅ /perfil-freelancer         // Ver perfil completo
```

### 💼 Rutas para EMPLOYERS

```javascript
✅ /empleador                 // Dashboard del empleador
✅ /crear-perfil-empresa      // Crear perfil de empresa
```

### 🔄 Rutas COMPARTIDAS

```javascript
✅ /mensajes                  // Chat entre usuarios
✅ /tokens                    // Balance de tokens
✅ /configuracion             // Ajustes de cuenta
```

### 🌐 Rutas PÚBLICAS (sin autenticación)

```javascript
✅ /                          // Landing page
✅ /login                     // Iniciar sesión
✅ /registro                  // Crear cuenta
```

---

## 🎯 Ejemplo Práctico

### Usuario Freelancer

```javascript
// 1. Hace login
login('freelancer@workon.com', 'password123')

// 2. Sistema obtiene perfil de BD
{
  "id": "abc123",
  "role": "freelancer",
  "full_name": "Juan Pérez",
  "email": "freelancer@workon.com"
}

// 3. Se redirige a /feed
navigate('/feed')

// 4. Navbar muestra:
// - Feed
// - Mis Trabajos
// - Mensajes

// 5. Si intenta acceder a /empleador
// → Se redirige automáticamente a /feed
```

### Usuario Employer

```javascript
// 1. Hace login
login('daniela@freelancechain.com', 'password123')

// 2. Sistema obtiene perfil de BD
{
  "id": "46c91b8f-fa7e-4fe9-a218-67f957cfe679",
  "role": "employer",
  "full_name": "Daniela Carrate",
  "email": "daniela@freelancechain.com"
}

// 3. Se redirige a /empleador
navigate('/empleador')

// 4. Navbar muestra:
// - Dashboard
// - Mensajes

// 5. Si intenta acceder a /feed
// → Se redirige automáticamente a /empleador
```

---

## 🔍 Debugging

Para verificar el rol del usuario en cualquier momento:

```javascript
// En la consola del navegador
localStorage.getItem('userRole')  // → "employer" o "freelancer"

// En el código (usando el hook useAuth)
const { user } = useAuth()
console.log(user.role)  // → "employer" o "freelancer"
```

---

## ⚠️ Importante: Estructura de Base de Datos

Asegúrate de que tu tabla `profiles` en Supabase tenga estos campos:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,                              -- Cambió de 'name'
  role TEXT CHECK (role IN ('freelancer', 'employer')),  -- Cambió de 'user_type'
  wallet_address TEXT,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  bio TEXT,
  portfolio_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## ✨ Ventajas del Sistema

1. **Seguridad:** Las rutas están protegidas a nivel de componente
2. **Flexibilidad:** Fácil agregar nuevos roles o rutas
3. **UX mejorado:** Navegación personalizada según el rol
4. **Mantenibilidad:** Código organizado y fácil de entender
5. **Escalabilidad:** Sistema preparado para crecer

---

## 🧪 Testing

Para probar el sistema:

1. **Crear usuario Freelancer:**
   - Registro → Seleccionar "Freelancer"
   - Verificar que se redirige a `/crear-perfil-freelancer`
   - Verificar que el navbar muestra: Feed, Mis Trabajos, Mensajes

2. **Crear usuario Employer:**
   - Registro → Seleccionar "Empresa"
   - Verificar que se redirige a `/crear-perfil-empresa`
   - Verificar que el navbar muestra: Dashboard, Mensajes

3. **Intentar acceder a rutas no permitidas:**
   - Como Freelancer → Ir a `/empleador` → Debe redirigir a `/feed`
   - Como Employer → Ir a `/feed` → Debe redirigir a `/empleador`

---

## 📝 Notas Finales

- El sistema usa el campo `role` de la base de datos
- Los roles se guardan en `localStorage` como `userRole`
- El componente `RoleProtectedRoute` es reutilizable
- El Navbar se adapta automáticamente al rol del usuario
- Todas las rutas están protegidas excepto las públicas

---

**¡El sistema está listo para usar! 🎉**

