# Feed Feature

Feature de feed de trabajos migrado desde stellar-freelance-marketplace usando arquitectura por features.

## 📁 Estructura

```
feed/
├── ui/                     # Componentes de UI
│   ├── FeedPage.jsx       # Componente principal
│   ├── JobCard.jsx        # Card de trabajo individual
│   ├── FeedFilters.jsx    # Sidebar izquierdo con filtros
│   ├── FeedStats.jsx      # Sidebar derecho con estadísticas
│   ├── SearchBar.jsx      # Barra de búsqueda y ordenamiento
│   └── Loading.jsx        # Componente de carga
├── services/              # Lógica de negocio y datos
│   └── feedService.js     # Servicios de API y datos mock
├── controllers/           # Controladores de estado
│   └── useFeedController.js # Hook personalizado con toda la lógica
└── index.js              # Punto de entrada del feature
```

## 🏗️ Arquitectura

### UI Layer (Componentes)
- **FeedPage**: Componente principal que orquesta toda la página del feed
- **JobCard**: Muestra información de un trabajo con acciones (like, save, apply)
- **FeedFilters**: Filtros de categoría, presupuesto, ubicación y empresas verificadas
- **FeedStats**: Muestra estadísticas del usuario y empresas sugeridas
- **SearchBar**: Búsqueda y ordenamiento de trabajos
- **Loading**: Estado de carga

### Service Layer
- **feedService.js**: Maneja todas las llamadas a API (simuladas con mock data)
  - `fetchJobs()`: Obtiene trabajos con filtros
  - `fetchTrendingSkills()`: Skills en tendencia
  - `fetchSuggestedCompanies()`: Empresas sugeridas
  - `likeJob()` / `unlikeJob()`: Gestión de likes
  - `saveJob()` / `unsaveJob()`: Gestión de guardados
  - `applyToJob()`: Aplicar a un trabajo
  - `fetchUserStats()`: Estadísticas del usuario

### Controller Layer
- **useFeedController.js**: Hook personalizado que gestiona:
  - Estado global del feed (jobs, filtros, likes, saves)
  - Lógica de filtrado y búsqueda
  - Acciones del usuario (like, save, apply)
  - Carga de datos

## 🎨 Componentes UI Base Creados

Los siguientes componentes base fueron creados en `src/components/ui/`:
- `Button`: Botones con variantes (primary, outline, ghost)
- `Card`: Cards con header, title y content
- `Badge`: Badges para skills y etiquetas
- `Avatar`: Avatares con imagen y fallback
- `Input`: Inputs estilizados
- `Select`: Select personalizado con dropdown
- `Separator`: Separador horizontal
- `Icons`: Iconos SVG reutilizables

## 🚀 Uso

```jsx
import { FeedPage } from './features/feed'

function App() {
  return <FeedPage />
}
```

## 🎯 Características

- ✅ Búsqueda de trabajos
- ✅ Filtros por categoría, presupuesto, ubicación
- ✅ Filtro de empresas verificadas
- ✅ Like y guardar trabajos
- ✅ Aplicar a trabajos
- ✅ Skills en tendencia
- ✅ Empresas sugeridas
- ✅ Estadísticas del usuario
- ✅ Ordenamiento (recientes, presupuesto, aplicantes)
- ✅ Diseño responsive con sidebars
- ✅ Estados de carga

## 🔄 Flujo de Datos

1. **FeedPage** importa y usa **useFeedController**
2. **useFeedController** consume **feedService** para datos
3. **Controller** gestiona estado y lógica
4. **UI components** reciben props del controller
5. **User actions** disparan funciones del controller
6. **Controller** actualiza estado y llama a servicios

## 📝 Notas de Migración

- Migrado de TypeScript a JavaScript
- Migrado de Next.js a React + Vite
- Componentes UI recreados sin dependencias externas
- Mock data incluido en el servicio para desarrollo
- Sistema de iconos SVG personalizado

