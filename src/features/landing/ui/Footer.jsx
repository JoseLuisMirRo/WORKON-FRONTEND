import { Link } from 'react-router-dom'
import { Wallet } from '../../../components/ui/Icons'

const footerLinks = {
  platform: [
    { label: 'Buscar Trabajos', href: '/feed' },
    { label: 'Cómo Funciona', href: '/como-funciona' },
    { label: 'Precios', href: '/precios' },
  ],
  resources: [
    { label: 'Documentación', href: '/docs' },
    { label: 'Centro de Ayuda', href: '/ayuda' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Términos de Uso', href: '/terminos' },
    { label: 'Privacidad', href: '/privacidad' },
    { label: 'Contacto', href: '/contacto' },
  ],
}

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto py-12 px-4">
        <div className="grid gap-8 md:grid-cols-4 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-15 w-15 items-center justify-center">
                <img src='/Workon-Logo.png' alt='workOn-logo' className='object-contain' />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by Stellar
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 WorkOn. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
