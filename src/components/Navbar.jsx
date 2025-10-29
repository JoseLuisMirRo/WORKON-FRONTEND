import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/DropdownMenu'
import { Badge } from './ui/Badge'
import { Bell, User, Wallet, LogOut, Settings, Menu, X } from './ui/Icons'
import { LogoIcon } from './Logo'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'
import { isConnected, requestAccess, getAddress } from "@stellar/freighter-api";


export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState()

  const isActive = (path) => location.pathname === path

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleLogout = async () => {
    await logout()
    closeMobileMenu()
    navigate('/login')
  }

  async function connectFreighter() {
    try {
      // Check if Freighter is connected
      const connectionResult = await isConnected();

      console.log("connectionResult", connectionResult);
      if (!connectionResult.isConnected) {
        // Request access to Freighter
        await requestAccess();
      }

      // Get the address after connection
      const addressResult = await getAddress();
      setWalletAddress(addressResult.address);
      console.log(addressResult)
    } catch (error) {
      console.error("Error trying to connect wallet", error)
    }
  }

  // Si no hay sesión, mostrar navbar simplificado
  if (!isAuthenticated) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 glass shadow-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group transition-all duration-300 hover:opacity-80">
            <LogoIcon size={50} className="group-hover:scale-105 transition-transform" />
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary">
              <Link to="/login">
                Iniciar Sesión
              </Link>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg">
              <Link to="/registro">
                Registrarse
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  // Navbar completo para usuarios autenticados
  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 glass shadow-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group transition-all duration-300 hover:opacity-80">
              <LogoIcon size={50} className="group-hover:scale-105 transition-transform" />
            </Link>

            {/* Menú Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/feed">
                <Button
                  variant={isActive('/feed') ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "transition-all duration-200",
                    !isActive('/feed') && "hover:text-accent"
                  )}
                >
                  Feed
                </Button>
              </Link>
              <Link to="/mis-trabajos">
                <Button
                  variant={isActive('/mis-trabajos') ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "transition-all duration-200",
                    !isActive('/mis-trabajos') && "hover:text-accent"
                  )}
                >
                  Mis Trabajos
                </Button>
              </Link>
              <Link to="/mensajes">
                <Button
                  variant={isActive('/mensajes') ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "relative transition-all duration-200",
                    !isActive('/mensajes') && "hover:text-accent"
                  )}
                >
                  Mensajes
                  <Badge
                    variant="destructive"
                    className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] animate-pulse"
                  >
                    3
                  </Badge>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Mostrar boton para connectar wallet */}

            {
              !walletAddress ?
                <>
                  {/* Wallet Connection Button */}
                  <Button 
                    onClick={connectFreighter} 
                    variant="outline" 
                    className="gap-2 hover:border-accent transition-all"
                  >
                    <Wallet className="h-4 w-4" size={16} />
                    <span className="hidden sm:inline font-semibold">
                      Connect Wallet
                    </span>
                  </Button>
                </>
                :
                <>
                  {/* Tokens - ocultar en móviles */}
                  < Button variant="outline" className="relative group">
                    <Link to="/tokens">
                      <Wallet className="h-4 w-4 transition-colors" size={16} />
                    </Link>
                  </Button>
                </>
            }

            {/* Perfil Desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-accent/50 transition-all">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Usuario" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : 'Usuario'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || 'usuario@ejemplo.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" size={16} />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tokens" className="flex items-center cursor-pointer">
                      <Wallet className="mr-2 h-4 w-4" size={16} />
                      <span>Tokens</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/configuracion" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" size={16} />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" size={16} />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Botón Hamburguesa - solo móvil */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" size={24} />
              ) : (
                <Menu className="h-6 w-6" size={24} />
              )}
            </Button>
          </div>
        </div>
      </nav >

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          {/* Overlay */}
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
            onClick={closeMobileMenu}
            onKeyDown={(e) => e.key === 'Escape' && closeMobileMenu()}
            aria-label="Cerrar menú"
            type="button"
          />

          {/* Menú */}
          <div className="relative bg-background border-b border-border shadow-lg animate-in slide-in-from-top duration-200">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {/* Enlaces de navegación */}
              <Link to="/feed" onClick={closeMobileMenu}>
                <Button
                  variant={isActive('/feed') ? 'default' : 'ghost'}
                  className="w-full justify-start text-left"
                >
                  Feed
                </Button>
              </Link>

              <Link to="/mis-trabajos" onClick={closeMobileMenu}>
                <Button
                  variant={isActive('/mis-trabajos') ? 'default' : 'ghost'}
                  className="w-full justify-start text-left"
                >
                  Mis Trabajos
                </Button>
              </Link>

              <Link to="/mensajes" onClick={closeMobileMenu}>
                <Button
                  variant={isActive('/mensajes') ? 'default' : 'ghost'}
                  className="w-full justify-start text-left relative"
                >
                  <span className="flex items-center gap-2">
                    Mensajes
                    <Badge
                      variant="destructive"
                      className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                    >
                      3
                    </Badge>
                  </span>
                </Button>
              </Link>

              <div className="border-t border-border pt-3 mt-3" />

              {/* Información del usuario */}
              <div className="px-3 py-2">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Usuario" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                      {user?.profile?.firstName?.[0] || 'U'}{user?.profile?.lastName?.[0] || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : 'Usuario'}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email || 'usuario@ejemplo.com'}</p>
                  </div>
                </div>

                {/* Opciones adicionales */}
                <Link to="/perfil" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <User className="mr-2 h-4 w-4" size={16} />
                    Mi Perfil
                  </Button>
                </Link>

                <Link to="/tokens" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Wallet className="mr-2 h-4 w-4" size={16} />
                    <span className="flex items-center gap-2">
                      Tokens{' '}
                      <span className="text-xs font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                        2,650 USDC
                      </span>
                    </span>
                  </Button>
                </Link>

                <Link to="/configuracion" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Settings className="mr-2 h-4 w-4" size={16} />
                    Configuración
                  </Button>
                </Link>

                <div className="border-t border-border pt-3 mt-3" />

                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" size={16} />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
    )
}
