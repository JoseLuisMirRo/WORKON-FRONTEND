import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'
import { Button } from './Button'
import { X } from './Icons'

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description,
  children, 
  footer,
  size = 'default',
  className = '' 
}) {
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={cn(
          "relative w-full rounded-2xl border border-border/50 bg-card shadow-2xl animate-slide-up",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-border/50 p-6">
            <div className="space-y-1.5">
              {title && (
                <h2 className="text-2xl font-semibold leading-none tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
              onClick={onClose}
            >
              <X className="h-5 w-5" size={20} />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border/50 p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

