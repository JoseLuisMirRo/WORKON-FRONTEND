import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Badge } from '../../../components/ui/Badge'
import { cn } from '../../../lib/utils'

export const ConversationList = ({ conversations, selectedConversation, onSelect }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 24) {
      return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('es', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex flex-col h-full border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Mensajes</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={cn(
              "p-4 cursor-pointer hover:bg-accent/50 transition-colors border-b border-border",
              selectedConversation?.id === conversation.id && "bg-accent"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                  <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                </Avatar>
                {conversation.user.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-accent border-2 border-background" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{conversation.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{conversation.jobTitle}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conversation.timestamp)}
                    </span>
                    {conversation.unread > 0 && (
                      <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

