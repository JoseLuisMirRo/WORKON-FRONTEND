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
import { User, Wallet, LogOut, Settings } from './ui/Icons'
import { LogoIcon } from './Logo'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 glass shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group transition-all duration-300 hover:opacity-80">
            <LogoIcon size={50} className="group-hover:scale-105 transition-transform" />
          </Link>

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
          <Button variant="outline" className="relative group ">
            <Link to="/tokens">
              <Wallet className="h-5 w-5 group-hover:text-accent transition-colors" size={20} />
              <span className="hidden sm:inline font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                
              </span>
            </Link>
          </Button>

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
      </div>
    </nav>
  )
}
