import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { MoreVertical, Phone, Video } from '../../../components/ui/Icons'
import { cn } from '../../../lib/utils'

export function ChatView({ conversation, messages, messagesEndRef }) {
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center shadow-2xl shadow-primary/30">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Selecciona una conversación</p>
            <p className="text-sm text-muted-foreground">
              Elige un chat de la lista para comenzar a enviar mensajes
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                {conversation.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {conversation.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-accent border-2 border-background" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{conversation.name}</h3>
              {conversation.verified && (
                <Badge variant="accent" className="text-xs px-1.5 py-0">
                  ✓
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {conversation.online ? '🟢 En línea' : 'Desconectado'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/10 hover:text-accent"
          >
            <Phone className="h-5 w-5" size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-accent/10 hover:text-accent"
          >
            <Video className="h-5 w-5" size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-accent/10 hover:text-accent"
          >
            <MoreVertical className="h-5 w-5" size={20} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No hay mensajes aún</p>
              <p className="text-sm text-muted-foreground">Inicia la conversación enviando un mensaje</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {message.sender !== 'me' && (
                  <Avatar className="h-8 w-8 ring-2 ring-border/20">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-bold">
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    "max-w-[70%] space-y-1",
                    message.sender === 'me' ? 'items-end' : 'items-start'
                  )}
                >
                  <Card
                    className={cn(
                      "p-3 shadow-md",
                      message.sender === 'me'
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary/50'
                        : 'bg-card/80 border-border/50'
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </Card>
                  <span className={cn(
                    "text-xs text-muted-foreground px-2",
                    message.sender === 'me' ? 'text-right' : 'text-left'
                  )}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  )
}
