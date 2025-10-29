import { Link } from 'react-router-dom'
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
import { Bell, User, Wallet, LogOut, Settings } from './ui/Icons'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" size={20} />
            </div>
            <span className="text-xl font-bold">WorkOn</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/feed"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Feed
            </Link>
            <Link
              to="/mis-trabajos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mis Trabajos
            </Link>
            <Link
              to="/mensajes"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              Mensajes
              <Badge
                variant="destructive"
                className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
              2
            </span>
          </Button>

          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link to="/tokens">
              <Wallet className="h-4 w-4" size={16} />
              <span className="hidden sm:inline">2,650 USDC</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Usuario" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">Juan Desarrollador</p>
                  <p className="text-xs leading-none text-muted-foreground">juan@ejemplo.com</p>
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
              <DropdownMenuItem className="cursor-pointer text-destructive">
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
