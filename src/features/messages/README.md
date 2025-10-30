# 💬 Sistema de Chat en Tiempo Real

Sistema de mensajería en tiempo real implementado con Supabase para comunicación entre empleadores y freelancers.

## 🚀 Características

- ✅ **Mensajería en tiempo real** usando Supabase Realtime
- ✅ **Actualizaciones optimistas** para UX fluida
- ✅ **Scroll automático** a nuevos mensajes
- ✅ **Múltiples conversaciones** organizadas por último mensaje
- ✅ **Integración con propuestas** (trabajos)
- ✅ **Estado de usuario** (online/offline - preparado para implementar)
- ✅ **Indicadores de lectura** (preparado para implementar)

## 📁 Estructura del Feature

```
messages/
├── controllers/
│   └── useMessagesController.js    # Lógica principal del chat con hooks
├── services/
│   └── messagesService.js          # Servicios de Supabase para mensajes
├── hooks/
│   └── useStartChat.js             # Hook para iniciar chats desde cualquier lugar
├── ui/
│   ├── MessagesPage.jsx            # Página principal de mensajes
│   ├── ChatView.jsx                # Vista del chat actual
│   ├── ConversationList.jsx        # Lista de conversaciones
│   └── MessageInput.jsx            # Input para escribir mensajes
└── index.js                        # Exports del feature
```

## 🔧 Configuración

### 1. Base de Datos Supabase

Asegúrate de tener las siguientes tablas en Supabase:

**chat_threads**: Hilos de conversación
```sql
id (bigint)
user_a (uuid) → profiles(id)
user_b (uuid) → profiles(id)
proposal_id (bigint) → proposals(id) [opcional]
created_at (timestamp)
```

**chat_messages**: Mensajes individuales
```sql
id (bigint)
thread_id (bigint) → chat_threads(id)
sender_id (uuid) → profiles(id)
content (text)
created_at (timestamp)
```

### 2. Habilitar Realtime en Supabase

En tu proyecto de Supabase:
1. Ve a **Database → Replication**
2. Habilita realtime para las tablas:
   - `chat_threads`
   - `chat_messages`

### 3. Políticas RLS (Row Level Security)

Asegúrate de tener políticas que permitan:
- Los usuarios pueden ver threads donde son `user_a` o `user_b`
- Los usuarios pueden insertar mensajes en threads donde participan
- Los usuarios pueden leer mensajes de threads donde participan

## 📝 Uso

### Página de Mensajes

La página está en `/messages` y se maneja automáticamente:

```jsx
import { MessagesPage } from '../features/messages'

// En tus rutas
<Route path="/messages" element={<MessagesPage />} />
```

### Iniciar Chat desde Otra Parte

Usa el hook `useStartChat` para abrir un chat con cualquier usuario:

```jsx
import { useStartChat } from '../features/messages'

function JobCard({ job, applicant }) {
  const { startChat } = useStartChat()

  const handleContactFreelancer = async () => {
    try {
      await startChat(applicant.id, job.id)
      // Automáticamente navega a /messages con el chat abierto
    } catch (error) {
      console.error('Error al iniciar chat:', error)
    }
  }

  return (
    <button onClick={handleContactFreelancer}>
      💬 Contactar Freelancer
    </button>
  )
}
```

### Ejemplo: Contactar desde el Feed

```jsx
import { useStartChat } from '../features/messages'

function JobDetailsModal({ job }) {
  const { startChat } = useStartChat()

  return (
    <div>
      <h2>{job.title}</h2>
      <p>Publicado por: {job.employer_name}</p>
      <button onClick={() => startChat(job.employer_id, job.id)}>
        💬 Contactar al Empleador
      </button>
    </div>
  )
}
```

### Ejemplo: Desde Aplicantes

```jsx
import { useStartChat } from '../features/messages'

function ApplicantCard({ applicant, proposalId }) {
  const { startChat } = useStartChat()

  return (
    <div>
      <h3>{applicant.name}</h3>
      <button onClick={() => startChat(applicant.id, proposalId)}>
        💬 Enviar Mensaje
      </button>
    </div>
  )
}
```

## 🔄 Tiempo Real

El sistema se suscribe automáticamente a:

1. **Nuevos mensajes** en el thread actual
   - Los mensajes aparecen instantáneamente sin recargar
   - Scroll automático al nuevo mensaje
   
2. **Cambios en threads**
   - Nuevas conversaciones aparecen automáticamente
   - Se actualiza el último mensaje de cada conversación

## 🎨 Componentes UI

### MessagesPage
Página principal que contiene todo el sistema de chat.

**Props**: Ninguna (usa hooks internos)

### ChatView
Muestra los mensajes de una conversación.

**Props**:
- `conversation`: Objeto de la conversación seleccionada
- `messages`: Array de mensajes
- `messagesEndRef`: Ref para scroll automático

### ConversationList
Lista todas las conversaciones del usuario.

**Props**:
- `conversations`: Array de conversaciones
- `selectedConversation`: Conversación actualmente seleccionada
- `onSelect`: Callback cuando se selecciona una conversación

### MessageInput
Input para escribir y enviar mensajes.

**Props**:
- `onSend`: Callback cuando se envía un mensaje
- `disabled`: Si está enviando o no

## 📊 Estado y Datos

### Estructura de Conversation
```javascript
{
  id: "123",                    // ID del thread
  userId: "user-uuid",          // ID del otro usuario
  name: "María García",         // Nombre del otro usuario
  avatar: "/path/to/avatar",    // Avatar (placeholder por ahora)
  online: false,                // Estado online (preparado)
  verified: true,               // Si tiene rating >= 4.0
  jobTitle: "Título del Job",   // Título de la propuesta o "Chat General"
  lastMessage: "Hola...",       // Último mensaje
  lastMessageTime: "10:30",     // Tiempo formateado
  timestamp: "2025-01-29...",   // ISO timestamp
  unread: 0,                    // Mensajes no leídos (preparado)
  proposalId: 123               // ID de propuesta si aplica
}
```

### Estructura de Message
```javascript
{
  id: "456",                    // ID del mensaje
  sender: "me" | "other",       // Quién lo envió
  content: "Hola, cómo estás",  // Contenido
  timestamp: "10:30",           // Hora formateada
  sender_id: "user-uuid"        // ID del remitente
}
```

## 🔐 Autenticación

El sistema usa `useAuth()` para:
- Obtener el usuario actual
- Filtrar mensajes propios vs ajenos
- Validar permisos antes de enviar

## ⚡ Optimizaciones

### Actualización Optimista
Los mensajes se muestran inmediatamente antes de confirmarse en la BD:
1. Mensaje aparece con ID temporal
2. Se envía a Supabase
3. Se reemplaza el temporal con el mensaje real

### Suscripciones Eficientes
- Se limpia la suscripción al cambiar de conversación
- Solo se suscribe al thread activo
- Evita duplicados filtrando mensajes propios

### Scroll Inteligente
- Scroll automático solo cuando hay mensajes nuevos
- Smooth scroll para mejor UX
- Mantiene posición al cargar mensajes antiguos

## 🚧 Mejoras Futuras

### Corto Plazo
- [ ] Mensajes no leídos persistentes (tabla `read_status`)
- [ ] Estado de presencia online (Supabase Presence)
- [ ] Typing indicators (está escribiendo...)
- [ ] Adjuntar archivos usando Supabase Storage

### Mediano Plazo
- [ ] Búsqueda en mensajes
- [ ] Paginación de mensajes (cargar más antiguos)
- [ ] Borrar/editar mensajes
- [ ] Reacciones a mensajes
- [ ] Notificaciones push

### Largo Plazo
- [ ] Mensajes de voz
- [ ] Llamadas de video/audio
- [ ] Compartir contratos directamente
- [ ] Encriptación end-to-end

## 🐛 Debugging

### Los mensajes no aparecen en tiempo real

1. Verifica que Realtime esté habilitado en Supabase
2. Revisa la consola del navegador para errores de suscripción
3. Verifica las políticas RLS

### No puedo ver conversaciones

1. Verifica que exista un thread en `chat_threads`
2. Verifica que tu `user_id` esté en `user_a` o `user_b`
3. Revisa políticas RLS de lectura

### Error al enviar mensajes

1. Verifica permisos de inserción en `chat_messages`
2. Verifica que el `thread_id` sea válido
3. Revisa que el usuario esté autenticado

## 📚 Recursos

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**💡 Tip**: Para testing, puedes crear threads manualmente en Supabase Studio insertando en `chat_threads` con dos usuarios diferentes.



