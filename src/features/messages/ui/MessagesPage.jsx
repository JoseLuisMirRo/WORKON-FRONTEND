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
    error,
    selectConversation,
    sendMessage,
    messagesEndRef,
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
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <div className="text-center space-y-4 max-w-md">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center shadow-2xl shadow-primary/30">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">No tienes conversaciones aún</p>
                <p className="text-sm text-muted-foreground">
                  Cuando apliques a trabajos o contrates freelancers, podrás chatear con ellos aquí
                </p>
              </div>
            </div>
          </div>
        ) : (
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
                messagesEndRef={messagesEndRef}
              />
              
              {selectedConversation && (
                <MessageInput
                  onSend={sendMessage}
                  disabled={sendingMessage}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

