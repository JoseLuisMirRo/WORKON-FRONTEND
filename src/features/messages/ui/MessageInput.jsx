import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Paperclip, Smile, Send } from '../../../components/ui/Icons'

export function MessageInput({ onSend, disabled }) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border/50 p-4 bg-card/50 backdrop-blur-sm">
      <div className="flex items-end gap-2">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-accent/10 hover:text-accent flex-shrink-0"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-accent/10 hover:text-accent flex-shrink-0"
            disabled={disabled}
          >
            <Smile className="h-5 w-5" size={20} />
          </Button>
        </div>

        <div className="flex-1 relative group">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            rows="1"
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              minHeight: '48px', 
              maxHeight: '120px',
              overflow: 'auto'
            }}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="flex-shrink-0 h-12 w-12 shadow-lg"
        >
          <Send className="h-5 w-5" size={20} />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 px-2">
        Presiona <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">Enter</kbd> para enviar, <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">Shift+Enter</kbd> para nueva línea
      </p>
    </div>
  )
}
