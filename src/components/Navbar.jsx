import { Link, useLocation } from 'react-router-dom'
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
import { LogoIcon } from './Logo'
import { cn } from '../lib/utils'
import { isConnected, requestAccess, getAddress } from "@stellar/freighter-api";
import { useState, useEffect } from "react"

export function Navbar() {
  const location = useLocation()
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)

  useEffect(() => {
    if (walletAddress) {
      setIsWalletConnected(true);
    }
  }, [walletAddress]);

  async function connectFreighter() {
    // Check if Freighter is connected
    const connectionResult = await isConnected();
    if (!connectionResult.isConnected) {
      // Request access to Freighter
      await requestAccess();
    }

    // Get the address after connection
    const addressResult = await getAddress();
    if (addressResult.address) {
      setIsWalletConnected(true);
      setWalletAddress(addressResult.address);
    }
  }

  const isActive = (path) => location.pathname === path

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
          {/* Mostrar dinamicamente el boton para conectarse a la wallet */}
          {
            isWalletConnected ?
              // Info
              <>
                <Button variant="ghost" size="icon" className="relative group">
                  <Bell className="h-5 w-5 group-hover:text-accent transition-colors" size={20} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center animate-pulse shadow-lg">
                    2
                  </span>
                </Button>

                <Button variant="outline" className="gap-2 hover:border-accent" asChild>
                  <Link to="/tokens">
                    <Wallet className="h-4 w-4" size={16} />
                    <span className="hidden sm:inline font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                      2,650 USDC
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
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" size={16} />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
              :
              // Connection button
              <Button onClick={connectFreighter}>
                <span className='hidden sm:inline font-semibold'>
                  Conectar Wallet
                </span>
              </Button>
          }
        </div>
      </div>
    </nav>
  )
}
