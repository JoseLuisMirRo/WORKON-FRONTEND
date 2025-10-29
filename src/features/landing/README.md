# Landing Feature

Landing page completa migrada desde stellar-freelance-marketplace usando arquitectura por features.

## 📁 Estructura

```
landing/
├── ui/                          # Componentes de presentación
│   ├── LandingPage.jsx         # Componente principal
│   ├── HeroSection.jsx         # Sección hero con CTA
│   ├── FeaturesSection.jsx     # Características principales
│   ├── HowItWorksSection.jsx   # Cómo funciona (3 pasos)
│   ├── CTASection.jsx          # Call-to-action final
│   └── Footer.jsx              # Footer con links
└── index.js                    # Punto de entrada
```

## 🎨 Secciones de la Landing

### 1. Hero Section
- Título impactante con highlight
- Badge de "Powered by Stellar"
- Descripción del valor
- 2 CTAs: "Conectar Wallet" y "Explorar Trabajos"
- Fondo con gradiente

### 2. Features Section
Tres características principales:
- **Pagos Seguros**: Contratos inteligentes
- **Transacciones Rápidas**: Velocidad de Stellar
- **Reputación On-Chain**: Historial inmutable

Cada feature tiene:
- Icono con color distintivo
- Título
- Descripción

### 3. How It Works Section
Tres pasos numerados:
1. **Conecta tu Wallet**: Autenticación descentralizada
2. **Publica o Aplica**: Marketplace de trabajos
3. **Trabaja y Cobra**: Sistema de pagos automático

### 4. CTA Section
- Icono de checkmark
- Mensaje motivacional
- Botón principal de acción
- Fondo con gradiente

### 5. Footer
- Logo y descripción de la marca
- Links organizados en 4 columnas:
  - Plataforma
  - Recursos
  - Legal
- Copyright

## 🚀 Uso

```jsx
import { LandingPage } from './features/landing'

function App() {
  const handleNavigateToFeed = () => {
    // Lógica de navegación
  }

  return <LandingPage onNavigateToFeed={handleNavigateToFeed} />
}
```

## 🎯 Props

### LandingPage
- `onNavigateToFeed`: Function - Callback cuando el usuario quiere ir al feed

## 🎨 Colores Utilizados

### Primary
- `#646cff` - Azul principal
- Usado en: badges, botones, iconos principales

### Accent
- `#9333ea` - Púrpura
- Usado en: icono de transacciones rápidas, número 2

### Success
- `#22c55e` - Verde
- Usado en: icono de reputación, número 3

## 📱 Responsive Design

### Mobile (< 768px)
- Layout de una columna
- CTAs apilados verticalmente
- Footer en columna única

### Tablet (768px - 1024px)
- Features en 2 columnas
- Footer en 4 columnas

### Desktop (> 1024px)
- Features en 3 columnas
- Steps en 3 columnas
- Espaciado completo

## 🔧 Componentes Reutilizables Usados

Todos desde `/src/components/ui/`:
- `Button` - CTAs y acciones
- `Card` - Features y CTA section
- `Icons` - Wallet, Shield, Zap, Users, ArrowRight, CheckCircle2

## 📝 Personalización

### Cambiar textos
Todos los textos están hardcoded en los componentes. Para personalizarlos, edita directamente en cada archivo `.jsx`.

### Cambiar colores
Los colores están definidos en los archivos `.css`. Busca las clases:
- `.feature-icon-primary`
- `.feature-icon-accent`
- `.feature-icon-success`
- `.step-number-primary`
- `.step-number-accent`
- `.step-number-success`

### Agregar más features
Edita el array `features` en `FeaturesSection.jsx`:
```jsx
const features = [
  {
    icon: NuevoIcono,
    title: 'Nueva Feature',
    description: 'Descripción...',
    color: 'primary', // primary, accent, success
  },
  // ...
];
```

### Agregar más steps
Edita el array `steps` en `HowItWorksSection.jsx`:
```jsx
const steps = [
  {
    number: 4,
    title: 'Nuevo Paso',
    description: 'Descripción...',
    color: 'primary',
  },
  // ...
];
```

### Cambiar links del footer
Edita el objeto `footerLinks` en `Footer.jsx`:
```jsx
const footerLinks = {
  platform: [
    { label: 'Nuevo Link', href: '/ruta' },
    // ...
  ],
  // ...
};
```

## 🎓 Arquitectura

Esta landing page sigue el principio de **componentes de presentación puros**:
- No tiene estado complejo (solo recibe props)
- No hace llamadas a APIs
- Es completamente estática
- Fácil de testear y mantener

Para agregar funcionalidad dinámica (ej: formularios, tracking), considera agregar:
- `services/` - Para llamadas a APIs
- `controllers/` - Para lógica de estado

## 🔄 Integración con el Feed

La landing tiene un botón "Explorar Trabajos" que llama a `onNavigateToFeed`. En `App.jsx`, esto cambia el estado para mostrar el FeedPage:

```jsx
const navigateToFeed = () => {
  setCurrentPage('feed')
}

<LandingPage onNavigateToFeed={navigateToFeed} />
```

## ✨ Características Visuales

- ✅ Gradientes sutiles
- ✅ Hover effects en cards
- ✅ Transiciones suaves
- ✅ Iconos con colores temáticos
- ✅ Tipografía clara y legible
- ✅ Espaciado consistente
- ✅ Bordes semi-transparentes
- ✅ Glass morphism en navegación

## 🚀 Próximas Mejoras

1. Agregar animaciones al hacer scroll
2. Implementar formulario de contacto
3. Agregar testimonios de usuarios
4. Agregar sección de FAQ
5. Implementar video demo
6. Agregar estadísticas en tiempo real
7. Modo claro/oscuro

