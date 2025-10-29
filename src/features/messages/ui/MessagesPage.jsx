import { useMessagesController } from '../controllers/useMessagesController'
import { ConversationList } from './ConversationList'
import { ChatView } from './ChatView'
import { MessageInput } from './MessageInput'

export const MessagesPage = () => {
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    sendingMessage,
    selectConversation,
    sendMessage,
  } = useMessagesController()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="bg-background flex flex-col">
      
      <div className="flex-1 container mx-auto py-6 px-4 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border border-border overflow-hidden bg-card">
          {/* Conversations List */}
          <div className="md:col-span-1 h-[calc(100vh-12rem)]">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelect={selectConversation}
            />
          </div>

          {/* Chat View */}
          <div className="md:col-span-2 flex flex-col h-[calc(100vh-12rem)]">
            <ChatView
              conversation={selectedConversation}
              messages={messages}
            />
            
            {selectedConversation && (
              <MessageInput
                onSend={sendMessage}
                disabled={sendingMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

