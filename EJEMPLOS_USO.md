# Ejemplos de Uso - Sistema de Feed

## 🎯 Cómo Usar el Feed

### 1. Uso Básico en App.jsx

```jsx
import { FeedPage } from './features/feed'

function App() {
  return <FeedPage />
}
```

### 2. Usar el Controller en Otro Componente

```jsx
import { useFeedController } from './features/feed/controllers/useFeedController'

function MiComponente() {
  const { 
    jobs, 
    loading, 
    toggleLike, 
    searchJobs 
  } = useFeedController()

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <input 
        onChange={(e) => searchJobs(e.target.value)} 
        placeholder="Buscar..."
      />
      {jobs.map(job => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <button onClick={() => toggleLike(job.id)}>Like</button>
        </div>
      ))}
    </div>
  )
}
```

### 3. Usar Servicios Directamente

```jsx
import * as feedService from './features/feed/services/feedService'

async function cargarTrabajos() {
  // Obtener trabajos con filtros
  const jobs = await feedService.fetchJobs({
    category: 'desarrollo',
    location: 'remoto',
    verifiedOnly: true
  })
  
  console.log(jobs)
}

async function aplicarATrabajo(jobId) {
  const success = await feedService.applyToJob(jobId)
  if (success) {
    alert('¡Aplicación enviada!')
  }
}
```

## 🎨 Usar Componentes UI Base

### Button

```jsx
import { Button } from './components/ui/Button'

// Variantes
<Button variant="primary">Primario</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano</Button>
<Button size="lg">Grande</Button>
<Button size="icon">🔍</Button>

// Con acción
<Button onClick={() => console.log('Click!')}>
  Hacer algo
</Button>
```

### Card

```jsx
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Título de la Card</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido de la card
  </CardContent>
</Card>

// Card con hover
<Card hover>
  <CardContent>Pasa el mouse sobre mí</CardContent>
</Card>
```

### Badge

```jsx
import { Badge } from './components/ui/Badge'

// Variantes
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>

// Con click
<Badge onClick={() => console.log('Click en badge')}>
  Clickeable
</Badge>
```

### Avatar

```jsx
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/Avatar'

<Avatar>
  <AvatarImage 
    src="https://ejemplo.com/avatar.jpg" 
    alt="Usuario" 
  />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Input

```jsx
import { Input } from './components/ui/Input'

<Input 
  placeholder="Escribe algo..."
  value={valor}
  onChange={(e) => setValor(e.target.value)}
/>
```

### Select

```jsx
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from './components/ui/Select'

<Select 
  value={seleccion} 
  onValueChange={setSeleccion}
  defaultValue="opcion1"
>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona una opción" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opcion1">Opción 1</SelectItem>
    <SelectItem value="opcion2">Opción 2</SelectItem>
    <SelectItem value="opcion3">Opción 3</SelectItem>
  </SelectContent>
</Select>
```

### Iconos

```jsx
import { 
  Heart, 
  Search, 
  Bookmark, 
  DollarSign 
} from './components/ui/Icons'

// Uso básico
<Heart size={20} />
<Search size={16} />

// Con relleno
<Heart size={20} filled={true} />
<Bookmark size={20} filled={isSaved} />

// Con className
<DollarSign className="mi-clase" size={24} />
```

## 🔧 Crear un Nuevo Feature Similar

### Estructura recomendada:

```
src/features/mi-feature/
├── ui/
│   ├── MiFeaturePage.jsx
│   ├── MiFeaturePage.css
│   ├── ComponenteA.jsx
│   └── ComponenteB.jsx
├── services/
│   └── miFeatureService.js
├── controllers/
│   └── useMiFeatureController.js
├── index.js
└── README.md
```

### Ejemplo de Service:

```javascript
// services/miFeatureService.js
export const fetchDatos = async (filtros = {}) => {
  // Simular llamada API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Retornar datos
  return [
    { id: 1, nombre: 'Item 1' },
    { id: 2, nombre: 'Item 2' }
  ]
}

export const crearItem = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('Item creado:', data)
  return true
}
```

### Ejemplo de Controller:

```javascript
// controllers/useMiFeatureController.js
import { useState, useEffect } from 'react'
import * as miFeatureService from '../services/miFeatureService'

export const useMiFeatureController = () => {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({})

  useEffect(() => {
    cargarDatos()
  }, [filtros])

  const cargarDatos = async () => {
    setLoading(true)
    const resultado = await miFeatureService.fetchDatos(filtros)
    setDatos(resultado)
    setLoading(false)
  }

  const actualizarFiltro = (nombre, valor) => {
    setFiltros(prev => ({ ...prev, [nombre]: valor }))
  }

  const crearNuevo = async (data) => {
    await miFeatureService.crearItem(data)
    cargarDatos()
  }

  return {
    datos,
    loading,
    filtros,
    actualizarFiltro,
    crearNuevo
  }
}
```

### Ejemplo de Componente UI:

```jsx
// ui/MiFeaturePage.jsx
import { useMiFeatureController } from '../controllers/useMiFeatureController'
import { Card, Button } from '../../../components/ui'

export const MiFeaturePage = () => {
  const { 
    datos, 
    loading, 
    crearNuevo 
  } = useMiFeatureController()

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <h1>Mi Feature</h1>
      <Button onClick={() => crearNuevo({ nombre: 'Nuevo' })}>
        Crear
      </Button>
      {datos.map(item => (
        <Card key={item.id}>
          {item.nombre}
        </Card>
      ))}
    </div>
  )
}
```

## 🎓 Patrones y Buenas Prácticas

### 1. Separación de Responsabilidades

```
UI = Presentación (lo que se ve)
Controller = Lógica (cómo funciona)
Service = Datos (de dónde vienen)
```

### 2. Props Drilling

```jsx
// ❌ Malo - pasar muchas props
<Componente 
  prop1={a} 
  prop2={b} 
  prop3={c} 
  prop4={d}
  prop5={e}
/>

// ✅ Bueno - usar un objeto
const config = { a, b, c, d, e }
<Componente config={config} />

// ✅ Mejor - usar un controller
const controller = useMiController()
<Componente {...controller} />
```

### 3. Estado Local vs Global

```jsx
// Estado local (dentro del componente)
const [abierto, setAbierto] = useState(false)

// Estado del feature (en controller)
const { jobs, loading } = useFeedController()

// Estado global (Context API o Zustand)
const { usuario } = useAuth()
```

## 🚀 Tips de Desarrollo

### Hot Module Replacement (HMR)
Los cambios en JSX se reflejan automáticamente. Si algo no se actualiza, guarda el archivo de nuevo.

### Debugging
```jsx
// Ver el estado en consola
useEffect(() => {
  console.log('Jobs:', jobs)
  console.log('Filtros:', filters)
}, [jobs, filters])
```

### Performance
```jsx
// Usar useMemo para cálculos costosos
const jobsFiltrados = useMemo(() => {
  return jobs.filter(job => job.verified)
}, [jobs])

// Usar useCallback para funciones
const handleClick = useCallback((id) => {
  console.log('Click:', id)
}, [])
```

---

¡Listo! Ahora tienes todos los ejemplos para usar y extender el sistema 🎉

