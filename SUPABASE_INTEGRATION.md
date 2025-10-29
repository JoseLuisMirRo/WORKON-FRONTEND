# 🚀 Integración con Supabase

Esta guía te ayudará a configurar y usar Supabase en tu proyecto frontend.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
3. [Uso del Cliente](#uso-del-cliente)
4. [Ejemplos por Feature](#ejemplos-por-feature)
5. [Best Practices](#best-practices)

---

## 🔧 Configuración Inicial

### 1. Crear un proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se inicialice (toma unos 2 minutos)

### 2. Obtener las credenciales

1. Ve a **Project Settings** > **API**
2. Copia la **URL** y la **anon/public key**

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con estas variables:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

⚠️ **Importante**: El archivo `.env` no se sube al repositorio por seguridad.

### 4. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

---

## 🗃️ Estructura de la Base de Datos

### Tabla: `profiles`

Almacena información de los usuarios (tanto freelancers como empleadores).

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  user_type TEXT CHECK (user_type IN ('freelancer', 'employer')),
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[], -- Para freelancers
  company_name TEXT, -- Para empleadores
  company_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver todos los perfiles
CREATE POLICY "Los perfiles son públicos" ON profiles
  FOR SELECT USING (true);

-- Política: Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política: Los usuarios pueden insertar su propio perfil
CREATE POLICY "Los usuarios pueden crear su perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Tabla: `jobs`

Almacena las ofertas de trabajo publicadas por empleadores.

```sql
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  duration TEXT,
  skills_required TEXT[],
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver trabajos abiertos
CREATE POLICY "Los trabajos son públicos" ON jobs
  FOR SELECT USING (true);

-- Política: Solo el empleador puede crear trabajos
CREATE POLICY "Los empleadores pueden crear trabajos" ON jobs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'employer'
    )
  );

-- Política: Solo el empleador puede actualizar sus trabajos
CREATE POLICY "Los empleadores pueden actualizar sus trabajos" ON jobs
  FOR UPDATE USING (employer_id = auth.uid());
```

### Tabla: `applications`

Almacena las postulaciones de freelancers a trabajos.

```sql
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  proposed_budget DECIMAL(10, 2),
  estimated_duration TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, freelancer_id)
);

-- Habilitar RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Política: Los freelancers pueden ver sus propias aplicaciones
CREATE POLICY "Los freelancers pueden ver sus aplicaciones" ON applications
  FOR SELECT USING (freelancer_id = auth.uid());

-- Política: Los empleadores pueden ver aplicaciones a sus trabajos
CREATE POLICY "Los empleadores pueden ver aplicaciones a sus trabajos" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE id = applications.job_id AND employer_id = auth.uid()
    )
  );

-- Política: Los freelancers pueden crear aplicaciones
CREATE POLICY "Los freelancers pueden aplicar a trabajos" ON applications
  FOR INSERT WITH CHECK (freelancer_id = auth.uid());

-- Política: Los empleadores pueden actualizar el estado de las aplicaciones
CREATE POLICY "Los empleadores pueden actualizar aplicaciones" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE id = applications.job_id AND employer_id = auth.uid()
    )
  );
```

### Tabla: `messages`

Almacena los mensajes entre usuarios.

```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus mensajes
CREATE POLICY "Los usuarios pueden ver sus mensajes" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Política: Los usuarios pueden enviar mensajes
CREATE POLICY "Los usuarios pueden enviar mensajes" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Política: Los usuarios pueden marcar sus mensajes como leídos
CREATE POLICY "Los usuarios pueden actualizar sus mensajes" ON messages
  FOR UPDATE USING (receiver_id = auth.uid());
```

---

## 💻 Uso del Cliente

El cliente de Supabase ya está configurado en `src/lib/supabaseClient.js`.

### Importar el cliente

```javascript
import { supabase } from '../../../lib/supabaseClient'
```

---

## 📚 Ejemplos por Feature

### 🔐 Autenticación (Ya implementado)

El servicio de autenticación ya está completamente integrado con Supabase:

```javascript
// src/features/auth/services/authService.js
import { login, register, logout, getCurrentUser } from './authService'

// Iniciar sesión
const { user, token } = await login('email@example.com', 'password123')

// Registrar usuario
const { user, token } = await register({
  email: 'nuevo@example.com',
  password: 'password123',
  name: 'Juan Pérez',
  type: 'freelancer' // o 'employer'
})

// Cerrar sesión
await logout()

// Obtener usuario actual
const currentUser = await getCurrentUser()
```

### 📋 Feed de Trabajos

Ejemplo para `src/features/feed/services/feedService.js`:

```javascript
import { supabase } from '../../../lib/supabaseClient'

/**
 * Obtener trabajos con filtros
 */
export const getJobs = async (filters = {}) => {
  try {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles!employer_id(id, name, avatar_url, company_name)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.minBudget) {
      query = query.gte('budget_min', filters.minBudget)
    }

    if (filters.maxBudget) {
      query = query.lte('budget_max', filters.maxBudget)
    }

    if (filters.skills && filters.skills.length > 0) {
      query = query.contains('skills_required', filters.skills)
    }

    const { data, error } = await query

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al obtener trabajos:', error)
    throw error
  }
}

/**
 * Obtener un trabajo por ID
 */
export const getJobById = async (jobId) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles!employer_id(id, name, avatar_url, company_name, bio),
        applications(id, freelancer_id)
      `)
      .eq('id', jobId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al obtener trabajo:', error)
    throw error
  }
}

/**
 * Aplicar a un trabajo
 */
export const applyToJob = async (jobId, applicationData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          job_id: jobId,
          freelancer_id: user.id,
          cover_letter: applicationData.coverLetter,
          proposed_budget: applicationData.proposedBudget,
          estimated_duration: applicationData.estimatedDuration,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al aplicar a trabajo:', error)
    throw error
  }
}
```

### 💼 Empleador (Dashboard)

Ejemplo para `src/features/employer/services/employerService.js`:

```javascript
import { supabase } from '../../../lib/supabaseClient'

/**
 * Crear un nuevo trabajo
 */
export const createJob = async (jobData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          employer_id: user.id,
          title: jobData.title,
          description: jobData.description,
          category: jobData.category,
          budget_min: jobData.budgetMin,
          budget_max: jobData.budgetMax,
          duration: jobData.duration,
          skills_required: jobData.skills,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al crear trabajo:', error)
    throw error
  }
}

/**
 * Obtener trabajos del empleador
 */
export const getMyJobs = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        applications(id, status)
      `)
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al obtener mis trabajos:', error)
    throw error
  }
}

/**
 * Obtener aplicaciones a un trabajo
 */
export const getJobApplications = async (jobId) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        freelancer:profiles!freelancer_id(id, name, avatar_url, bio, skills)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al obtener aplicaciones:', error)
    throw error
  }
}

/**
 * Actualizar estado de una aplicación
 */
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date() })
      .eq('id', applicationId)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al actualizar aplicación:', error)
    throw error
  }
}
```

### 💬 Mensajes

Ejemplo para `src/features/messages/services/messagesService.js`:

```javascript
import { supabase } from '../../../lib/supabaseClient'

/**
 * Obtener conversaciones del usuario
 */
export const getConversations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuario no autenticado')

    // Obtener todos los mensajes donde el usuario es sender o receiver
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(id, name, avatar_url),
        receiver:profiles!receiver_id(id, name, avatar_url)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Agrupar por conversación
    const conversations = {}
    data.forEach((message) => {
      const otherUserId = message.sender_id === user.id 
        ? message.receiver_id 
        : message.sender_id
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          userId: otherUserId,
          user: message.sender_id === user.id ? message.receiver : message.sender,
          lastMessage: message,
          unreadCount: 0,
          messages: [],
        }
      }
      
      conversations[otherUserId].messages.push(message)
      
      if (!message.read && message.receiver_id === user.id) {
        conversations[otherUserId].unreadCount++
      }
    })

    return Object.values(conversations)
  } catch (error) {
    console.error('Error al obtener conversaciones:', error)
    throw error
  }
}

/**
 * Obtener mensajes de una conversación
 */
export const getMessages = async (otherUserId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(id, name, avatar_url)
      `)
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al obtener mensajes:', error)
    throw error
  }
}

/**
 * Enviar un mensaje
 */
export const sendMessage = async (receiverId, content, jobId = null) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          job_id: jobId,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al enviar mensaje:', error)
    throw error
  }
}

/**
 * Marcar mensajes como leídos
 */
export const markAsRead = async (otherUserId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', user.id)
      .eq('read', false)

    if (error) throw error
  } catch (error) {
    console.error('Error al marcar como leído:', error)
    throw error
  }
}

/**
 * Suscribirse a nuevos mensajes en tiempo real
 */
export const subscribeToMessages = (callback) => {
  const { data: { user } } = supabase.auth.getUser()

  const subscription = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}
```

### 👤 Perfil

Ejemplo para `src/features/profile/services/profileService.js`:

```javascript
import { supabase } from '../../../lib/supabaseClient'

/**
 * Obtener perfil del usuario
 */
export const getProfile = async (userId = null) => {
  try {
    let targetUserId = userId
    
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')
      targetUserId = user.id
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    throw error
  }
}

/**
 * Actualizar perfil
 */
export const updateProfile = async (profileData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    throw error
  }
}

/**
 * Subir avatar
 */
export const uploadAvatar = async (file) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuario no autenticado')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Actualizar perfil con nueva URL
    await updateProfile({ avatar_url: publicUrl })

    return publicUrl
  } catch (error) {
    console.error('Error al subir avatar:', error)
    throw error
  }
}
```

---

## ✅ Best Practices

### 1. **Manejo de Errores**

Siempre maneja los errores de Supabase:

```javascript
try {
  const { data, error } = await supabase.from('table').select()
  if (error) throw error
  return data
} catch (error) {
  console.error('Error:', error)
  throw new Error(error.message)
}
```

### 2. **Row Level Security (RLS)**

Siempre habilita RLS en tus tablas para proteger los datos:

```sql
ALTER TABLE mi_tabla ENABLE ROW LEVEL SECURITY;
```

### 3. **Optimización de Queries**

Usa `.select()` específicos en lugar de `*`:

```javascript
// ❌ Malo
const { data } = await supabase.from('jobs').select('*')

// ✅ Bueno
const { data } = await supabase
  .from('jobs')
  .select('id, title, description, employer:profiles(name)')
```

### 4. **Suscripciones en Tiempo Real**

Limpia las suscripciones cuando el componente se desmonte:

```javascript
useEffect(() => {
  const subscription = supabase
    .channel('my-channel')
    .on('postgres_changes', { ... }, callback)
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

### 5. **Caché y Estado Local**

Usa React Query o SWR para cachear datos:

```javascript
// Con React Query
const { data, isLoading } = useQuery('jobs', () => getJobs())
```

### 6. **Validación de Usuario**

Siempre verifica que el usuario esté autenticado:

```javascript
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Usuario no autenticado')
```

### 7. **Variables de Entorno**

Nunca expongas tus claves en el código:

```javascript
// ❌ Malo
const supabase = createClient('https://...', 'clave-secreta')

// ✅ Bueno
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## 🎯 Próximos Pasos

1. ✅ Configurar variables de entorno
2. ✅ Actualizar `authService.js` (ya hecho)
3. 📝 Crear tablas en Supabase usando los SQL de arriba
4. 🔄 Actualizar los otros servicios usando los ejemplos
5. 🧪 Probar la integración
6. 🚀 ¡Lanzar tu app!

---

## 📖 Recursos Adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Guía de autenticación](https://supabase.com/docs/guides/auth)
- [Guía de base de datos](https://supabase.com/docs/guides/database)
- [Guía de almacenamiento](https://supabase.com/docs/guides/storage)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

¿Necesitas ayuda? Revisa la documentación o abre un issue en el repositorio. 🚀

