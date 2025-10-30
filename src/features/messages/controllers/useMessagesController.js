import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import * as messagesService from '../services/messagesService'

/**
 * Controller para manejar la lógica de mensajes con tiempo real
 * @returns {Object} Estado y funciones
 */
export const useMessagesController = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState(null)
  
  // Referencias para las suscripciones
  const messageSubscriptionRef = useRef(null)
  const threadSubscriptionRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Cargar conversaciones
  const loadConversations = useCallback(async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)
      const data = await messagesService.fetchConversations(user.id)
      setConversations(data)
      
      // Si hay un threadId en el state de navegación, seleccionarlo
      const selectedThreadId = location.state?.selectedThreadId
      if (selectedThreadId && data.length > 0) {
        const threadToSelect = data.find(conv => conv.id === selectedThreadId.toString())
        if (threadToSelect) {
          setSelectedConversation(threadToSelect)
          return
        }
      }
      
      // Auto-select first conversation if none selected
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0])
      }
    } catch (error) {
      console.error('Error cargando conversaciones:', error)
      setError('Error al cargar las conversaciones')
    } finally {
      setLoading(false)
    }
  }, [user?.id, selectedConversation, location.state?.selectedThreadId])

  // Cargar mensajes de una conversación
  const loadMessages = useCallback(async (conversationId) => {
    if (!user?.id || !conversationId) return

    try {
      const data = await messagesService.fetchMessages(conversationId, user.id)
      setMessages(data)
      
      // Mark as read
      await messagesService.markAsRead(conversationId)
      
      // Update conversation unread count
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId ? { ...conv, unread: 0 } : conv
        )
      )

      // Scroll to bottom after loading messages
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Error cargando mensajes:', error)
      setError('Error al cargar los mensajes')
    }
  }, [user?.id])

  // Suscribirse a mensajes en tiempo real
  const subscribeToCurrentThread = useCallback((threadId) => {
    if (!threadId || !user?.id) return

    // Limpiar suscripción anterior si existe
    if (messageSubscriptionRef.current) {
      messageSubscriptionRef.current.unsubscribe()
    }

    // Nueva suscripción
    messageSubscriptionRef.current = messagesService.subscribeToMessages(
      threadId,
      (newMessage) => {
        // Solo agregar el mensaje si no es del usuario actual
        // (los mensajes propios ya se agregan optimísticamente)
        if (newMessage.sender_id !== user.id) {
          const formattedMessage = {
            id: newMessage.id.toString(),
            sender: 'other',
            content: newMessage.content,
            timestamp: new Date(newMessage.created_at).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            sender_id: newMessage.sender_id,
          }
          
          setMessages(prev => [...prev, formattedMessage])
          
          // Actualizar última conversación
          setConversations(prevConversations =>
            prevConversations.map(conv =>
              conv.id === threadId
                ? { 
                    ...conv, 
                    lastMessage: newMessage.content,
                    timestamp: newMessage.created_at 
                  }
                : conv
            )
          )

          // Scroll to bottom
          setTimeout(scrollToBottom, 100)
        }
      }
    )
  }, [user?.id])

  // Suscribirse a cambios en threads
  useEffect(() => {
    if (!user?.id) return

    threadSubscriptionRef.current = messagesService.subscribeToThreads(
      user.id,
      (payload) => {
        // Recargar conversaciones cuando haya cambios
        loadConversations()
      }
    )

    return () => {
      if (threadSubscriptionRef.current) {
        threadSubscriptionRef.current.unsubscribe()
      }
    }
  }, [user?.id, loadConversations])

  // Cargar conversaciones al inicio
  useEffect(() => {
    if (user?.id) {
      loadConversations()
    }
  }, [user?.id, loadConversations])

  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      subscribeToCurrentThread(selectedConversation.id)
    }

    return () => {
      // Limpiar suscripción al cambiar de conversación
      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current.unsubscribe()
        messageSubscriptionRef.current = null
      }
    }
  }, [selectedConversation, loadMessages, subscribeToCurrentThread])

  // Seleccionar conversación
  const selectConversation = (conversation) => {
    setSelectedConversation(conversation)
  }

  // Enviar mensaje
  const sendMessage = async (content) => {
    if (!content.trim() || !selectedConversation || !user?.id) return

    try {
      setSendingMessage(true)
      
      // Optimistic update - agregar mensaje inmediatamente
      const tempMessage = {
        id: `temp-${Date.now()}`,
        sender: 'me',
        content: content.trim(),
        timestamp: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sender_id: user.id,
      }
      
      setMessages(prev => [...prev, tempMessage])
      
      // Scroll to bottom immediately
      setTimeout(scrollToBottom, 50)
      
      // Enviar mensaje real
      const newMessage = await messagesService.sendMessage(
        selectedConversation.id,
        content,
        user.id
      )
      
      // Reemplazar mensaje temporal con el real
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessage.id ? newMessage : msg)
      )
      
      // Update conversation last message
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversation.id
            ? { 
                ...conv, 
                lastMessage: content,
                timestamp: new Date().toISOString()
              }
            : conv
        )
      )
    } catch (error) {
      console.error('Error enviando mensaje:', error)
      setError('Error al enviar el mensaje')
      
      // Remover mensaje temporal en caso de error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')))
    } finally {
      setSendingMessage(false)
    }
  }

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0)

  return {
    conversations,
    selectedConversation,
    messages,
    loading,
    sendingMessage,
    totalUnread,
    error,
    selectConversation,
    sendMessage,
    messagesEndRef,
  }
}

