import React from 'react'

export const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { height: 'h-8', text: 'text-xl' },
    md: { height: 'h-12', text: 'text-3xl' },
    lg: { height: 'h-20', text: 'text-4xl' },
    xl: { height: 'h-32', text: 'text-5xl' }
  }

  const currentSize = sizes[size] || sizes.md

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo de WorkOn */}
      <img 
        src="/Workon-Logo.png" 
        alt="WorkOn Logo" 
        className={`${currentSize.height} object-contain`}
      />

      {/* Texto adicional si se requiere */}
      {showText && (
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground tracking-wider">POWERED BY STELLAR</p>
        </div>
      )}
    </div>
  )
}

// Componente simple solo con el icono
export const LogoIcon = ({ size = 40, className = '' }) => {
  return (
    <img 
      src="/Workon-Logo.png" 
      alt="WorkOn Logo" 
      className={className}
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}

