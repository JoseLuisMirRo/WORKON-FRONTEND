import { useState, useEffect } from 'react'
import * as messagesService from '../services/messagesService'

/**
 * Controller para manejar la lógica de mensajes
 * @returns {Object} Estado y funciones
 */
export const useMessagesController = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await messagesService.fetchConversations()
      setConversations(data)
      
      // Auto-select first conversation
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0])
      }
    } catch (error) {
      console.error('Error cargando conversaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      const data = await messagesService.fetchMessages(conversationId)
      setMessages(data)
      
      // Mark as read
      await messagesService.markAsRead(conversationId)
      
      // Update conversation unread count
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId ? { ...conv, unread: 0 } : conv
        )
      )
    } catch (error) {
      console.error('Error cargando mensajes:', error)
    }
  }

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation)
  }

  const sendMessage = async (content) => {
    if (!content.trim() || !selectedConversation) return

    try {
      setSendingMessage(true)
      const newMessage = await messagesService.sendMessage(
        selectedConversation.id,
        content
      )
      
      // Add to messages
      setMessages(prev => [...prev, newMessage])
      
      // Update conversation last message
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: content, timestamp: newMessage.timestamp }
            : conv
        )
      )
    } catch (error) {
      console.error('Error enviando mensaje:', error)
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
    selectConversation,
    sendMessage,
  }
}

