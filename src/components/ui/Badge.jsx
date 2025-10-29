import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
  outline: "text-primary border-primary/50 hover:bg-primary/10",
  accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm",
  success: "border-transparent bg-success text-success-foreground hover:bg-success/90 shadow-sm",
}

export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '',
  onClick 
}) => {
  const variantClasses = badgeVariants[variant] || badgeVariants.default
  
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200",
        onClick && "cursor-pointer hover:scale-105",
        variantClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
