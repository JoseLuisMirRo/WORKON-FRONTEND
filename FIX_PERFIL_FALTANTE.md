# 🔧 Solución: Error de Perfil Faltante

## ❌ Error Recibido

```json
{
  "code": "23503",
  "details": "Key is not present in table \"profiles\".",
  "message": "insert or update on table \"proposal_applicants\" violates foreign key constraint \"proposal_applicants_freelancer_id_fkey\""
}
```

**Causa:** El usuario existe en `auth.users` pero NO tiene un registro correspondiente en la tabla `profiles`.

---

## ✅ Soluciones Implementadas

### 1. **Trigger Automático en Supabase** (RECOMENDADO)

He creado un archivo `SUPABASE_TRIGGER.sql` que debes ejecutar en Supabase.

**Pasos para implementar:**

1. Ve a **Supabase Dashboard** → Tu proyecto
2. Haz clic en **SQL Editor** en el menú lateral
3. Haz clic en **"New query"**
4. Copia y pega el contenido de `SUPABASE_TRIGGER.sql`
5. Haz clic en **RUN** (▶️)

**Qué hace:**
- Crea un trigger que se ejecuta automáticamente cuando alguien se registra
- Crea el perfil en `profiles` automáticamente
- Rol por defecto: `'freelancer'`
- Si hay metadatos, usa el `full_name`, sino usa el email

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'freelancer',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

### 2. **Función Helper en el Frontend**

He agregado una función `ensureProfileExists()` en `feedService.js` que:

- ✅ Verifica si existe el perfil antes de aplicar a un trabajo
- ✅ Si no existe, lo crea automáticamente
- ✅ Usa los datos del usuario autenticado
- ✅ Manejo de errores mejorado

**Código agregado:**

```javascript
const ensureProfileExists = async (userId) => {
  // Verificar si existe
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();
  
  if (existingProfile) return true;
  
  // Crear si no existe
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from('profiles')
    .insert([{
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email,
      role: user.user_metadata?.role || 'freelancer'
    }]);
  
  return !error;
};
```

Esta función se llama automáticamente en `applyToJob()` antes de insertar la aplicación.

---

### 3. **Actualización de `applyToJob()`**

Ahora la función:

```javascript
export const applyToJob = async (applicationData) => {
  const { jobId, freelancerId, coverLetter } = applicationData;
  
  // Validaciones...
  
  // ✅ NUEVO: Verificar/crear perfil
  const profileExists = await ensureProfileExists(freelancerId);
  if (!profileExists) {
    throw new Error('No se pudo verificar tu perfil...');
  }
  
  // Insertar aplicación...
  const { data, error } = await supabase
    .from('proposal_applicants')
    .insert([...]);
  
  // ✅ NUEVO: Mejor manejo de error 23503
  if (error?.code === '23503') {
    throw new Error('Tu perfil no está completamente configurado...');
  }
};
```

---

## 🔍 Verificar el Problema Actual

### Opción A: Revisar en Supabase

1. Ve a **Table Editor** → **profiles**
2. Busca si existe un registro con el ID del usuario actual
3. Si NO existe, ese es el problema

### Opción B: Query SQL

Ejecuta esto en **SQL Editor**:

```sql
-- Ver usuarios en auth sin perfil
SELECT 
  au.id,
  au.email,
  au.created_at,
  p.id as profile_id
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
```

Si este query devuelve resultados, esos usuarios **NO tienen perfil**.

---

## 🔧 Solucionar Usuarios Existentes

Si ya tienes usuarios sin perfil, ejecuta esto en **SQL Editor**:

```sql
-- Crear perfiles para usuarios existentes que no los tienen
INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'freelancer')::text,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
```

Este query crea perfiles para todos los usuarios que no los tienen.

---

## 📋 Checklist de Solución

### Paso 1: Instalar el Trigger (CRÍTICO)
- [ ] Abrir Supabase → SQL Editor
- [ ] Copiar contenido de `SUPABASE_TRIGGER.sql`
- [ ] Ejecutar el SQL
- [ ] Verificar mensaje de éxito

### Paso 2: Arreglar Usuarios Existentes
- [ ] Ejecutar query para encontrar usuarios sin perfil
- [ ] Ejecutar query para crear perfiles faltantes
- [ ] Verificar que todos tengan perfil

### Paso 3: Probar
- [ ] Intentar registrar un nuevo usuario
- [ ] Verificar que se cree automáticamente en `profiles`
- [ ] Intentar aplicar a un trabajo
- [ ] Verificar que funcione sin errores

---

## 🧪 Testing

### Test 1: Nuevo Registro
```javascript
// Registrar usuario
await register({
  email: "test@example.com",
  password: "password123",
  name: "Test User",
  role: "freelancer"
});

// Verificar en Supabase:
// 1. auth.users → debe existir el usuario
// 2. profiles → debe existir el perfil (gracias al trigger)
```

### Test 2: Aplicar a Trabajo
```javascript
// Con usuario autenticado
await applyToJob({
  jobId: "123",
  freelancerId: user.id,
  coverLetter: "Mi carta de más de 50 caracteres..."
});

// Debe funcionar sin error 23503
```

---

## 🚨 Si Sigue Fallando

### Opción 1: Verificar RLS (Row Level Security)

El trigger necesita permisos para insertar en `profiles`. Ejecuta:

```sql
-- Dar permisos al trigger
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permitir inserciones desde el trigger
CREATE POLICY "Allow trigger to insert profiles" ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- O temporalmente desactivar RLS para debugging
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

### Opción 2: Verificar Manualmente

```sql
-- Ver el usuario actual
SELECT * FROM auth.users WHERE email = 'tu-email@example.com';

-- Ver si tiene perfil
SELECT * FROM public.profiles WHERE id = 'uuid-del-usuario';

-- Crear perfil manualmente
INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
VALUES (
  'uuid-del-usuario',
  'tu-email@example.com',
  'freelancer',
  'Tu Nombre',
  NOW(),
  NOW()
);
```

### Opción 3: Logs en Frontend

Agrega esto en `applyToJob()` para debugging:

```javascript
console.log('User ID:', freelancerId);
console.log('Verificando perfil...');

const profileExists = await ensureProfileExists(freelancerId);
console.log('Perfil existe:', profileExists);
```

---

## 📝 Resumen

**Causa del Error:**
- Usuario registrado en `auth.users` ✅
- Perfil NO creado en `profiles` ❌
- Foreign key constraint falla al insertar en `proposal_applicants`

**Solución Permanente:**
1. ✅ Trigger que crea perfiles automáticamente
2. ✅ Función helper que verifica/crea perfiles
3. ✅ Mejor manejo de errores en el frontend

**Resultado:**
- Nuevos usuarios → perfil automático
- Usuarios existentes → se crea al primer uso
- Error 23503 → mensaje claro al usuario

---

## 🎯 Próximos Pasos Recomendados

1. **Política de Employer:**
   - Si un usuario selecciona "employer" en el registro
   - Actualizar su `role` en `profiles` a `'employer'`

2. **Validación de Perfiles:**
   - Agregar ruta `/completar-perfil` para nuevos usuarios
   - Redirigir ahí si el perfil está incompleto

3. **Mejora de UX:**
   - Mostrar loading mientras se verifica el perfil
   - Mensaje claro si falta completar información

---

**¡Con estas soluciones, el error 23503 debería estar resuelto! 🎉**

