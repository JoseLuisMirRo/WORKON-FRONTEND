# ⚡ Guía Rápida de Supabase

## 🚀 Inicio Rápido (5 minutos)

### Paso 1: Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

**¿Dónde obtengo estas credenciales?**
1. Ve a [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a **Settings** → **API**
4. Copia la **URL** y la **anon public** key

### Paso 2: Crear las Tablas

Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  user_type TEXT CHECK (user_type IN ('freelancer', 'employer')),
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  company_name TEXT,
  company_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de trabajos
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

-- Tabla de aplicaciones
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

-- Tabla de mensajes
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Los perfiles son públicos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden actualizar su perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Los usuarios pueden crear su perfil" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para jobs
CREATE POLICY "Los trabajos son públicos" ON jobs FOR SELECT USING (true);
CREATE POLICY "Los empleadores pueden crear trabajos" ON jobs 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'employer')
  );
CREATE POLICY "Los empleadores pueden actualizar sus trabajos" ON jobs 
  FOR UPDATE USING (employer_id = auth.uid());

-- Políticas para applications
CREATE POLICY "Los freelancers pueden ver sus aplicaciones" ON applications 
  FOR SELECT USING (freelancer_id = auth.uid());
CREATE POLICY "Los empleadores pueden ver aplicaciones a sus trabajos" ON applications 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM jobs WHERE id = applications.job_id AND employer_id = auth.uid())
  );
CREATE POLICY "Los freelancers pueden aplicar a trabajos" ON applications 
  FOR INSERT WITH CHECK (freelancer_id = auth.uid());
CREATE POLICY "Los empleadores pueden actualizar aplicaciones" ON applications 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM jobs WHERE id = applications.job_id AND employer_id = auth.uid())
  );

-- Políticas para messages
CREATE POLICY "Los usuarios pueden ver sus mensajes" ON messages 
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Los usuarios pueden enviar mensajes" ON messages 
  FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Los usuarios pueden actualizar sus mensajes" ON messages 
  FOR UPDATE USING (receiver_id = auth.uid());
```

### Paso 3: Reiniciar el Servidor

```bash
npm run dev
```

## ✅ ¡Listo!

Tu frontend ya está conectado con Supabase. La autenticación ya funciona automáticamente.

### 🧪 Probar la Integración

1. Abre tu app en el navegador
2. Ve a la página de registro
3. Crea una cuenta nueva
4. Verifica en Supabase → **Authentication** que el usuario se creó
5. Verifica en Supabase → **Table Editor** → **profiles** que el perfil se creó

## 📚 Próximos Pasos

Para implementar las demás funcionalidades (feed de trabajos, mensajes, etc.), consulta:

- **SUPABASE_INTEGRATION.md** - Guía completa con ejemplos de código para cada servicio

## 🆘 Solución de Problemas

### Error: "Invalid API Key"
- Verifica que copiaste correctamente las credenciales
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### Error: "Row Level Security"
- Verifica que ejecutaste todos los SQL de políticas
- En desarrollo, puedes desactivar RLS temporalmente (no recomendado en producción)

### Los usuarios no se crean en la tabla profiles
- Verifica que la política de INSERT en profiles esté creada
- Revisa la consola del navegador para ver errores

## 🔗 Enlaces Útiles

- [Documentación completa](./SUPABASE_INTEGRATION.md)
- [Supabase Docs](https://supabase.com/docs)
- [Dashboard de Supabase](https://app.supabase.com)

