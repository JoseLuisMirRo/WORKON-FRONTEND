import { useState, useRef, useEffect } from 'react'
import { cn } from "../../lib/utils"
import { ChevronDown } from './Icons'

export const Select = ({ 
  children, 
  value, 
  onValueChange,
  defaultValue 
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || value || '')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (newValue, label) => {
    setSelectedValue(newValue)
    setSelectedLabel(label)
    if (onValueChange) {
      onValueChange(newValue)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={selectRef}>
      {children.map(child => {
        if (child.type === SelectTrigger) {
          return (
            <div key="trigger" onClick={() => setIsOpen(!isOpen)}>
              {typeof child.props.children === 'function' 
                ? child.props.children(selectedLabel) 
                : child.props.children}
            </div>
          )
        }
        if (child.type === SelectContent) {
          return isOpen && (
            <SelectContent 
              key="content"
              selectedValue={selectedValue}
              onSelect={handleSelect}
            >
              {child.props.children}
            </SelectContent>
          )
        }
        return null
      })}
    </div>
  )
}

export const SelectTrigger = ({ children }) => {
  return (
    <button 
      type="button"
      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" size={16} />
    </button>
  )
}

export const SelectValue = ({ placeholder }) => {
  return <span className="text-muted-foreground">{placeholder}</span>
}

export const SelectContent = ({ children, selectedValue, onSelect }) => {
  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
      {children.map((child, index) => {
        if (child.type === SelectItem) {
          const isSelected = selectedValue === child.props.value
          return (
            <div
              key={child.props.value || index}
              className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                isSelected && "bg-accent text-accent-foreground font-medium"
              )}
              onClick={() => onSelect(child.props.value, child.props.children)}
            >
              {child.props.children}
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

export const SelectItem = ({ value, children }) => {
  return <>{children}</>
}
