import { cn } from "../../lib/utils"

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-lg backdrop-blur-sm",
      "border-border/50 bg-card/80",
      hover && "transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20",
      className
    )}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  )
}

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  )
}

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  )
}
