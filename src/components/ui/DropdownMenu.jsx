import { useState, useRef, useEffect } from 'react'
import { cn } from "../../lib/utils"

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {children.map((child, index) => {
        if (child.type === DropdownMenuTrigger) {
          return (
            <div key={index} onClick={() => setIsOpen(!isOpen)}>
              {child}
            </div>
          )
        }
        if (child.type === DropdownMenuContent) {
          return isOpen && <div key={index}>{child}</div>
        }
        return null
      })}
    </div>
  )
}

export const DropdownMenuTrigger = ({ children, asChild, className = '' }) => {
  if (asChild) {
    return children
  }
  return <button className={className}>{children}</button>
}

export const DropdownMenuContent = ({ children, className = '', align = 'center', forceMount }) => {
  const alignClass = align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2'
  
  return (
    <div className={cn(
      "absolute top-full z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      alignClass,
      className
    )}>
      {children}
    </div>
  )
}

export const DropdownMenuLabel = ({ children, className = '' }) => {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
      {children}
    </div>
  )
}

export const DropdownMenuItem = ({ children, asChild, className = '', onClick }) => {
  if (asChild) {
    return children
  }
  
  return (
    <div 
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const DropdownMenuSeparator = ({ className = '' }) => {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
  )
}

