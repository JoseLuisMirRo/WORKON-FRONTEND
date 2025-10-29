# 🗄️ Estructura de Base de Datos - WorkOn (Supabase)

## 📊 Diagrama de Relaciones

```
auth.users (Supabase Auth)
    ↓
profiles (Usuarios del sistema)
    ├─→ proposals (employer_id) - Trabajos publicados
    ├─→ proposal_applicants (freelancer_id) - Aplicaciones a trabajos
    ├─→ chat_threads (user_a, user_b) - Conversaciones
    ├─→ portfolio_entries - Portafolio
    ├─→ work_history - Historial laboral
    ├─→ profile_areas - Áreas de especialización
    └─→ saved_proposals - Propuestas guardadas
```

---

## 📋 Tablas Principales

### 1. **profiles** - Usuarios del Sistema

Extiende la tabla de autenticación de Supabase con información del perfil.

```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,                    -- FK a auth.users(id)
  role app_role DEFAULT 'freelancer',     -- 'freelancer' | 'employer'
  full_name text,
  email text UNIQUE,
  wallet_address text UNIQUE,             -- Dirección de Stellar
  rating numeric DEFAULT 0.00,            -- Rating 0-5
  bio text,
  portfolio_summary text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Relaciones:**
- `id` → `auth.users(id)` (1:1)
- Tiene muchos `proposals` (como employer)
- Tiene muchos `proposal_applicants` (como freelancer)
- Tiene muchos `chat_threads` (como user_a o user_b)
- Tiene muchos `portfolio_entries`
- Tiene muchos `work_history`

---

### 2. **proposals** - Trabajos/Proyectos Publicados

Los employers publican propuestas de trabajo para que los freelancers apliquen.

```sql
CREATE TABLE public.proposals (
  id bigint PRIMARY KEY,
  title text NOT NULL,
  description text,
  total_payment numeric CHECK (total_payment >= 0),
  employer_id uuid NOT NULL,              -- FK a profiles(id)
  selected_freelancer_id uuid,            -- FK a profiles(id)
  status proposal_status DEFAULT 'publicada',
  tags jsonb DEFAULT '[]',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Estados posibles (proposal_status):**
- `publicada` - Abierta a aplicaciones
- `en_progreso` - Con freelancer asignado
- `completada` - Trabajo terminado
- `cancelada` - Cancelada

**Relaciones:**
- `employer_id` → `profiles(id)` (N:1)
- `selected_freelancer_id` → `profiles(id)` (N:1)
- Tiene muchos `proposal_applicants`
- Tiene muchos `milestones`

---

### 3. **proposal_applicants** - Aplicaciones a Propuestas

Freelancers que aplican a una propuesta específica.

```sql
CREATE TABLE public.proposal_applicants (
  proposal_id bigint NOT NULL,            -- FK a proposals(id)
  freelancer_id uuid NOT NULL,            -- FK a profiles(id)
  status proposal_applicant_status DEFAULT 'postulado',
  cover_letter text,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (proposal_id, freelancer_id)
);
```

**Estados posibles (proposal_applicant_status):**
- `postulado` - Aplicación enviada
- `aceptado` - Freelancer seleccionado
- `rechazado` - Aplicación rechazada
- `retirado` - Freelancer retiró su aplicación

**Relaciones:**
- `proposal_id` → `proposals(id)` (N:1)
- `freelancer_id` → `profiles(id)` (N:1)

---

### 4. **milestones** - Hitos de Pago

División del pago total en hitos verificables.

```sql
CREATE TABLE public.milestones (
  id bigint PRIMARY KEY,
  proposal_id bigint NOT NULL,            -- FK a proposals(id)
  title text NOT NULL,
  description text,
  amount numeric CHECK (amount >= 0),
  sort_order integer DEFAULT 1,
  status milestone_status DEFAULT 'pendiente',
  due_date date,
  created_at timestamp with time zone DEFAULT now()
);
```

**Estados posibles (milestone_status):**
- `pendiente` - No iniciado
- `en_progreso` - Trabajando en él
- `completado` - Terminado y pagado
- `rechazado` - No aceptado

**Relaciones:**
- `proposal_id` → `proposals(id)` (N:1)

---

### 5. **chat_threads** - Hilos de Conversación

Conversaciones entre dos usuarios (opcionalmente ligadas a una propuesta).

```sql
CREATE TABLE public.chat_threads (
  id bigint PRIMARY KEY,
  user_a uuid NOT NULL,                   -- FK a profiles(id)
  user_b uuid NOT NULL,                   -- FK a profiles(id)
  proposal_id bigint,                     -- FK a proposals(id) [OPCIONAL]
  created_at timestamp with time zone DEFAULT now()
);
```

**Relaciones:**
- `user_a` → `profiles(id)` (N:1)
- `user_b` → `profiles(id)` (N:1)
- `proposal_id` → `proposals(id)` (N:1) [Opcional]
- Tiene muchos `chat_messages`

---

### 6. **chat_messages** - Mensajes

Mensajes dentro de un hilo de conversación.

```sql
CREATE TABLE public.chat_messages (
  id bigint PRIMARY KEY,
  thread_id bigint NOT NULL,              -- FK a chat_threads(id)
  sender_id uuid NOT NULL,                -- FK a profiles(id)
  content text,
  created_at timestamp with time zone DEFAULT now()
);
```

**Relaciones:**
- `thread_id` → `chat_threads(id)` (N:1)
- `sender_id` → `profiles(id)` (N:1)
- Tiene muchos `chat_files`

---

### 7. **chat_files** - Archivos en Mensajes

Archivos adjuntos a mensajes del chat.

```sql
CREATE TABLE public.chat_files (
  id bigint PRIMARY KEY,
  message_id bigint NOT NULL,             -- FK a chat_messages(id)
  storage_path text NOT NULL,             -- Ruta en Supabase Storage
  mime_type text,
  uploaded_at timestamp with time zone DEFAULT now()
);
```

**Relaciones:**
- `message_id` → `chat_messages(id)` (N:1)

---

### 8. **areas** - Áreas de Especialización

Catálogo de áreas profesionales (diseño, desarrollo, marketing, etc.).

```sql
CREATE TABLE public.areas (
  id bigint PRIMARY KEY,
  name text NOT NULL UNIQUE
);
```

**Relaciones:**
- Tiene muchos `profile_areas`

---

### 9. **profile_areas** - Áreas de un Perfil

Relación many-to-many entre perfiles y áreas de especialización.

```sql
CREATE TABLE public.profile_areas (
  profile_id uuid NOT NULL,               -- FK a profiles(id)
  area_id bigint NOT NULL,                -- FK a areas(id)
  PRIMARY KEY (profile_id, area_id)
);
```

**Relaciones:**
- `profile_id` → `profiles(id)` (N:1)
- `area_id` → `areas(id)` (N:1)

---

### 10. **portfolio_entries** - Entradas del Portafolio

Proyectos destacados en el portafolio de un freelancer.

```sql
CREATE TABLE public.portfolio_entries (
  id bigint PRIMARY KEY,
  profile_id uuid NOT NULL,               -- FK a profiles(id)
  title text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now()
);
```

**Relaciones:**
- `profile_id` → `profiles(id)` (N:1)
- Tiene muchos `portfolio_files`

---

### 11. **portfolio_files** - Archivos del Portafolio

Imágenes, videos o documentos del portafolio.

```sql
CREATE TABLE public.portfolio_files (
  id bigint PRIMARY KEY,
  entry_id bigint NOT NULL,               -- FK a portfolio_entries(id)
  storage_path text NOT NULL,             -- Ruta en Supabase Storage
  mime_type text,
  uploaded_at timestamp with time zone DEFAULT now()
);
```

**Relaciones:**
- `entry_id` → `portfolio_entries(id)` (N:1)

---

### 12. **work_history** - Historial Laboral

Experiencia laboral previa del freelancer.

```sql
CREATE TABLE public.work_history (
  id bigint PRIMARY KEY,
  profile_id uuid NOT NULL,               -- FK a profiles(id)
  title text NOT NULL,
  description text,
  finished_at date,
  created_at timestamp with time zone DEFAULT now()
);
```

**Relaciones:**
- `profile_id` → `profiles(id)` (N:1)

---

### 13. **saved_proposals** - Propuestas Guardadas

Propuestas que un usuario ha marcado como favoritas/guardadas.

```sql
CREATE TABLE public.saved_proposals (
  profile_id uuid NOT NULL,               -- FK a profiles(id)
  proposal_id bigint NOT NULL,            -- FK a proposals(id)
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (profile_id, proposal_id)
);
```

**Relaciones:**
- `profile_id` → `profiles(id)` (N:1)
- `proposal_id` → `proposals(id)` (N:1)

---

## 🔑 Enums (Tipos Personalizados)

### app_role
```sql
'freelancer' | 'employer'
```

### proposal_status
```sql
'publicada' | 'en_progreso' | 'completada' | 'cancelada'
```

### proposal_applicant_status
```sql
'postulado' | 'aceptado' | 'rechazado' | 'retirado'
```

### milestone_status
```sql
'pendiente' | 'en_progreso' | 'completado' | 'rechazado'
```

---

## 🔄 Flujo de Trabajo Típico

### Para un Employer:

1. **Crear propuesta** → INSERT en `proposals`
2. **Agregar hitos** → INSERT en `milestones`
3. **Recibir aplicaciones** → Freelancers crean en `proposal_applicants`
4. **Seleccionar freelancer** → UPDATE `proposals.selected_freelancer_id` y `proposal_applicants.status = 'aceptado'`
5. **Iniciar chat** → INSERT en `chat_threads` vinculado a la propuesta
6. **Completar hitos** → UPDATE `milestones.status = 'completado'`
7. **Finalizar trabajo** → UPDATE `proposals.status = 'completada'`

### Para un Freelancer:

1. **Ver propuestas** → SELECT en `proposals WHERE status = 'publicada'`
2. **Guardar propuesta** → INSERT en `saved_proposals`
3. **Aplicar a propuesta** → INSERT en `proposal_applicants`
4. **Recibir aceptación** → `proposal_applicants.status = 'aceptado'`
5. **Chatear con employer** → INSERT en `chat_messages`
6. **Completar hitos** → UPDATE `milestones.status`
7. **Actualizar portafolio** → INSERT en `portfolio_entries`

---

## 🔐 Políticas de Seguridad (RLS)

Asegúrate de tener Row Level Security (RLS) activado en todas las tablas para:

- **profiles**: Los usuarios pueden ver todos los perfiles, pero solo editar el suyo
- **proposals**: Públicas para lectura, solo el employer puede editar las suyas
- **proposal_applicants**: Freelancers ven las suyas, employers ven las de sus propuestas
- **milestones**: Solo visibles para el employer y el freelancer asignado
- **chat_threads/messages**: Solo los participantes (user_a y user_b) pueden acceder
- **portfolio**: Público para lectura, solo el owner puede editar

---

## 📝 Notas Importantes

1. **IDs:**
   - `profiles.id` es UUID (mismo que auth.users)
   - El resto de tablas usa `bigint` con secuencias

2. **Timestamps:**
   - Todas las tablas principales tienen `created_at`
   - `profiles` y `proposals` tienen también `updated_at`

3. **Storage:**
   - Los archivos se guardan en Supabase Storage
   - Las tablas solo almacenan la ruta (`storage_path`)

4. **JSONB:**
   - `proposals.tags` usa JSONB para flexibilidad en etiquetas

5. **Validaciones:**
   - `rating` está entre 0-5
   - `total_payment` y `amount` son >= 0
   - `email` y `wallet_address` son UNIQUE

---

## 🎯 Queries Útiles para el Frontend

### Obtener propuestas con información del employer:
```sql
SELECT 
  p.*,
  prof.full_name as employer_name,
  prof.rating as employer_rating
FROM proposals p
JOIN profiles prof ON p.employer_id = prof.id
WHERE p.status = 'publicada'
ORDER BY p.created_at DESC;
```

### Obtener aplicantes de una propuesta:
```sql
SELECT 
  pa.*,
  prof.full_name,
  prof.rating,
  prof.bio
FROM proposal_applicants pa
JOIN profiles prof ON pa.freelancer_id = prof.id
WHERE pa.proposal_id = $1
ORDER BY pa.created_at DESC;
```

### Obtener mensajes de un chat con sender info:
```sql
SELECT 
  cm.*,
  prof.full_name as sender_name
FROM chat_messages cm
JOIN profiles prof ON cm.sender_id = prof.id
WHERE cm.thread_id = $1
ORDER BY cm.created_at ASC;
```

---

**Esta estructura está optimizada para Supabase con autenticación, storage y RLS integrados. 🚀**

