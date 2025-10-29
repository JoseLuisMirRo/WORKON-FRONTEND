import { cn } from "../../lib/utils"

export const Avatar = ({ children, className = '' }) => {
  return (
    <div className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}>
      {children}
    </div>
  )
}

export const AvatarImage = ({ src, alt }) => {
  return (
    <img 
      src={src} 
      alt={alt}
      className="aspect-square h-full w-full"
      onError={(e) => {
        e.target.style.display = 'none'
      }}
    />
  )
}

export const AvatarFallback = ({ children }) => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
      <span className="text-sm font-medium text-muted-foreground">{children}</span>
    </div>
  )
}
