import { supabase } from '../../../lib/supabaseClient'

/**
 * Formatea el tiempo relativo para mostrar en la lista de conversaciones
 */
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const messageDate = new Date(timestamp)
  const diffInMs = now - messageDate
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'Ahora'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInHours < 24) {
    const hours = messageDate.getHours()
    const minutes = messageDate.getMinutes()
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return `${diffInDays} días`
  
  return messageDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
}

/**
 * Formatea el timestamp del mensaje para mostrar en el chat
 */
const formatMessageTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Obtiene todas las conversaciones del usuario actual
 * @param {string} currentUserId - ID del usuario actual
 * @returns {Promise<Array>} Lista de conversaciones
 */
export const fetchConversations = async (currentUserId) => {
  try {
    if (!currentUserId) {
      throw new Error('Usuario no autenticado')
    }

    // Obtener todos los threads donde el usuario participa
    const { data: threads, error: threadsError } = await supabase
      .from('chat_threads')
      .select(`
        id,
        user_a,
        user_b,
        proposal_id,
        created_at,
        proposals (
          id,
          title
        )
      `)
      .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
      .order('created_at', { ascending: false })

    if (threadsError) throw threadsError

    if (!threads || threads.length === 0) {
      return []
    }

    // Para cada thread, obtener información del otro usuario
    const conversationsPromises = threads.map(async (thread) => {
      const otherUserId = thread.user_a === currentUserId ? thread.user_b : thread.user_a

      // Obtener perfil del otro usuario
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, rating, bio')
        .eq('id', otherUserId)
        .single()

      if (profileError) {
        console.error('Error obteniendo perfil:', profileError)
        return null
      }

      // Obtener el último mensaje del thread
      const { data: lastMessage, error: messageError } = await supabase
        .from('chat_messages')
        .select('content, created_at, sender_id')
        .eq('thread_id', thread.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Contar mensajes no leídos (esto se puede implementar con una tabla adicional)
      // Por ahora dejamos unread en 0
      const unread = 0

      return {
        id: thread.id.toString(),
        userId: otherUserId,
        name: profile.full_name || profile.email || 'Usuario',
        avatar: `/placeholder.svg?height=48&width=48`,
        online: false, // Esto se puede implementar con presencia en tiempo real
        verified: profile.rating >= 4.0,
        jobTitle: thread.proposals?.title || 'Chat General',
        lastMessage: lastMessage?.content || 'Sin mensajes',
        lastMessageTime: formatRelativeTime(lastMessage?.created_at),
        timestamp: lastMessage?.created_at || thread.created_at,
        unread,
        proposalId: thread.proposal_id,
      }
    })

    const conversations = await Promise.all(conversationsPromises)
    
    // Filtrar nulls y ordenar por timestamp
    return conversations
      .filter(conv => conv !== null)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  } catch (error) {
    console.error('Error obteniendo conversaciones:', error)
    throw error
  }
}

/**
 * Obtiene los mensajes de una conversación
 * @param {string} threadId - ID del thread
 * @param {string} currentUserId - ID del usuario actual
 * @returns {Promise<Array>} Lista de mensajes
 */
export const fetchMessages = async (threadId, currentUserId) => {
  try {
    if (!threadId || !currentUserId) {
      throw new Error('Thread ID o User ID no proporcionados')
    }

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        sender_id,
        content,
        created_at,
        profiles:sender_id (
          full_name,
          email
        )
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return messages.map(msg => ({
      id: msg.id.toString(),
      sender: msg.sender_id === currentUserId ? 'me' : 'other',
      content: msg.content,
      timestamp: formatMessageTime(msg.created_at),
      sender_id: msg.sender_id,
      sender_name: msg.profiles?.full_name || msg.profiles?.email || 'Usuario',
    }))
  } catch (error) {
    console.error('Error obteniendo mensajes:', error)
    throw error
  }
}

/**
 * Envía un mensaje
 * @param {string} threadId - ID del thread
 * @param {string} content - Contenido del mensaje
 * @param {string} senderId - ID del usuario que envía
 * @returns {Promise<Object>} Mensaje enviado
 */
export const sendMessage = async (threadId, content, senderId) => {
  try {
    if (!threadId || !content || !senderId) {
      throw new Error('Faltan parámetros requeridos')
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: threadId,
        sender_id: senderId,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id.toString(),
      sender: 'me',
      content: data.content,
      timestamp: formatMessageTime(data.created_at),
      sender_id: data.sender_id,
    }
  } catch (error) {
    console.error('Error enviando mensaje:', error)
    throw error
  }
}

/**
 * Crea o encuentra un thread entre dos usuarios
 * @param {string} userA - ID del primer usuario
 * @param {string} userB - ID del segundo usuario
 * @param {number} proposalId - ID de la propuesta (opcional)
 * @returns {Promise<Object>} Thread creado o encontrado
 */
export const createOrFindThread = async (userA, userB, proposalId = null) => {
  try {
    if (!userA || !userB) {
      throw new Error('Se requieren ambos usuarios')
    }

    // Buscar thread existente
    const { data: existingThreads, error: searchError } = await supabase
      .from('chat_threads')
      .select('*')
      .or(`and(user_a.eq.${userA},user_b.eq.${userB}),and(user_a.eq.${userB},user_b.eq.${userA})`)

    if (searchError) throw searchError

    if (existingThreads && existingThreads.length > 0) {
      return existingThreads[0]
    }

    // Crear nuevo thread
    const { data: newThread, error: createError } = await supabase
      .from('chat_threads')
      .insert({
        user_a: userA,
        user_b: userB,
        proposal_id: proposalId,
      })
      .select()
      .single()

    if (createError) throw createError

    return newThread
  } catch (error) {
    console.error('Error creando/encontrando thread:', error)
    throw error
  }
}

/**
 * Suscribirse a nuevos mensajes en un thread
 * @param {string} threadId - ID del thread
 * @param {Function} callback - Función a llamar cuando llegue un nuevo mensaje
 * @returns {Object} Suscripción de Supabase
 */
export const subscribeToMessages = (threadId, callback) => {
  const subscription = supabase
    .channel(`chat_messages:${threadId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return subscription
}

/**
 * Suscribirse a cambios en threads del usuario
 * @param {string} userId - ID del usuario
 * @param {Function} callback - Función a llamar cuando haya cambios
 * @returns {Object} Suscripción de Supabase
 */
export const subscribeToThreads = (userId, callback) => {
  const subscription = supabase
    .channel(`chat_threads:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_threads',
      },
      (payload) => {
        // Solo notificar si el usuario está involucrado
        if (
          payload.new?.user_a === userId ||
          payload.new?.user_b === userId ||
          payload.old?.user_a === userId ||
          payload.old?.user_b === userId
        ) {
          callback(payload)
        }
      }
    )
    .subscribe()

  return subscription
}

/**
 * Marca mensajes como leídos (placeholder para implementación futura)
 * @param {string} threadId - ID del thread
 * @returns {Promise<boolean>} Éxito
 */
export const markAsRead = async (threadId) => {
  // TODO: Implementar tabla de mensajes_leídos
  console.log(`Mensajes marcados como leídos en thread ${threadId}`)
  return true
}

