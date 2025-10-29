import { cn } from "../../lib/utils"

const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/30",
    outline: "border border-input bg-transparent hover:bg-accent/10 hover:text-accent hover:border-accent/50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg shadow-secondary/30",
    ghost: "hover:bg-accent/10 hover:text-accent",
    link: "text-primary underline-offset-4 hover:underline",
    accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/30",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-lg px-3 text-sm",
    lg: "h-12 rounded-xl px-8 text-base",
    icon: "h-10 w-10",
  },
}

export const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  asChild = false,
}) => {
  const variantClasses = buttonVariants.variant[variant] || buttonVariants.variant.default
  const sizeClasses = buttonVariants.size[size] || buttonVariants.size.default
  
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95"
  
  if (asChild && children) {
    return children
  }
  
  return (
    <button 
      type={type}
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
