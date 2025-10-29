import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Badge } from '../../../components/ui/Badge'
import { cn } from '../../../lib/utils'
import { Clock } from '../../../components/ui/Icons'

export function ConversationList({ conversations, selectedConversation, onSelect }) {
  const getInitials = (name) => {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-1 p-4 overflow-y-auto">
      {conversations.map((conversation) => {
        const safeName = conversation?.name || 'Usuario'
        const safeAvatar = conversation?.avatar || '/placeholder.svg'
        const safeLastMessage = conversation?.lastMessage || 'Sin mensajes'
        const safeLastMessageTime = conversation?.lastMessageTime || ''
        const safeUnread = conversation?.unread || 0
        
        return (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={cn(
              "w-full p-4 rounded-xl text-left transition-all duration-200 group",
              "hover:bg-card/80 hover:shadow-md",
              selectedConversation?.id === conversation.id 
                ? "bg-primary/10 border-2 border-primary/50 shadow-lg shadow-primary/20" 
                : "border-2 border-transparent hover:border-accent/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className={cn(
                  "h-12 w-12 ring-2 transition-all",
                  selectedConversation?.id === conversation.id 
                    ? "ring-primary/50" 
                    : "ring-border/50 group-hover:ring-accent/50"
                )}>
                  <AvatarImage src={safeAvatar} alt={safeName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                    {getInitials(safeName)}
                  </AvatarFallback>
                </Avatar>
                {conversation?.online && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-accent border-2 border-background shadow-lg animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <h4 className={cn(
                      "font-semibold truncate transition-colors",
                      selectedConversation?.id === conversation.id 
                        ? "text-primary" 
                        : "group-hover:text-accent"
                    )}>
                      {safeName}
                    </h4>
                    {conversation?.verified && (
                      <Badge variant="accent" className="text-xs px-1.5 py-0 flex-shrink-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0 ml-2">
                    <Clock className="h-3 w-3" size={12} />
                    <span>{safeLastMessageTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className={cn(
                    "text-sm truncate flex-1",
                    safeUnread > 0
                      ? "font-medium text-foreground" 
                      : "text-muted-foreground"
                  )}>
                    {safeLastMessage}
                  </p>
                  {safeUnread > 0 && (
                    <Badge 
                      variant="default" 
                      className="flex-shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/30 animate-pulse"
                    >
                      {safeUnread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
