import { cn } from "../../lib/utils"

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      hover && "transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md",
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
