import { useRef, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { cn } from '../../../lib/utils'

export const ChatView = ({ conversation, messages }) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Selecciona una conversación para empezar</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
          <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{conversation.user.name}</p>
          <p className="text-xs text-muted-foreground">{conversation.jobTitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.sender === 'me' ? "flex-row-reverse" : "flex-row"
            )}
          >
            {message.sender !== 'me' && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={cn(
                "max-w-[70%] rounded-lg px-4 py-2",
                message.sender === 'me'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="text-sm">{message.content}</p>
              <p 
                className={cn(
                  "text-xs mt-1",
                  message.sender === 'me' 
                    ? "text-primary-foreground/70" 
                    : "text-muted-foreground"
                )}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

