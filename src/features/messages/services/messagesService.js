// Mock data para mensajes
const mockConversations = [
  {
    id: "1",
    user: {
      name: "María García",
      avatar: "/placeholder.svg",
      online: true,
    },
    jobTitle: "Desarrollador Full Stack Senior",
    lastMessage: "Perfecto, mañana te envío el avance del backend",
    timestamp: "2025-01-29T10:30:00",
    unread: 2,
  },
  {
    id: "2",
    user: {
      name: "Carlos Rodríguez",
      avatar: "/placeholder.svg",
      online: false,
    },
    jobTitle: "Diseñador UI/UX para App Mobile",
    lastMessage: "Gracias por tu excelente trabajo!",
    timestamp: "2025-01-28T15:45:00",
    unread: 0,
  },
  {
    id: "3",
    user: {
      name: "Ana Martínez",
      avatar: "/placeholder.svg",
      online: true,
    },
    jobTitle: "Desarrollador Blockchain Soroban",
    lastMessage: "¿Cuándo podrías empezar con el proyecto?",
    timestamp: "2025-01-28T09:15:00",
    unread: 1,
  },
  {
    id: "4",
    user: {
      name: "Pedro López",
      avatar: "/placeholder.svg",
      online: false,
    },
    jobTitle: "Content Writer & SEO Specialist",
    lastMessage: "Los artículos están listos para revisión",
    timestamp: "2025-01-27T18:20:00",
    unread: 0,
  },
]

const mockMessages = {
  "1": [
    {
      id: "1",
      sender: "other",
      content: "Hola! Vi tu aplicación para el proyecto. Tu perfil se ve muy bien.",
      timestamp: "2025-01-29T09:00:00",
    },
    {
      id: "2",
      sender: "me",
      content: "Muchas gracias! Estoy muy interesado en el proyecto. Tengo experiencia similar en otros proyectos.",
      timestamp: "2025-01-29T09:15:00",
    },
    {
      id: "3",
      sender: "other",
      content: "Excelente. ¿Podrías empezar esta semana?",
      timestamp: "2025-01-29T09:30:00",
    },
    {
      id: "4",
      sender: "me",
      content: "Sí, sin problema. ¿Cuándo podemos tener una llamada para discutir los detalles?",
      timestamp: "2025-01-29T09:45:00",
    },
    {
      id: "5",
      sender: "other",
      content: "Qué te parece mañana a las 10am?",
      timestamp: "2025-01-29T10:00:00",
    },
    {
      id: "6",
      sender: "me",
      content: "Perfecto, mañana te envío el avance del backend",
      timestamp: "2025-01-29T10:30:00",
    },
  ],
}

/**
 * Obtiene todas las conversaciones
 * @returns {Promise<Array>} Lista de conversaciones
 */
export const fetchConversations = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockConversations
}

/**
 * Obtiene los mensajes de una conversación
 * @param {string} conversationId - ID de la conversación
 * @returns {Promise<Array>} Lista de mensajes
 */
export const fetchMessages = async (conversationId) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockMessages[conversationId] || []
}

/**
 * Envía un mensaje
 * @param {string} conversationId - ID de la conversación
 * @param {string} content - Contenido del mensaje
 * @returns {Promise<Object>} Mensaje enviado
 */
export const sendMessage = async (conversationId, content) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const newMessage = {
    id: Date.now().toString(),
    sender: "me",
    content,
    timestamp: new Date().toISOString(),
  }
  
  console.log(`Mensaje enviado en conversación ${conversationId}:`, content)
  return newMessage
}

/**
 * Marca mensajes como leídos
 * @param {string} conversationId - ID de la conversación
 * @returns {Promise<boolean>} Éxito
 */
export const markAsRead = async (conversationId) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  console.log(`Mensajes marcados como leídos en conversación ${conversationId}`)
  return true
}

