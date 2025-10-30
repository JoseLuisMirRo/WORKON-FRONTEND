import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import * as messagesService from '../services/messagesService'

/**
 * Hook personalizado para iniciar un chat con otro usuario
 * Puede ser usado desde cualquier parte de la aplicación
 * @returns {Object} Función para iniciar chat
 */
export const useStartChat = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  /**
   * Inicia o navega a un chat con otro usuario
   * @param {string} otherUserId - ID del usuario con quien chatear
   * @param {number} proposalId - ID de la propuesta (opcional)
   * @returns {Promise<void>}
   */
  const startChat = async (otherUserId, proposalId = null) => {
    try {
      console.log('🚀 Iniciando chat con:', { otherUserId, proposalId, currentUserId: user?.id })
      
      if (!user?.id) {
        alert('Debes iniciar sesión para enviar mensajes')
        throw new Error('Debes iniciar sesión para enviar mensajes')
      }

      if (!otherUserId) {
        alert('ID de usuario no válido')
        throw new Error('ID de usuario no válido')
      }

      if (otherUserId === user.id) {
        alert('No puedes chatear contigo mismo')
        throw new Error('No puedes chatear contigo mismo')
      }

      console.log('✅ Validaciones pasadas, creando thread...')

      // Crear o encontrar thread existente
      const thread = await messagesService.createOrFindThread(
        user.id,
        otherUserId,
        proposalId
      )

      console.log('✅ Thread creado/encontrado:', thread)

      // Navegar a la página de mensajes con el thread seleccionado
      navigate('/messages', {
        state: {
          selectedThreadId: thread.id,
        },
      })
      
      console.log('✅ Navegando a /messages')
    } catch (error) {
      console.error('❌ Error iniciando chat:', error)
      alert(`Error: ${error.message}`)
      throw error
    }
  }

  return { startChat }
}



